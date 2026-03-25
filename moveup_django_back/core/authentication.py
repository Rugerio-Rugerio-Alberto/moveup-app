"""Implementaciones de autenticación utilizadas por Django REST Framework."""

from rest_framework.authentication import TokenAuthentication


class BearerTokenAuthentication(TokenAuthentication):
    """Soporta tokens enviados como `Authorization: Bearer <token>`.

    Django REST Framework, por defecto, espera el prefijo `Token`. En este
    proyecto se añadió esta clase para aceptar el formato Bearer, que es el
    que normalmente consumen aplicaciones web y móviles.
    """

    keyword = 'Bearer'
