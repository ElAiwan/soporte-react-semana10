import SolicitudCard from './components/SolicitudCard'

function App() {
  return (
    <main>
      <h1>Solicitudes de soporte</h1>
      <SolicitudCard
        titulo="Equipo no enciende"
        prioridad="Alta"
        estado="Pendiente"
      />
      <SolicitudCard
        titulo="Instalar software"
        prioridad="Media"
        estado="En proceso"
      />
    </main>
  )
}

export default App
