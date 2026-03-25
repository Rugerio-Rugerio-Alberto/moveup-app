"""Serializadores que validan y transforman datos de entrada/salida de la API."""

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    ActivityLog,
    FavoriteArticle,
    IPAQResult,
    PasswordResetToken,
    Profile,
    RoutineProgress,
)


class RegisterSerializer(serializers.Serializer):
    """Valida la información necesaria para registrar una cuenta nueva."""

    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)

    def validate_username(self, value):
        """Evita registrar dos usuarios con el mismo nombre de usuario."""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('El usuario ya existe.')
        return value

    def validate_email(self, value):
        """Evita registrar dos cuentas con el mismo correo electrónico."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('El correo ya está registrado.')
        return value

    def create(self, validated):
        """Crea el usuario, su perfil inicial y un registro en la bitácora."""
        user = User.objects.create_user(
            username=validated['username'],
            email=validated['email'],
            password=validated['password'],
            first_name=validated.get('first_name', ''),
            last_name=validated.get('last_name', ''),
        )

        # Todo usuario inicia con nivel bajo hasta que complete evaluaciones.
        Profile.objects.create(user=user, level='bajo')
        ActivityLog.objects.create(user=user, action='register')
        return user


class LoginSerializer(serializers.Serializer):
    """Valida credenciales para iniciar sesión en el sistema."""

    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        """Autentica al usuario con el backend de Django."""
        user = authenticate(username=attrs['username'], password=attrs['password'])
        if not user:
            raise serializers.ValidationError('Credenciales inválidas.')

        attrs['user'] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """Expone únicamente los campos públicos del usuario."""

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class ProfileSerializer(serializers.ModelSerializer):
    """Serializa el perfil del usuario con su nivel de actividad."""

    class Meta:
        model = Profile
        fields = ['level']


class PasswordResetRequestSerializer(serializers.Serializer):
    """Recibe el correo de la cuenta que desea recuperar contraseña."""

    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Valida el token de recuperación y la nueva contraseña."""

    reset_token = serializers.CharField()
    new_password = serializers.CharField(min_length=8, write_only=True)


class FavoriteArticleSerializer(serializers.ModelSerializer):
    """Adapta artículos favoritos al formato que consume el frontend."""

    # Se devuelve `source` como objeto para respetar la estructura esperada.
    source = serializers.SerializerMethodField()

    # Se mantiene la convención camelCase del frontend sin cambiar la BD.
    urlToImage = serializers.CharField(source='url_to_image', required=False, allow_blank=True)
    publishedAt = serializers.DateTimeField(source='published_at', required=False, allow_null=True)

    class Meta:
        model = FavoriteArticle
        fields = [
            'id', 'title', 'description', 'url', 'urlToImage', 'source', 'publishedAt', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_source(self, obj):
        """Devuelve la fuente del artículo como un objeto con propiedad `name`."""
        return {'name': obj.source_name or ''}

    def create(self, validated_data):
        """Extrae manualmente el nombre de la fuente desde la carga original."""
        source = self.initial_data.get('source') or {}
        source_name = source.get('name', '') if isinstance(source, dict) else ''
        validated_data['source_name'] = source_name
        return super().create(validated_data)


class IPAQResultSerializer(serializers.ModelSerializer):
    """Serializa resultados IPAQ manteniendo compatibilidad con nombres camelCase."""

    totalMETMinutes = serializers.IntegerField(source='total_met_minutes')
    vigorousMETMinutes = serializers.IntegerField(source='vigorous_met_minutes')
    moderateMETMinutes = serializers.IntegerField(source='moderate_met_minutes')
    walkingMETMinutes = serializers.IntegerField(source='walking_met_minutes')
    sittingMinutes = serializers.IntegerField(source='sitting_minutes')

    class Meta:
        model = IPAQResult
        fields = [
            'id', 'totalMETMinutes', 'vigorousMETMinutes', 'moderateMETMinutes',
            'walkingMETMinutes', 'sittingMinutes', 'category', 'answers', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RoutineProgressSerializer(serializers.ModelSerializer):
    """Serializa el progreso de rutina diaria del usuario."""

    habitsCompleted = serializers.ListField(
        source='habits_completed',
        child=serializers.CharField(),
        required=False,
    )
    isComplete = serializers.BooleanField(source='is_complete', required=False)

    class Meta:
        model = RoutineProgress
        fields = ['id', 'date', 'habitsCompleted', 'isComplete', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
