"""Modelos de datos principales del backend MoveUp.

Aquí se define la estructura persistente de la aplicación: perfiles,
recuperación de contraseña, actividad del usuario, favoritos, resultados del
cuestionario IPAQ y progreso de rutinas.
"""

import secrets
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class Profile(models.Model):
    """Extiende la información básica del usuario con su nivel de actividad."""

    LEVEL_CHOICES = [
        ('bajo', 'Bajo'),
        ('medio', 'Medio'),
        ('alto', 'Alto'),
    ]

    # Relación uno a uno con el usuario autenticado del sistema.
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    # Nivel detectado o asignado al usuario dentro de la aplicación.
    level = models.CharField(max_length=16, choices=LEVEL_CHOICES, default='bajo')

    # Fechas de control para auditoría básica.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        """Representación legible del modelo en panel admin y consola."""
        return f'Profile({self.user.username})'


class PasswordResetToken(models.Model):
    """Token temporal utilizado para restablecer la contraseña del usuario."""

    # Un usuario puede solicitar varios tokens a lo largo del tiempo.
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reset_tokens')

    # Token único para validar la operación de cambio de contraseña.
    token = models.CharField(max_length=80, unique=True, db_index=True)

    # Fecha de creación y momento en que se consumió el token.
    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)

    @property
    def is_used(self):
        """Indica si el token ya fue utilizado previamente."""
        return self.used_at is not None

    @staticmethod
    def generate_token():
        """Genera un token seguro apto para usar en URLs o peticiones HTTP."""
        return secrets.token_urlsafe(32)

    def mark_used(self):
        """Marca el token como usado para impedir reutilización."""
        self.used_at = timezone.now()
        self.save(update_fields=['used_at'])

    def __str__(self):
        """Representación legible del token para depuración o administración."""
        return f'ResetToken({self.user.username}, used={self.is_used})'


class ActivityLog(models.Model):
    """Bitácora sencilla para registrar acciones relevantes del usuario."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activity_logs')
    action = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """Resumen corto del evento registrado."""
        return f'ActivityLog({self.user.username}, {self.action})'


class FavoriteArticle(models.Model):
    """Almacena artículos marcados como favoritos por cada usuario."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_articles')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    url = models.URLField(max_length=500)
    url_to_image = models.URLField(max_length=500, blank=True)
    source_name = models.CharField(max_length=120, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Evita duplicar el mismo artículo favorito para un mismo usuario.
        unique_together = ('user', 'title', 'url')
        ordering = ['-created_at']

    def __str__(self):
        """Texto descriptivo del favorito."""
        return f'FavoriteArticle({self.user.username}, {self.title})'


class IPAQResult(models.Model):
    """Guarda el resultado calculado del cuestionario IPAQ del usuario."""

    CATEGORY_CHOICES = [
        ('bajo', 'Bajo'),
        ('moderado', 'Moderado'),
        ('alto', 'Alto'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ipaq_results')

    # Métricas resumidas calculadas a partir de las respuestas del cuestionario.
    total_met_minutes = models.PositiveIntegerField(default=0)
    vigorous_met_minutes = models.PositiveIntegerField(default=0)
    moderate_met_minutes = models.PositiveIntegerField(default=0)
    walking_met_minutes = models.PositiveIntegerField(default=0)
    sitting_minutes = models.PositiveIntegerField(default=0)

    # Categoría final de actividad física obtenida del procesamiento.
    category = models.CharField(max_length=16, choices=CATEGORY_CHOICES, default='bajo')

    # Se conservan las respuestas originales en formato JSON para trazabilidad.
    answers = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        """Representación legible del resultado IPAQ."""
        return f'IPAQResult({self.user.username}, {self.category})'


class RoutineProgress(models.Model):
    """Representa el avance diario de hábitos o rutinas del usuario."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='routine_progress')
    date = models.DateField()

    # Lista JSON con los hábitos completados en una fecha específica.
    habits_completed = models.JSONField(default=list, blank=True)

    # Indicador general de si la rutina del día quedó completa.
    is_complete = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Un usuario solo puede tener un registro por día.
        unique_together = ('user', 'date')
        ordering = ['-date']

    def __str__(self):
        """Muestra usuario, fecha y estado general del avance."""
        return f'RoutineProgress({self.user.username}, {self.date}, {self.is_complete})'
