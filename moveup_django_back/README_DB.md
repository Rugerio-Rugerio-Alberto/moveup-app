# Base de datos en desarrollo

El proyecto puede trabajar con dos configuraciones:

## 1. SQLite
Es la opción más rápida para pruebas locales, ya que no requiere instalar ni configurar un servidor de base de datos.

Pasos:

```bash
set USE_MYSQL=0
python manage.py migrate
python manage.py runserver
```

En este modo, Django genera automáticamente el archivo `db.sqlite3` en la raíz del proyecto cuando se aplican las migraciones.

---

## 2. MySQL
Esta opción está pensada para un entorno más cercano al uso real del sistema.

Pasos recomendados:

1. Levantar MySQL desde XAMPP.
2. Crear una base de datos llamada `moveup_db`.
3. Configurar variables de entorno:

```bash
set USE_MYSQL=1
set MYSQL_DATABASE=moveup_db
set MYSQL_USER=root
set MYSQL_PASSWORD=
set MYSQL_HOST=127.0.0.1
set MYSQL_PORT=3306
```

4. Ejecutar migraciones:

```bash
python manage.py migrate
```

---

## Observación importante

El proyecto mantiene soporte para ambos motores de base de datos. Esto facilita pruebas rápidas con SQLite y, al mismo tiempo, permite trabajar con MySQL cuando se requiere integración con XAMPP.
