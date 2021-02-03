export default function dataFilter(value, choise) {
  let options = {}
  switch (choise) {
    case 'dateTime':
      options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        second: '2-digit',
        minute: '2-digit',
      }
      break
    case 'year':
      options = {
        year: 'numeric',
      }
      break
    case 'month':
      options = {
        month: '2-digit',
      }
      break
    case 'date':
      options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }
      break
    default:
      options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        second: '2-digit',
        minute: '2-digit',
      }
      break
  }
  return new Intl.DateTimeFormat('ru-Ru', options).format(value)
}
