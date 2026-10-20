# soporte-react — Sistema de Solicitudes de Soporte Técnico

Práctica guiada de React (Servicios Web · Unidad II · Laboratorio 10). Frontend en React + Vite que consume la API REST del proyecto Spring Boot `soporte-api`.

## Cómo ejecutarlo en IntelliJ IDEA

1. **Backend:** abre la carpeta `soporte-api` con *File → Open*, espera a que cargue Maven y ejecuta `SoporteApiApplication` (▶). Queda en `http://localhost:8080`.
2. **Frontend:** abre `soporte-react` con *File → Open*. Si no existe `node_modules`, ejecuta `npm install` en la terminal. Luego, en `package.json`, pulsa ▶ junto al script `dev` (o ejecuta `npm run dev`).
3. Abre la URL que muestre Vite, normalmente `http://localhost:5173/`.

Si Vite usa otro puerto (por ejemplo 5174), cambia `app.cors.origen` en `soporte-api/src/main/resources/application.properties`. La URL de la API se puede cambiar con `VITE_API_URL` (ver `.env.example`).

## Estructura

```
src/
├── App.jsx                  Estado principal, consulta con useEffect, registro con POST, filtros
├── main.jsx                 Punto de entrada (StrictMode) e importación de estilos
├── estilos.css              Diseño propio, responsivo y con modo oscuro
├── components/
│   ├── SolicitudCard.jsx    Tarjeta reutilizable (props + botón Resolver)
│   └── Indicadores.jsx      Indicadores operativos (valores derivados)
├── services/
│   └── api.js               Cliente Axios + traducción de errores a mensajes
└── utils/
    └── texto.js             Normalización de texto para la búsqueda
```

## API utilizada

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/solicitudes` | `200` con el arreglo de solicitudes |
| POST | `/api/solicitudes` | `201` con la solicitud creada · `400` con `{ "mensaje": ... }` si los datos no son válidos |

## Retos de la Fase 5

En el PDF de la guía, los enunciados de los retos aparecen plegados y solo se ven los títulos. Cada reto se resolvió a partir de su título y de lo trabajado en la guía:

| Reto | Qué se implementó | Decisión de diseño |
|---|---|---|
| **1 · Filtro combinado** | Filtrar por estado **y** prioridad a la vez, con el contador "Mostrando X de Y". | Las condiciones se combinan con `&&` dentro del mismo `filter`. La lista visible se calcula en cada render, no se guarda en otro estado. |
| **2 · Indicadores operativos** | Componente `Indicadores`: total, pendientes, en proceso, resueltas, alta prioridad sin resolver y porcentaje de resolución. | Todos son **valores derivados** de `solicitudes`, igual que el microreto C, así que no pueden desincronizarse. |
| **3 · Búsqueda robusta** | Búsqueda por texto que ignora mayúsculas, tildes y espacios extra, y acepta palabras en cualquier orden ("toner" encuentra "Cambiar tóner"). | `normalize('NFD')` quita las tildes. Cada palabra de la búsqueda debe aparecer en el título. Se combina con los filtros del reto 1. |
| **4 · Registro real mediante POST** | Backend: `@PostMapping` con validación (400) y almacenamiento en memoria con ids secuenciales. Frontend: el formulario usa `api.post` y agrega la respuesta del servidor. | El `id` y el `estado` los asigna el servidor. Lo registrado se mantiene al recargar la página mientras Spring Boot siga activo. El botón se desactiva mientras se envía. |
| **5 · Diseño y resiliencia** | Hoja de estilos propia (responsiva y con modo oscuro), mensajes de error específicos (servidor caído, timeout, 404, 5xx, validación), botón **Reintentar** y URL de la API configurable. | Se cambió `@CrossOrigin` por una configuración CORS global, porque `@CrossOrigin` no cubre las respuestas de error y un 404 llegaba al navegador como si el servidor estuviera caído. |

## Limitaciones conocidas

- Los datos se guardan en memoria: al reiniciar Spring Boot vuelven las dos solicitudes iniciales.
- "Resolver" cambia el estado solo en el frontend, porque el contrato de la API no incluye una ruta para actualizar.
