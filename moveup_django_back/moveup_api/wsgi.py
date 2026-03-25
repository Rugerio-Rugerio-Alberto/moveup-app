"""Configuración WSGI para despliegue tradicional del proyecto."""

import os
from django.core.wsgi import get_wsgi_application

# Define el módulo de configuración antes de levantar la app WSGI.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'moveup_api.settings')
application = get_wsgi_application()
