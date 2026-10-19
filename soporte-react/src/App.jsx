import { useState } from 'react'
import SolicitudCard from './components/SolicitudCard'

const iniciales = [
  { id: 1, titulo: 'Equipo no enciende', prioridad: 'Alta', estado: 'Pendiente' },
  { id: 2, titulo: 'Instalar software', prioridad: 'Media', estado: 'En proceso' }
]

function App() {
  const [solicitudes, setSolicitudes] = useState(iniciales)
  const [titulo, setTitulo] = useState('')
  const [prioridad, setPrioridad] = useState('Media')
  const [filtro, setFiltro] = useState('Todas')
  const [mensaje, setMensaje] = useState('')

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
    filtro === 'Todas' || s.estado === filtro
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
      <label htmlFor="filtro">Filtrar por estado</label>
      <select id="filtro" value={filtro}
        onChange={e => setFiltro(e.target.value)}>
        <option>Todas</option>
        <option>Pendiente</option>
        <option>En proceso</option>
        <option>Resuelta</option>
      </select>
      {visibles.length === 0 ? <p>No hay resultados.</p> :
        visibles.map(s =>
          <SolicitudCard key={s.id} {...s} onResolver={resolver} />
        )}
    </main>
  )
}

export default App
