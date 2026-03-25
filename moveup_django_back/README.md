# MoveUp Backend

Backend de la aplicación **MoveUp**, desarrollado con **Django** y **Django REST Framework**. Este proyecto concentra la lógica de autenticación, recuperación de contraseña, gestión de perfil, tarjetas de contenido, artículos favoritos, resultados del cuestionario IPAQ y seguimiento del progreso de rutina.

La API fue pensada para dar soporte a un frontend web o móvil, manteniendo separadas las responsabilidades de persistencia, validación y exposición de datos.

---

## 1. Objetivo del proyecto

MoveUp busca apoyar a personas con hábitos sedentarios mediante funcionalidades orientadas al seguimiento de actividad física, consulta de contenido y registro de avances. Desde el backend, esto se resuelve a través de endpoints que permiten:

- registrar e iniciar sesión de usuarios;
- recuperar contraseña mediante token;
- consultar y actualizar información asociada al perfil del usuario;
- devolver tarjetas de contenido filtradas por nivel o categoría;
- guardar artículos favoritos;
- almacenar resultados del cuestionario IPAQ;
- registrar el progreso diario de rutina.

---

## 2. Tecnologías utilizadas

- **Python 3.12**
- **Django**
- **Django REST Framework**
- **TokenAuthentication / Bearer Token**
- **django-cors-headers**
- **django-filter**
- **SQLite** para pruebas rápidas
- **MySQL** como opción de despliegue local con XAMPP

---

## 3. Estructura general del proyecto

```text
moveup_django_back/
├── core/                  # Aplicación principal con modelos, serializers, vistas y rutas
│   ├── migrations/        # Migraciones de base de datos
│   ├── admin.py           # Registro de modelos en el panel de administración
│   ├── apps.py            # Configuración de la aplicación core
│   ├── auth.py            # Implementación alternativa del autenticador Bearer
│   ├── authentication.py  # Autenticación Bearer usada por DRF
│   ├── models.py          # Modelos de datos del sistema
│   ├── serializers.py     # Validación y transformación de datos
│   ├── urls.py            # Rutas de la API del módulo core
│   └── views.py           # Lógica de negocio expuesta por endpoints
├── moveup_api/            # Configuración global del proyecto Django
│   ├── asgi.py
│   ├── settings.py        # Configuración principal del proyecto
│   ├── urls.py            # Rutas raíz del proyecto
│   └── wsgi.py
├── seed_data/
│   └── cards.json         # Datos base para tarjetas de contenido
├── docs/                  # Documentación técnica del proyecto
├── .env.example           # Ejemplo de variables de entorno
├── .gitignore             # Exclusiones recomendadas para control de versiones
├── manage.py              # Punto de entrada para tareas Django
├── README.md              # Documento principal del proyecto
├── README_DB.md           # Guía rápida de base de datos
├── README_SETUP.md        # Guía de configuración del entorno
└── requirements.txt       # Dependencias del proyecto
```

---

## 4. Arquitectura de trabajo

La aplicación sigue una organización clara por capas dentro de Django REST Framework:

### Modelos (`core/models.py`)
Representan las entidades persistentes del sistema. Aquí se define qué información se guarda y cómo se relaciona.

### Serializers (`core/serializers.py`)
Se encargan de validar la entrada de datos, convertir objetos del modelo a JSON y viceversa, y centralizar reglas básicas de validación.

### Views (`core/views.py`)
Implementan el comportamiento de cada endpoint. Reciben la petición, usan serializers para validar, consultan o actualizan modelos y regresan la respuesta HTTP.

### URLs (`core/urls.py`)
Conectan cada ruta de la API con su vista correspondiente.

---

## 5. Flujo general de una petición

El comportamiento del backend puede resumirse así:

1. El cliente envía una petición HTTP a una ruta de `/api/...`.
2. Django resuelve la URL y delega en la vista correspondiente.
3. La vista utiliza un serializer para validar los datos recibidos.
4. Si la información es válida, se consulta o modifica la base de datos mediante los modelos.
5. La vista devuelve una respuesta JSON con el resultado.

Este flujo se repite en prácticamente todos los módulos del proyecto, lo que facilita mantenimiento y escalabilidad.

---

## 6. Módulos funcionales del sistema

### 6.1 Autenticación y cuenta
Permite registrar usuarios, iniciar sesión y consultar información del usuario autenticado.

Rutas principales:
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `GET /api/auth/me/`
- `GET /api/me/`

### 6.2 Recuperación de contraseña
Gestiona la generación y confirmación de tokens para restablecer contraseña.

Rutas principales:
- `POST /api/auth/password-reset/request/`
- `POST /api/auth/password-reset/confirm/`

### 6.3 Tarjetas de contenido
Lee tarjetas almacenadas en `seed_data/cards.json` y permite filtrarlas por nivel de actividad y categoría.

Ruta principal:
- `GET /api/articles/cards/`

### 6.4 Favoritos
Permite al usuario guardar y eliminar artículos favoritos asociados a su cuenta.

Rutas principales:
- `GET /api/favorites/`
- `POST /api/favorites/`
- `DELETE /api/favorites/<id>/`

### 6.5 IPAQ
Registra el resultado del cuestionario IPAQ y actualiza el nivel del perfil del usuario con base en la categoría calculada.

Rutas principales:
- `GET /api/ipaq/latest/`
- `POST /api/ipaq/submit/`

### 6.6 Progreso de rutina
Guarda el avance diario del usuario respecto a hábitos o actividades completadas.

Ruta principal:
- `GET /api/routine/progress/`
- `POST /api/routine/progress/`

---

## 7. Modelado de datos

Las entidades principales del sistema son:

- **Profile**: almacena el nivel de actividad de un usuario.
- **PasswordResetToken**: guarda tokens temporales para recuperación de contraseña.
- **ActivityLog**: registra acciones relevantes como inicio de sesión o guardado de favoritos.
- **FavoriteArticle**: conserva artículos favoritos por usuario.
- **IPAQResult**: almacena resultados del cuestionario IPAQ.
- **RoutineProgress**: registra hábitos completados por fecha.

Una explicación más detallada se encuentra en `docs/MODELOS_Y_ARCHIVOS.md`.

---

## 8. Configuración del entorno

### Opción A: SQLite (rápida para pruebas)
Esta opción evita depender de MySQL y es útil para desarrollo local.

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
set USE_MYSQL=0
python manage.py migrate
python manage.py runserver
```

### Opción B: MySQL con XAMPP
Si se desea trabajar con MySQL, se deben configurar las variables de entorno indicadas en `.env.example`.

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
set USE_MYSQL=1
set MYSQL_DATABASE=moveup_db
set MYSQL_USER=root
set MYSQL_PASSWORD=
set MYSQL_HOST=127.0.0.1
set MYSQL_PORT=3306
python manage.py migrate
python manage.py runserver
```

---

## 9. Autenticación

La API usa autenticación por token. Después del login, el backend devuelve un token que debe enviarse en las siguientes peticiones protegidas mediante el encabezado:

```http
Authorization: Bearer <token>
```

Esto se implementa mediante `TokenAuthentication` y una clase personalizada que acepta el prefijo `Bearer`.

---

## 10. Consideraciones técnicas importantes

- El proyecto permite alternar entre SQLite y MySQL mediante la variable `USE_MYSQL`.
- `core/authentication.py` es el archivo utilizado en la configuración principal para aceptar tokens Bearer.
- `seed_data/cards.json` funciona como fuente local de tarjetas para la sección de contenido.
- El sistema registra ciertas acciones del usuario en `ActivityLog` para mantener trazabilidad básica.

---

## 11. Documentación complementaria

Para facilitar la comprensión del proyecto, se añadieron los siguientes documentos:

- `docs/MODELOS_Y_ARCHIVOS.md`
- `docs/ENDPOINTS.md`
- `README_DB.md`
- `README_SETUP.md`

---

## 12. Estado actual del proyecto

Actualmente, el backend cubre correctamente la base funcional de la aplicación. La estructura quedó organizada para que cada responsabilidad sea fácil de ubicar y explicar durante revisión, exposición o mantenimiento.

Como siguientes mejoras naturales podrían considerarse:

- documentación automática con Swagger/OpenAPI;
- expiración real de tokens de recuperación de contraseña;
- pruebas unitarias e integración;
- separación adicional de servicios si el proyecto crece.
