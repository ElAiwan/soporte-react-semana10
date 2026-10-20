const clase = texto => texto.toLowerCase().replace(/\s+/g, '-')

export default function SolicitudCard({ id, titulo, prioridad, estado, onResolver }) {
  return (
    <article className={`tarjeta estado-${clase(estado)}`}>
      <h3>{titulo}</h3>
      <p className="etiquetas">
        <span className={`etiqueta prioridad-${clase(prioridad)}`}>
          Prioridad: {prioridad}
        </span>
        <span className="etiqueta">Estado: {estado}</span>
      </p>
      {onResolver && estado !== 'Resuelta' && (
        <button onClick={() => onResolver(id)}>Resolver</button>
      )}
    </article>
  )
}
