export function formatStudentName(name: string): string {
  if (!name) return ''

  const connectors = ['de', 'da', 'do', 'dos', 'das', 'e']

  return name
    .toLowerCase()
    .split(' ')
    .filter((word) => word.length > 0)
    .map((word, index) => {
      if (connectors.includes(word) && index !== 0) {
        return word
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}
