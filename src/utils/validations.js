let required = field => {
  return v => !!v || `Поле ${field} должно быть заполнено`
}

let minlength = (field, value) => {
  return v => v.length <= value || `${field} должен иметь не менее ${value} символов `
}

let email = () => {
  return v => /.+@.+\..+/.test(v) || 'E-mail должен быть корректным'
}

export default {
  required,
  minlength,
  email,
}
