// The API returns timestamps in seconds; the year is only shown when it is not the current one
export function formatDate(timestamp: number) {
  const date = new Date(timestamp * 1000)
  const isCurrentYear = date.getFullYear() === new Date().getFullYear()

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: isCurrentYear ? undefined : 'numeric',
  })
}
