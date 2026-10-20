// Normaliza para comparar: sin tildes, en minúsculas y con espacios simples.
export function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function coincide(texto, busqueda) {
  const palabras = normalizar(busqueda).split(' ').filter(Boolean)
  const objetivo = normalizar(texto)
  return palabras.every(p => objetivo.includes(p))
}
