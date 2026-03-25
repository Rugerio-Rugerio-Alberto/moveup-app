# Documentación de endpoints

Base URL sugerida en desarrollo:

```text
http://127.0.0.1:8000/api
```

---

## 1. Registro

### `POST /auth/register/`
Crea una cuenta nueva.

**Body esperado:**

```json
{
  "username": "alberto",
  "email": "alberto@mail.com",
  "password": "demo12345",
  "first_name": "Alberto",
  "last_name": "Rugerio"
}
```

**Respuesta exitosa:**

```json
{
  "detail": "Cuenta creada correctamente."
}
```

---

## 2. Login

### `POST /auth/login/`
Valida credenciales y devuelve token de acceso.

**Body esperado:**

```json
{
  "username": "alberto",
  "password": "demo12345"
}
```

**Respuesta exitosa:**

```json
{
  "token": "token_generado",
  "user": {
    "id": 1,
    "username": "alberto",
    "email": "alberto@mail.com",
    "first_name": "Alberto",
    "last_name": "Rugerio"
  },
  "profile": {
    "level": "bajo"
  }
}
```

---

## 3. Usuario autenticado

### `GET /auth/me/`
### `GET /me/`
Devuelve información del usuario autenticado.

**Header requerido:**

```http
Authorization: Bearer <token>
```

---

## 4. Recuperación de contraseña

### `POST /auth/password-reset/request/`
Genera un token de recuperación para un correo registrado.

**Body esperado:**

```json
{
  "email": "alberto@mail.com"
}
```

**Nota:** En el estado actual del proyecto, el token se devuelve directamente en la respuesta para facilitar pruebas en desarrollo.

### `POST /auth/password-reset/confirm/`
Actualiza la contraseña usando el token de recuperación.

**Body esperado:**

```json
{
  "reset_token": "token_generado",
  "new_password": "nuevaClave123"
}
```

---

## 5. Tarjetas de contenido

### `GET /articles/cards/`
Devuelve tarjetas cargadas desde `seed_data/cards.json`.

**Parámetros opcionales:**
- `nivel`: `alto`, `medio`, `bajo`
- `categoria`: valor de categoría o `todas`

**Ejemplo:**

```text
GET /api/articles/cards/?nivel=medio&categoria=salud
```

---

## 6. Favoritos

### `GET /favorites/`
Lista los artículos favoritos del usuario autenticado.

### `POST /favorites/`
Guarda un artículo en favoritos.

**Body esperado:**

```json
{
  "title": "Título del artículo",
  "description": "Descripción breve",
  "url": "https://sitio.com/articulo",
  "urlToImage": "https://sitio.com/imagen.jpg",
  "source": {
    "name": "Fuente"
  },
  "publishedAt": "2026-03-20T10:00:00Z"
}
```

### `DELETE /favorites/<id>/`
Elimina un favorito por su identificador.

---

## 7. IPAQ

### `GET /ipaq/latest/`
Devuelve el último resultado IPAQ del usuario.

### `POST /ipaq/submit/`
Guarda un resultado IPAQ.

**Body esperado:**

```json
{
  "totalMETMinutes": 1200,
  "vigorousMETMinutes": 300,
  "moderateMETMinutes": 400,
  "walkingMETMinutes": 500,
  "sittingMinutes": 240,
  "category": "moderado",
  "answers": {
    "q1": 3,
    "q2": 5
  }
}
```

**Comportamiento adicional:**
Al guardar el resultado, también se actualiza el `Profile.level` del usuario.

---

## 8. Progreso de rutina

### `GET /routine/progress/`
Devuelve los registros de progreso del usuario.

### `POST /routine/progress/`
Guarda uno o varios registros de progreso.

**Body esperado (lista):**

```json
[
  {
    "date": "2026-03-23",
    "habitsCompleted": ["caminar", "hidratación"],
    "isComplete": true
  }
]
```

**Body esperado (objeto con items):**

```json
{
  "items": [
    {
      "date": "2026-03-23",
      "habitsCompleted": ["caminar", "hidratación"],
      "isComplete": true
    }
  ]
}
```

---

## 9. Resumen de seguridad

Todos los endpoints, salvo registro, login y recuperación de contraseña, requieren autenticación mediante token Bearer.
