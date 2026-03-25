#!/usr/bin/env python
"""Punto de entrada principal para tareas administrativas de Django.

Este archivo se encarga de cargar variables de entorno desde un archivo
`.env` local y después delega la ejecución al comando de Django
correspondiente (runserver, migrate, createsuperuser, etc.).
"""

import os
import sys


def load_dotenv():
    """Carga variables de entorno desde `.env` si el archivo existe.

    Se utiliza una implementación sencilla para evitar depender de una
    librería externa adicional. Solo procesa líneas con formato `CLAVE=VALOR`
    y omite comentarios o líneas vacías.
    """
    path = os.path.join(os.path.dirname(__file__), '.env')
    if not os.path.exists(path):
        return

    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue

            k, v = line.split('=', 1)
            os.environ.setdefault(k.strip(), v.strip())


def main():
    """Inicializa la configuración del proyecto y ejecuta el comando pedido."""
    # Antes de arrancar Django, se cargan variables locales del archivo `.env`.
    load_dotenv()

    # Indica cuál es el módulo de configuración principal del proyecto.
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'moveup_api.settings')

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError("Couldn't import Django.") from exc

    # Ejecuta el comando recibido por terminal, por ejemplo:
    # `python manage.py runserver` o `python manage.py migrate`.
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
