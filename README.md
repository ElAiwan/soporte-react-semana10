# Semana 10 · Práctica guiada React — Servicios Web

Sistema de Solicitudes de Soporte Técnico: frontend en React + Vite que consume una API REST en Spring Boot.

| Carpeta | Contenido |
|---|---|
| [`soporte-react/`](soporte-react/) | Frontend React (Vite, Axios, useState/useEffect). Incluye `REFLEXION.md` y la explicación de los retos en su README. |
| [`soporte-api/`](soporte-api/) | Backend Spring Boot 4.1 (Java 17+, Maven): `GET` y `POST /api/solicitudes`, CORS global. |
| [`evidencias/`](evidencias/) | Capturas: app en el navegador, GET y POST en Postman, error controlado y ejecución en IntelliJ IDEA. |

## Ejecución (IntelliJ IDEA)

1. Abrir `soporte-api` y ejecutar `SoporteApiApplication` → `http://localhost:8080/api/solicitudes`.
2. Abrir `soporte-react`, ejecutar `npm install` y luego el script `dev` → `http://localhost:5173/`.

Detalles, decisiones de diseño y retos: [soporte-react/README.md](soporte-react/README.md).
