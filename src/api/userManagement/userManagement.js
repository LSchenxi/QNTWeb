import request from '../req.js'
const baseApiUrl = '/userManagement/'

export function getPage(params) {
  return request({
    url: baseApiUrl + 'getPage',
    method: 'GET',
    params
  })
}

export function createUser(data) {
  return request.post(baseApiUrl + 'createUser', data)
}

export function updateUser(data) {
  return request.post(baseApiUrl + 'updateUser', data)
}

export function getUser(params) {
  return request({
    url: baseApiUrl + 'getUser',
    method: 'GET',
    params
  })
}

export function deleteUser(data) {
  return request.post(baseApiUrl + 'deleteUser', data)
}

export function resetUserPwd(data) {
  return request.post(baseApiUrl + 'resetUserPwd', data)
}
