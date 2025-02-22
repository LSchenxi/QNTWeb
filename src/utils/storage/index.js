import { createStorage } from './storage'

const prefixKey = 'VUE_TEMPLATE_'

export const createLocalStorage = function (option = {}) {
  return createStorage({
    prefixKey: option.prefixKey || '',
    storage: localStorage
  })
}

export const createSessionStorage = function (option = {}) {
  return createStorage({
    prefixKey: option.prefixKey || '',
    storage: sessionStorage
  })
}

export const storage = createLocalStorage({ prefixKey })

export const sStorage = createSessionStorage({ prefixKey })
