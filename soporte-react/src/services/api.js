import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
  timeout: 8000
})

// Traduce un error de Axios a un mensaje útil para el usuario.
export function describirError(err) {
  if (err.response) {
    const { status, data } = err.response
    if (data?.mensaje) return data.mensaje
    if (status === 404) return 'El servicio no encontró la ruta solicitada (404).'
    if (status >= 500) return `El servidor tuvo un error interno (${status}).`
    return `El servidor respondió con un error (${status}).`
  }
  if (err.code === 'ECONNABORTED') {
    return 'El servidor tardó demasiado en responder.'
  }
  return 'No se pudo conectar con el servidor. Verifica que Spring Boot esté en ejecución.'
}
