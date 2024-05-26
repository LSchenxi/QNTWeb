export const clearValues = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') {
      clearValues(obj[key])
    } else {
      obj[key] = null
    }
  })
  return obj
}
