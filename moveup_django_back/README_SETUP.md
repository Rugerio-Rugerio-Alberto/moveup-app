# Guía de configuración del entorno

## 1. Crear entorno virtual

```bash
python -m venv venv
venv\Scripts\activate
```

## 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

## 3. Elegir base de datos

### SQLite
```bash
set USE_MYSQL=0
```

### MySQL
```bash
set USE_MYSQL=1
set MYSQL_DATABASE=moveup_db
set MYSQL_USER=root
set MYSQL_PASSWORD=
set MYSQL_HOST=127.0.0.1
set MYSQL_PORT=3306
```

## 4. Aplicar migraciones

```bash
python manage.py migrate
```

## 5. Levantar servidor

```bash
python manage.py runserver
```

## 6. Ruta base de la API

```text
http://127.0.0.1:8000/api
```

## 7. Recomendación para pruebas

Primero conviene levantar el proyecto con SQLite para validar que todo funcione correctamente. Después, si se requiere, se puede cambiar a MySQL y repetir el proceso de migración.
