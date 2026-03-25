"""Configuración del panel de administración de Django para la app `core`."""

from django.contrib import admin
from .models import Profile, PasswordResetToken, ActivityLog


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    """Vista administrativa del perfil de usuario."""

    # Columnas que se muestran en la lista del administrador.
    list_display = ('id', 'user', 'level', 'created_at')


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    """Vista administrativa de tokens para recuperación de contraseña."""

    list_display = ('id', 'user', 'token', 'created_at', 'used_at')
    search_fields = ('token', 'user__username', 'user__email')


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    """Vista administrativa del historial de acciones del usuario."""

    list_display = ('id', 'user', 'action', 'created_at')
    search_fields = ('action', 'user__username')
