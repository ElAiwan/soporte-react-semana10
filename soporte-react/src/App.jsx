import { useEffect, useState } from 'react'
import { api, describirError } from './services/api'
import SolicitudCard from './components/SolicitudCard'
import Indicadores from './components/Indicadores'
import { coincide } from './utils/texto'

function App() {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)
  const [titulo, setTitulo] = useState('')
  const [prioridad, setPrioridad] = useState('Media')
  const [filtroEstado, setFiltroEstado] = useState('Todas')
  const [filtroPrioridad, setFiltroPrioridad] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [mensaje, setMensaje] = useState(null)
  const [enviando, setEnviando] = useState(false)

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
          setError(describirError(err))
        }
      } finally {
        if (!controller.signal.aborted) setCargando(false)
      }
    }

    cargar()
    return () => controller.abort()
  }, [intento])

  async function agregar(e) {
    e.preventDefault()
    if (!titulo.trim()) {
      setMensaje({ tipo: 'error', texto: 'Escribe una descripción de la solicitud.' })
      return
    }
    try {
      setEnviando(true)
      setMensaje(null)
      const respuesta = await api.post('/solicitudes', {
        titulo: titulo.trim(),
        prioridad
      })
      setSolicitudes(actuales => [...actuales, respuesta.data])
      setTitulo('')
      setMensaje({ tipo: 'ok', texto: 'Solicitud registrada en el servidor.' })
    } catch (err) {
      setMensaje({ tipo: 'error', texto: describirError(err) })
    } finally {
      setEnviando(false)
    }
  }

  function resolver(id) {
    setSolicitudes(actuales => actuales.map(s =>
      s.id === id ? { ...s, estado: 'Resuelta' } : s
    ))
  }

  const visibles = solicitudes.filter(s =>
    (filtroEstado === 'Todas' || s.estado === filtroEstado) &&
    (filtroPrioridad === 'Todas' || s.prioridad === filtroPrioridad) &&
    coincide(s.titulo, busqueda)
  )

  return (
    <main className="app">
      <header className="encabezado">
        <h1>Gestión de solicitudes</h1>
        <p>Sistema de Soporte Técnico · Servicios Web</p>
      </header>

      <Indicadores solicitudes={solicitudes} />

      <section className="panel" aria-labelledby="titulo-registro">
        <h2 id="titulo-registro">Nueva solicitud</h2>
        <form className="formulario" onSubmit={agregar}>
          <div className="campo campo-ancho">
            <label htmlFor="titulo">Descripción</label>
            <input id="titulo" value={titulo} maxLength={120}
              placeholder="Ej.: El proyector del aula 3 no enciende"
              onChange={e => setTitulo(e.target.value)} />
          </div>
          <div className="campo">
            <label htmlFor="prioridad">Prioridad</label>
            <select id="prioridad" value={prioridad}
              onChange={e => setPrioridad(e.target.value)}>
              <option>Alta</option><option>Media</option><option>Baja</option>
            </select>
          </div>
          <button type="submit" className="boton-primario" disabled={enviando}>
            {enviando ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
        <p role="status" className={mensaje ? `mensaje mensaje-${mensaje.tipo}` : 'mensaje'}>
          {mensaje?.texto}
        </p>
      </section>

      <section className="panel" aria-labelledby="titulo-listado">
        <h2 id="titulo-listado">Solicitudes</h2>
        <div className="filtros">
          <div className="campo campo-ancho">
            <label htmlFor="busqueda">Buscar</label>
            <input id="busqueda" type="search" value={busqueda}
              placeholder="Ej.: impresora"
              onChange={e => setBusqueda(e.target.value)} />
          </div>
          <div className="campo">
            <label htmlFor="filtroEstado">Estado</label>
            <select id="filtroEstado" value={filtroEstado}
              onChange={e => setFiltroEstado(e.target.value)}>
              <option>Todas</option>
              <option>Pendiente</option>
              <option>En proceso</option>
              <option>Resuelta</option>
            </select>
          </div>
          <div className="campo">
            <label htmlFor="filtroPrioridad">Prioridad</label>
            <select id="filtroPrioridad" value={filtroPrioridad}
              onChange={e => setFiltroPrioridad(e.target.value)}>
              <option>Todas</option>
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
            </select>
          </div>
        </div>

        {cargando && <p role="status" className="aviso">Cargando solicitudes...</p>}
        {error && (
          <div role="alert" className="aviso aviso-error">
            <p>{error}</p>
            <button type="button" onClick={() => setIntento(n => n + 1)}>
              Reintentar
            </button>
          </div>
        )}
        {!cargando && !error && (
          <>
            <p className="contador">Mostrando {visibles.length} de {solicitudes.length}</p>
            {visibles.length === 0 ? <p className="aviso">No hay resultados.</p> : (
              <div className="tarjetas">
                {visibles.map(s =>
                  <SolicitudCard key={s.id} {...s} onResolver={resolver} />
                )}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default App
