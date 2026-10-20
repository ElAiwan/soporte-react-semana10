export default function Indicadores({ solicitudes }) {
  const total = solicitudes.length
  const contar = estado => solicitudes.filter(s => s.estado === estado).length
  const pendientes = contar('Pendiente')
  const enProceso = contar('En proceso')
  const resueltas = contar('Resuelta')
  const urgentes = solicitudes.filter(s =>
    s.prioridad === 'Alta' && s.estado !== 'Resuelta'
  ).length
  const porcentaje = total === 0 ? 0 : Math.round((resueltas / total) * 100)

  const datos = [
    ['Total registradas', total],
    ['Pendientes', pendientes],
    ['En proceso', enProceso],
    ['Resueltas', resueltas],
    ['Alta prioridad sin resolver', urgentes],
    ['Porcentaje de resolución', `${porcentaje}%`]
  ]

  return (
    <section aria-label="Indicadores operativos" className="indicadores">
      {datos.map(([etiqueta, valor]) => (
        <div key={etiqueta} className="indicador">
          <span className="indicador-valor">{valor}</span>
          <span className="indicador-etiqueta">{etiqueta}</span>
        </div>
      ))}
    </section>
  )
}
