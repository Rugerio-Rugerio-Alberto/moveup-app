# Integración rápida del frontend

## 1. Instalar dependencias
```bash
npm install
```

## 2. Revisar environments
Verifica la URL del backend en:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

## 3. Ejecutar el proyecto
```bash
ionic serve
```

## 4. Flujo esperado
- `/` muestra la página pública de presentación.
- `/auth/login` y `/auth/register` permiten acceso.
- `/home` muestra el inicio interno para usuario autenticado.
- `/ipaq`, `/articles`, `/routine` y `/favorites` requieren sesión activa.

## 5. Recomendación
Usa este archivo como guía rápida y el `README.md` como documentación principal del frontend.
