# MoveUp Frontend

Frontend web de **MoveUp**, una aplicación desarrollada con **Ionic + Angular** para informar sobre el sedentarismo, aplicar el cuestionario **IPAQ**, mostrar artículos, gestionar favoritos y acompañar al usuario con rutinas y seguimiento.

## Propósito del proyecto

MoveUp surge como una propuesta digital alineada al **ODS 3: Salud y bienestar**. La aplicación busca ayudar a estudiantes y usuarios con hábitos sedentarios a:

- comprender qué es el sedentarismo y por qué representa un riesgo para la salud;
- evaluar su nivel de actividad física mediante el cuestionario IPAQ;
- consultar artículos y recomendaciones útiles;
- llevar seguimiento de su progreso y contenido favorito.

## Estructura principal

```
src/app/
├── components/        # Componentes reutilizables
├── guards/            # Protección de rutas
├── interfaces/        # Tipos e interfaces compartidas
├── pages/             # Pantallas principales de la aplicación
├── services/          # Consumo de API, autenticación y utilidades
└── app-routing.module.ts
```

## Flujo general

1. La **página pública** presenta el problema del sedentarismo y el contexto del proyecto.
2. El usuario entra a **login** o **registro**.
3. Tras autenticarse, accede al **inicio interno** de la aplicación.
4. Desde el menú lateral puede ir a IPAQ, artículos, rutina y favoritos.
5. El frontend consume el backend Django para autenticación, resultados y persistencia.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
- Ionic CLI

## Instalación

```bash
npm install
```

## Ejecución en desarrollo

```bash
ionic serve
```

La aplicación web suele abrirse en `http://localhost:8100`.

## Configuración

Revisa estos archivos antes de levantar el proyecto:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Ahí se define la URL base del backend y otros parámetros de entorno.

## Módulos funcionales

### Página pública
Explica el problema del sedentarismo, presenta la propuesta de MoveUp y la conecta con el ODS 3.

### Autenticación
Incluye inicio de sesión, registro, recuperación y restablecimiento de contraseña.

### Inicio interno
Muestra contenido informativo sobre sedentarismo para el usuario autenticado.

### Cuestionario IPAQ
Permite capturar datos, procesarlos y mostrar resultados interpretables sobre actividad física.

### Artículos y favoritos
Muestra contenido de interés y permite marcar información para revisarla después.

### Rutina
Presenta seguimiento y acciones recomendadas para el usuario.

## Organización tipo MVC en contexto frontend

Aunque el proyecto usa una arquitectura moderna basada en componentes, se puede explicar académicamente con una separación equivalente a MVC:

- **Vista:** páginas HTML, componentes visuales y estilos.
- **Controlador:** archivos TypeScript de páginas, componentes y servicios que controlan eventos y flujo.
- **Modelo:** interfaces compartidas y datos consumidos desde el backend.

## Documentación del código

Los archivos principales del frontend incluyen comentarios en español para facilitar:

- la exposición del proyecto;
- la revisión del código por parte del profesor;
- el mantenimiento posterior.

## Notas

- Este frontend está pensado para trabajar con el backend Django del proyecto MoveUp.
- Si el backend no está levantado o la URL es incorrecta, la autenticación y algunas secciones no responderán.
- Los estilos fueron ajustados para mejorar la experiencia en escritorio y móvil.
