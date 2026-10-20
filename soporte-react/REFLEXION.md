# Reflexión — Práctica guiada React (soporte-react)

Servicios Web · Unidad II · Laboratorio 10

## 1. ¿Qué diferencia existe entre componente, prop y estado?

- **Componente:** una función que devuelve JSX y describe una parte de la interfaz. En el proyecto, `App` y `SolicitudCard` son componentes.
- **Prop:** un dato que el componente padre le pasa al hijo. El hijo lo recibe y lo muestra, pero no lo modifica. `SolicitudCard` recibe `titulo`, `prioridad`, `estado` y la función `onResolver`.
- **Estado:** un dato que pertenece al componente y cambia con el tiempo. Se crea con `useState`, y cada vez que cambia React vuelve a renderizar el componente. En `App` son estado la lista `solicitudes`, el texto del formulario, el filtro, `cargando` y `error`.

En resumen: las props fluyen de padre a hijo y son de solo lectura, mientras que el estado vive dentro del componente y solo se cambia con su función `set...`. Por eso el botón "Resolver" no cambia nada por sí mismo. Llama a la función que le pasó `App`, y es `App` quien actualiza el estado.

## 2. ¿Por qué `useEffect` es adecuado para iniciar una consulta externa?

- Consultar una API es un **efecto secundario**: no forma parte de calcular el JSX. Si la petición se hiciera directamente en el cuerpo del componente, se repetiría en cada render y entraría en un ciclo infinito, porque guardar los datos provoca otro render.
- `useEffect` se ejecuta **después** de que el componente aparece en pantalla. Con el arreglo de dependencias vacío `[]`, solo corre al montarse.
- La función de limpieza (`return () => controller.abort()`) cancela la petición si el componente se desmonta. Así se evita actualizar el estado con datos obsoletos. Esto se vio en la pestaña Network: en desarrollo, StrictMode monta el componente dos veces, la primera petición aparece como cancelada y solo la segunda responde 200. No hay registros duplicados.

## 3. ¿Qué responsabilidades corresponden a React y cuáles a Spring Boot?

| React (frontend, puerto 5173) | Spring Boot (backend, puerto 8080) |
|---|---|
| Mostrar la interfaz y responder a eventos (clics, formularios) | Exponer los endpoints REST (`GET /api/solicitudes`) |
| Mantener el estado de la vista: filtro, formulario, carga y error | Ser la fuente de verdad de los datos y, más adelante, guardarlos |
| Validar la entrada para dar retroalimentación inmediata al usuario | Validar de nuevo en el servidor, porque el cliente se puede saltar |
| Consumir la API con Axios y manejar los errores de red | Definir qué orígenes pueden llamar a la API (CORS), además de la seguridad y la lógica de negocio |

## 4. ¿Cómo distinguirías un error de CORS, un 404 y una caída del servidor?

- **CORS:** el servidor **sí responde**, pero el navegador bloquea la respuesta. La consola muestra *"blocked by CORS policy"* y la petición en Network no tiene el encabezado `Access-Control-Allow-Origin`. Desde Postman funciona, porque Postman no aplica CORS. Se corrige en `@CrossOrigin` o en la configuración de CORS, poniendo el origen exacto (por ejemplo, si Vite pasa a usar el 5174).
- **404:** el servidor responde con **código 404**. La conexión funciona, pero la ruta o el método no existen. Axios entrega `err.response.status === 404`. Hay que revisar `@RequestMapping`, `@GetMapping` y la `baseURL`.
- **Servidor caído:** **no hay respuesta**. Network muestra `net::ERR_CONNECTION_REFUSED` y Axios entrega un error sin `err.response` (`code: 'ERR_NETWORK'`). Lo comprobé al detener Spring Boot: la app mostró "No fue posible consultar las solicitudes." y no una pantalla en blanco.

## 5. ¿Qué mejoraría antes de publicar el sistema para usuarios reales?

- **Persistencia real:** una base de datos con JPA, y POST, PUT y DELETE en el backend, para que lo que se registra o resuelve no se pierda al recargar.
- **Configuración por entorno:** mover la URL de la API a una variable `VITE_API_URL` y el origen de CORS a `application.properties`, en lugar de dejarlos fijos en el código.
- **Validación en el servidor:** usar `@Valid` y devolver errores claros (400) con un mensaje que el frontend pueda mostrar.
- **Mensajes de error más específicos:** distinguir entre servidor caído, 404 y 500, y ofrecer un botón "Reintentar".
- **Seguridad:** autenticación (Spring Security con JWT o sesiones), HTTPS y roles (usuario que reporta y técnico que resuelve).
- **Calidad:** pruebas (Vitest y Testing Library en el frontend, JUnit y MockMvc en el backend), estilos y accesibilidad, y un build de producción con `npm run build`.

---

## Respuestas a los "Comprueba" y microretos

- **`npm install` y `npm run dev`:** `npm install` descarga las dependencias de `package.json` a `node_modules` y fija sus versiones en `package-lock.json`. `npm run dev` ejecuta el script `dev`, que levanta el servidor de desarrollo de Vite.
- **¿Por qué el contador cambia sin recargar?** Porque `useState` hace que React vuelva a renderizar solo ese componente y actualice en el DOM únicamente lo que cambió. Por otro lado, el HMR de Vite aplica los cambios del código sin recargar la página.
- **Microreto A (JSX y JavaScript):** las constantes, la función `mostrarCategorias`, el `join` y el `.map()` son JavaScript. Las etiquetas del `return` son JSX. Las llaves `{ }` permiten evaluar JavaScript dentro del JSX.
- **¿Por qué reutilizar componentes?** La estructura se define una sola vez, los cambios se hacen en un único lugar, cada uso solo cambia sus props y se evitan errores de copiar y pegar.
- **Microreto B (botón Resolver):** `App` es dueño del estado y le pasa `onResolver={resolver}` a cada `SolicitudCard`. `resolver` usa `map` y `{ ...s, estado: 'Resuelta' }` para crear un arreglo y un objeto nuevos sin mutar los anteriores. Si se mutara el arreglo, React no detectaría el cambio.
- **Microreto C (contador de pendientes):** se calcula en cada render con `solicitudes.filter(s => s.estado === 'Pendiente').length`. Es un **valor derivado**: guardarlo en otro `useState` duplicaría la información, y habría que sincronizarlo a mano cada vez que se agrega o resuelve una solicitud, con riesgo de que quede desactualizado.
