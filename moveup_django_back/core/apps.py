"""Configuración base de la aplicación `core`."""

from django.apps import AppConfig


class CoreConfig(AppConfig):
    """Define metadatos y ajustes generales de la app principal."""

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'
