import request from '../req.js'
const baseApiUrl = '/auth/'
export function check() {
  return request({
    url: baseApiUrl + 'check',
    method: 'GET'
  })
}

export function login(data) {
  return request.post(baseApiUrl +'login', data)
}

export function logout() {
  return request.post(baseApiUrl + 'logout')
}

export function changePwd(data) {
  return request.post(baseApiUrl +'changePwd', data)
}
