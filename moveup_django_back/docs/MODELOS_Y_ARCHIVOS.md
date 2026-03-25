# Modelos, archivos y responsabilidades del proyecto

Este documento resume qué hace cada archivo importante del backend y cuál es su papel dentro de la aplicación.

---

## 1. Archivos raíz

### `manage.py`
Es el punto de entrada para ejecutar comandos de Django, por ejemplo:
- iniciar el servidor;
- aplicar migraciones;
- crear superusuarios;
- ejecutar comandos de administración.

### `requirements.txt`
Lista las dependencias necesarias para levantar el proyecto.

### `.env.example`
Sirve como referencia para configurar variables de entorno del proyecto.

### `README_DB.md`
Explica cómo trabajar la base de datos en modo de desarrollo.

### `README_SETUP.md`
Explica el proceso de instalación y ejecución del proyecto.

---

## 2. Carpeta `moveup_api/`

### `settings.py`
Archivo central de configuración. Aquí se define:
- base de datos;
- aplicaciones instaladas;
- middleware;
- CORS;
- autenticación de DRF;
- zona horaria y configuración base del proyecto.

### `urls.py`
Archivo de enrutamiento principal. Desde aquí se integran las rutas del módulo `core` bajo el prefijo `/api/`.

### `asgi.py` y `wsgi.py`
Archivos de entrada para despliegue del proyecto en distintos servidores.

---

## 3. Carpeta `core/`

### `models.py`
Contiene las entidades persistentes del sistema.

#### `Profile`
Guarda el nivel de actividad del usuario (`bajo`, `medio`, `alto`).

#### `PasswordResetToken`
Representa los tokens de recuperación de contraseña. Permite saber si un token ya fue usado.

#### `ActivityLog`
Registra acciones importantes del usuario, por ejemplo:
- registro;
- login;
- solicitud de reseteo;
- guardado o eliminación de favoritos;
- envío del IPAQ;
- guardado del progreso de rutina.

#### `FavoriteArticle`
Guarda artículos marcados como favoritos por un usuario.

#### `IPAQResult`
Almacena el resultado del cuestionario IPAQ, incluyendo minutos MET y categoría final.

#### `RoutineProgress`
Registra el avance diario del usuario respecto a hábitos completados.

---

### `serializers.py`
Se encarga de validar y transformar los datos que entran o salen de la API.

#### `RegisterSerializer`
Valida usuario, correo y contraseña para registro.

#### `LoginSerializer`
Valida credenciales mediante `authenticate`.

#### `UserSerializer`
Expone información básica del usuario.

#### `ProfileSerializer`
Expone el nivel del perfil.

#### `PasswordResetRequestSerializer`
Valida el correo para solicitar recuperación.

#### `PasswordResetConfirmSerializer`
Valida token y nueva contraseña.

#### `FavoriteArticleSerializer`
Adapta artículos favoritos al formato esperado por el frontend.

#### `IPAQResultSerializer`
Convierte nombres internos del modelo al formato usado por el cliente, por ejemplo `total_met_minutes` a `totalMETMinutes`.

#### `RoutineProgressSerializer`
Expone y recibe el progreso diario con nombres en camelCase para facilitar integración con frontend.

---

### `views.py`
Contiene la lógica principal del backend.

#### `RegisterView`
Crea una cuenta nueva.

#### `LoginView`
Autentica al usuario, genera o recupera su token y devuelve información del perfil.

#### `MeView`
Devuelve los datos del usuario autenticado y su perfil.

#### `PasswordResetRequestView`
Genera un token de recuperación para un correo existente.

#### `PasswordResetConfirmView`
Valida el token, actualiza la contraseña y elimina tokens de sesión previos.

#### `ArticleCardsView`
Carga tarjetas desde `cards.json` y permite filtrarlas.

#### `FavoritesView`
Lista y crea favoritos para el usuario autenticado.

#### `FavoriteDeleteView`
Elimina un favorito por identificador.

#### `IPAQLatestView`
Devuelve el resultado IPAQ más reciente del usuario.

#### `IPAQSubmitView`
Guarda un nuevo resultado IPAQ y actualiza el nivel del perfil.

#### `RoutineProgressView`
Consulta o guarda avance diario de rutina.

---

### `urls.py`
Relaciona rutas del módulo `core` con sus vistas. Centraliza los endpoints funcionales de la aplicación.

### `authentication.py`
Implementa autenticación por token con prefijo `Bearer`.

### `auth.py`
Contiene una implementación duplicada del autenticador Bearer. Actualmente el proyecto utiliza `authentication.py` desde la configuración principal.

### `admin.py`
Sirve para registrar modelos y administrarlos desde el panel de Django si se desea ampliar esa parte.

### `apps.py`
Contiene la configuración básica de la aplicación `core`.

---

## 4. Carpeta `seed_data/`

### `cards.json`
Archivo de datos base para las tarjetas de contenido. Se usa como fuente local para devolver tarjetas sin depender de un servicio externo.

---

## 5. Resumen práctico

Si se quiere explicar el backend de manera directa, puede resumirse así:

- `models.py` define qué se guarda;
- `serializers.py` valida lo que entra y adapta lo que sale;
- `views.py` resuelve la lógica de cada endpoint;
- `urls.py` conecta las rutas;
- `settings.py` configura cómo corre todo el proyecto.
