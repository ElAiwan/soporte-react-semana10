import { useEffect, useState } from 'react'
import { api } from './services/api'
import SolicitudCard from './components/SolicitudCard'

function App() {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function cargar() {
      try {
        setCargando(true)
        setError('')
        const respuesta = await api.get('/solicitudes', {
          signal: controller.signal
        })
        setSolicitudes(respuesta.data)
      } catch (err) {
        if (err.code !== 'ERR_CANCELED') {
          setError('No fue posible consultar las solicitudes.')
        }
      } finally {
        if (!controller.signal.aborted) setCargando(false)
      }
    }

    cargar()
    return () => controller.abort()
  }, [])

  return (
    <main>
      <h1>Solicitudes desde Spring Boot</h1>
      {cargando && <p role="status">Cargando solicitudes...</p>}
      {error && <p role="alert">{error}</p>}
      {!cargando && !error && solicitudes.length === 0 &&
        <p>No hay solicitudes registradas.</p>}
      {!cargando && !error && solicitudes.map(s =>
        <SolicitudCard key={s.id} {...s} />
      )}
    </main>
  )
}

export default App
