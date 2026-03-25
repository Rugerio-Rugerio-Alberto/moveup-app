"""Configuración ASGI para exponer la aplicación en servidores compatibles."""

import os
from django.core.asgi import get_asgi_application

# Define el módulo de settings antes de construir la aplicación ASGI.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'moveup_api.settings')
application = get_asgi_application()
