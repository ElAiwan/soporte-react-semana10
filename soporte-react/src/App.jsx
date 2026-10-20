import { useEffect, useState } from 'react'
import { api } from './services/api'
import SolicitudCard from './components/SolicitudCard'

function App() {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [titulo, setTitulo] = useState('')
  const [prioridad, setPrioridad] = useState('Media')
  const [filtroEstado, setFiltroEstado] = useState('Todas')
  const [filtroPrioridad, setFiltroPrioridad] = useState('Todas')
  const [mensaje, setMensaje] = useState('')

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

  function agregar(e) {
    e.preventDefault()
    if (!titulo.trim()) {
      setMensaje('Escribe una descripción de la solicitud.')
      return
    }
    const nueva = {
      id: crypto.randomUUID(),
      titulo: titulo.trim(),
      prioridad,
      estado: 'Pendiente'
    }
    setSolicitudes(actuales => [...actuales, nueva])
    setTitulo('')
    setMensaje('Solicitud agregada correctamente.')
  }

  function resolver(id) {
    setSolicitudes(actuales => actuales.map(s =>
      s.id === id ? { ...s, estado: 'Resuelta' } : s
    ))
  }

  const visibles = solicitudes.filter(s =>
    (filtroEstado === 'Todas' || s.estado === filtroEstado) &&
    (filtroPrioridad === 'Todas' || s.prioridad === filtroPrioridad)
  )
  const pendientes = solicitudes.filter(s => s.estado === 'Pendiente').length

  return (
    <main>
      <h1>Gestión de solicitudes</h1>
      <p>Total registradas: {solicitudes.length}</p>
      <p>Pendientes: {pendientes}</p>
      <form onSubmit={agregar}>
        <label htmlFor="titulo">Descripción</label>
        <input id="titulo" value={titulo}
          onChange={e => setTitulo(e.target.value)} />
        <label htmlFor="prioridad">Prioridad</label>
        <select id="prioridad" value={prioridad}
          onChange={e => setPrioridad(e.target.value)}>
          <option>Alta</option><option>Media</option><option>Baja</option>
        </select>
        <button type="submit">Registrar</button>
      </form>
      <p role="status">{mensaje}</p>
      <label htmlFor="filtroEstado">Filtrar por estado</label>
      <select id="filtroEstado" value={filtroEstado}
        onChange={e => setFiltroEstado(e.target.value)}>
        <option>Todas</option>
        <option>Pendiente</option>
        <option>En proceso</option>
        <option>Resuelta</option>
      </select>
      <label htmlFor="filtroPrioridad">Filtrar por prioridad</label>
      <select id="filtroPrioridad" value={filtroPrioridad}
        onChange={e => setFiltroPrioridad(e.target.value)}>
        <option>Todas</option>
        <option>Alta</option>
        <option>Media</option>
        <option>Baja</option>
      </select>
      <p>Mostrando {visibles.length} de {solicitudes.length}</p>
      {cargando && <p role="status">Cargando solicitudes...</p>}
      {error && <p role="alert">{error}</p>}
      {!cargando && !error && (visibles.length === 0 ? <p>No hay resultados.</p> :
        visibles.map(s =>
          <SolicitudCard key={s.id} {...s} onResolver={resolver} />
        ))}
    </main>
  )
}

export default App
