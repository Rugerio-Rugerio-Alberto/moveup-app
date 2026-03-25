"""Clases auxiliares de autenticación para la API.

Este archivo se conserva por compatibilidad. La configuración principal usa
`core.authentication.BearerTokenAuthentication`.
"""

from rest_framework.authentication import TokenAuthentication


class BearerTokenAuthentication(TokenAuthentication):
    """Permite autenticar usando el prefijo `Bearer` en lugar de `Token`.

    Ejemplo esperado en el encabezado HTTP:
    `Authorization: Bearer <token>`
    """

    keyword = 'Bearer'
