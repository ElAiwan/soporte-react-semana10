const asignatura = 'Servicios Web'
const categorias = ['Hardware', 'Software', 'Redes']

function App() {
  function mostrarCategorias() {
    alert(`Categorías disponibles: ${categorias.join(', ')}`)
  }

  return (
    <main>
      <h1>Sistema de Soporte Técnico</h1>
      <h2>Mi primera aplicación con React</h2>
      <p>Asignatura: {asignatura}</p>
      <p>Bienvenido al sistema de solicitudes.</p>
      <h3>Categorías de soporte</h3>
      <ul>
        {categorias.map(categoria => (
          <li key={categoria}>{categoria}</li>
        ))}
      </ul>
      <button onClick={() => alert('Bienvenido a React')}>
        Comenzar
      </button>
      <button onClick={mostrarCategorias}>
        Ver categorías
      </button>
    </main>
  )
}

export default App
