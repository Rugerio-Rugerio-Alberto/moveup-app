"""Rutas expuestas por la aplicación `core`."""

from django.urls import path
from .views import (
    ArticleCardsView,
    FavoriteDeleteView,
    FavoritesView,
    IPAQLatestView,
    IPAQSubmitView,
    LoginView,
    MeView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    RegisterView,
    RoutineProgressView,
)

# Cada ruta se agrupa por funcionalidad para facilitar su lectura y mantenimiento.
urlpatterns = [
    # Endpoints de autenticación y datos del usuario.
    path('auth/register/', RegisterView.as_view()),
    path('auth/login/', LoginView.as_view()),
    path('auth/me/', MeView.as_view()),
    path('auth/password-reset/request/', PasswordResetRequestView.as_view()),
    path('auth/password-reset/confirm/', PasswordResetConfirmView.as_view()),
    path('me/', MeView.as_view()),

    # Endpoints funcionales de la aplicación.
    path('articles/cards/', ArticleCardsView.as_view()),
    path('favorites/', FavoritesView.as_view()),
    path('favorites/<int:pk>/', FavoriteDeleteView.as_view()),
    path('ipaq/latest/', IPAQLatestView.as_view()),
    path('ipaq/submit/', IPAQSubmitView.as_view()),
    path('routine/progress/', RoutineProgressView.as_view()),
]
