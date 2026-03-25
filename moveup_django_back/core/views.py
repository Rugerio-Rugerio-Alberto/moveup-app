"""Vistas de la API REST para el backend MoveUp.

En este módulo se implementan los endpoints principales de autenticación,
perfil, artículos, favoritos, cuestionario IPAQ y progreso de rutinas.
"""

import json
from pathlib import Path
from django.contrib.auth.password_validation import validate_password
from rest_framework import permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import (
    ActivityLog,
    FavoriteArticle,
    IPAQResult,
    PasswordResetToken,
    Profile,
    RoutineProgress,
)
from .serializers import (
    FavoriteArticleSerializer,
    IPAQResultSerializer,
    LoginSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    ProfileSerializer,
    RegisterSerializer,
    RoutineProgressSerializer,
    UserSerializer,
)

# Ruta base del proyecto, usada para localizar archivos auxiliares.
BASE_DIR = Path(__file__).resolve().parent.parent

# Archivo JSON local que contiene las tarjetas o artículos precargados.
CARDS_JSON_PATH = BASE_DIR / 'seed_data' / 'cards.json'


def load_cards():
    """Carga el catálogo de tarjetas desde el archivo JSON local.

    Si el archivo no existe o el contenido no es una lista válida, se devuelve
    una lista vacía para evitar romper el endpoint de artículos.
    """
    if not CARDS_JSON_PATH.exists():
        return []

    with CARDS_JSON_PATH.open('r', encoding='utf-8') as f:
        data = json.load(f)

    return data if isinstance(data, list) else []


class RegisterView(APIView):
    """Endpoint para registrar una cuenta nueva."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """Valida la información enviada y crea el usuario."""
        ser = RegisterSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response({'detail': 'Cuenta creada correctamente.'}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """Endpoint para autenticar usuarios y entregar un token."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """Verifica credenciales y devuelve token, usuario y perfil."""
        ser = LoginSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.validated_data['user']

        # Si el usuario ya tenía token, se reutiliza; si no, se crea uno nuevo.
        token, _ = Token.objects.get_or_create(user=user)

        # Garantiza que todo usuario autenticado tenga su perfil asociado.
        profile, _ = Profile.objects.get_or_create(user=user)

        ActivityLog.objects.create(user=user, action='login')
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'profile': ProfileSerializer(profile).data,
        })


class MeView(APIView):
    """Endpoint para consultar los datos del usuario autenticado."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Retorna información del usuario actual y su perfil."""
        profile, _ = Profile.objects.get_or_create(user=request.user)
        return Response({
            'user': UserSerializer(request.user).data,
            'profile': ProfileSerializer(profile).data,
        })


class PasswordResetRequestView(APIView):
    """Solicita un token de recuperación de contraseña a partir de un correo."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """Genera un token temporal si existe una cuenta asociada al correo."""
        ser = PasswordResetRequestSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        email = ser.validated_data['email']
        user = None

        # Se intenta resolver el modelo de usuario de forma flexible.
        try:
            user = request.user.__class__.objects.get(email=email)
        except Exception:
            from django.contrib.auth.models import User
            user = User.objects.filter(email=email).first()

        # Por seguridad no se revela si el correo existe o no existe realmente.
        if not user:
            return Response({'detail': 'Si el correo existe, se generará un token.'})

        token_str = PasswordResetToken.generate_token()
        PasswordResetToken.objects.create(user=user, token=token_str)
        ActivityLog.objects.create(user=user, action='password_reset_request')
        return Response({'reset_token': token_str})


class PasswordResetConfirmView(APIView):
    """Confirma un cambio de contraseña usando un token previamente generado."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """Valida token, valida contraseña nueva y actualiza la cuenta."""
        ser = PasswordResetConfirmSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        reset_token = ser.validated_data['reset_token']
        new_password = ser.validated_data['new_password']

        try:
            rt = PasswordResetToken.objects.select_related('user').get(token=reset_token)
        except PasswordResetToken.DoesNotExist:
            return Response({'detail': 'Token inválido.'}, status=status.HTTP_400_BAD_REQUEST)

        if rt.is_used:
            return Response({'detail': 'Token ya fue usado.'}, status=status.HTTP_400_BAD_REQUEST)

        # Se reutilizan las reglas estándar de seguridad de contraseñas de Django.
        try:
            validate_password(new_password, user=rt.user)
        except Exception as e:
            return Response(
                {
                    'detail': 'Contraseña no válida.',
                    'errors': [str(x) for x in getattr(e, 'error_list', [e])],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        rt.user.set_password(new_password)
        rt.user.save()
        rt.mark_used()
        ActivityLog.objects.create(user=rt.user, action='password_reset_confirm')

        # Se eliminan tokens de sesión previos para forzar nuevo inicio de sesión.
        Token.objects.filter(user=rt.user).delete()
        return Response({'detail': 'Contraseña actualizada.'})


class ArticleCardsView(APIView):
    """Devuelve tarjetas de contenido filtradas por nivel o categoría."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Lee el catálogo local y aplica filtros enviados por query string."""
        nivel = request.query_params.get('nivel')
        categoria = request.query_params.get('categoria')
        cards = load_cards()

        # Filtro por nivel de actividad si se envía uno válido.
        if nivel in {'alto', 'medio', 'bajo'}:
            cards = [c for c in cards if c.get('nivelActividad') == nivel]

        # Filtro por categoría, omitiendo el valor especial `todas`.
        if categoria and categoria != 'todas':
            cards = [c for c in cards if c.get('categoria') == categoria]

        return Response(cards)


class FavoritesView(APIView):
    """Permite listar y registrar artículos favoritos del usuario."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Devuelve todos los artículos favoritos del usuario autenticado."""
        items = FavoriteArticle.objects.filter(user=request.user)
        return Response(FavoriteArticleSerializer(items, many=True).data)

    def post(self, request):
        """Guarda un artículo favorito evitando duplicados por usuario."""
        serializer = FavoriteArticleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        existing = FavoriteArticle.objects.filter(
            user=request.user,
            title=serializer.validated_data['title'],
            url=serializer.validated_data['url'],
        ).first()
        if existing:
            return Response(FavoriteArticleSerializer(existing).data, status=status.HTTP_200_OK)

        item = serializer.save(user=request.user)
        ActivityLog.objects.create(user=request.user, action='favorite_add')
        return Response(FavoriteArticleSerializer(item).data, status=status.HTTP_201_CREATED)


class FavoriteDeleteView(APIView):
    """Elimina un artículo favorito específico del usuario autenticado."""

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        """Busca el favorito por id y lo elimina si pertenece al usuario."""
        item = FavoriteArticle.objects.filter(user=request.user, pk=pk).first()
        if not item:
            return Response({'detail': 'Favorito no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        item.delete()
        ActivityLog.objects.create(user=request.user, action='favorite_delete')
        return Response(status=status.HTTP_204_NO_CONTENT)


class IPAQLatestView(APIView):
    """Devuelve el resultado IPAQ más reciente del usuario."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Consulta el registro más nuevo gracias al orden por defecto del modelo."""
        latest = IPAQResult.objects.filter(user=request.user).first()
        if not latest:
            return Response({}, status=status.HTTP_200_OK)
        return Response(IPAQResultSerializer(latest).data)


class IPAQSubmitView(APIView):
    """Recibe y almacena un nuevo resultado del cuestionario IPAQ."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Guarda el resultado y sincroniza el nivel del perfil del usuario."""
        serializer = IPAQResultSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = IPAQResult.objects.create(user=request.user, **serializer.validated_data)

        profile, _ = Profile.objects.get_or_create(user=request.user)
        category = result.category.lower()

        # Se normaliza `moderado` a `medio` para coincidir con Profile.LEVEL_CHOICES.
        profile.level = 'medio' if category == 'moderado' else category
        profile.save(update_fields=['level', 'updated_at'])

        ActivityLog.objects.create(user=request.user, action='ipaq_submit')
        return Response(IPAQResultSerializer(result).data, status=status.HTTP_201_CREATED)


class RoutineProgressView(APIView):
    """Administra el historial de avance de rutinas del usuario."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Lista todos los registros de avance asociados al usuario actual."""
        items = RoutineProgress.objects.filter(user=request.user)
        return Response(RoutineProgressSerializer(items, many=True).data)

    def post(self, request):
        """Crea o actualiza avances diarios a partir de una lista de registros."""
        # El endpoint acepta una lista directa o un objeto con la clave `items`.
        rows = request.data if isinstance(request.data, list) else request.data.get('items', [])
        if not isinstance(rows, list):
            return Response({'detail': 'Formato inválido.'}, status=status.HTTP_400_BAD_REQUEST)

        saved_items = []
        for row in rows:
            serializer = RoutineProgressSerializer(data=row)
            serializer.is_valid(raise_exception=True)

            # Si ya existe un registro para esa fecha, se actualiza; si no, se crea.
            obj, _ = RoutineProgress.objects.update_or_create(
                user=request.user,
                date=serializer.validated_data['date'],
                defaults={
                    'habits_completed': serializer.validated_data.get('habits_completed', []),
                    'is_complete': serializer.validated_data.get('is_complete', False),
                }
            )
            saved_items.append(obj)

        ActivityLog.objects.create(user=request.user, action='routine_progress_save')
        return Response(RoutineProgressSerializer(saved_items, many=True).data)
