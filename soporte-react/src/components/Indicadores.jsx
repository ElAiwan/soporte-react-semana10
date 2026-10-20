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

  return (
    <section aria-label="Indicadores operativos">
      <h2>Indicadores</h2>
      <ul>
        <li>Total registradas: {total}</li>
        <li>Pendientes: {pendientes}</li>
        <li>En proceso: {enProceso}</li>
        <li>Resueltas: {resueltas}</li>
        <li>Alta prioridad sin resolver: {urgentes}</li>
        <li>Porcentaje de resolución: {porcentaje}%</li>
      </ul>
    </section>
  )
}
