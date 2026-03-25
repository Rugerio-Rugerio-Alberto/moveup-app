"""Rutas globales del proyecto MoveUp."""

from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def api_root(request):
    """Devuelve una respuesta simple para confirmar que el backend está activo."""
    return JsonResponse({
        'message': 'MoveUp backend activo',
        'admin': '/admin/',
        'api': '/api/',
        'auth_login': '/api/auth/login/',
        'auth_register': '/api/auth/register/',
        'articles': '/api/articles/cards/'
    })


urlpatterns = [
    # Ruta raíz informativa.
    path('', api_root),

    # Panel administrativo de Django.
    path('admin/', admin.site.urls),

    # Endpoints REST principales definidos en la app `core`.
    path('api/', include('core.urls')),
]
