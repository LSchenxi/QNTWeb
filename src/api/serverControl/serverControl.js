import request from '../req.js'
const baseApiUrl = '/serverControl/'

export function getPage(params) {
  return request({
    url: baseApiUrl + 'getPage',
    method: 'GET',
    params
  })
}

export function createServer(data) {
  return request.post(baseApiUrl + 'createServer', data)
}

export function updateServer(data) {
  return request.post(baseApiUrl + 'updateServer', data)
}

export function getServer(params) {
  return request({
    url: baseApiUrl + 'getServer',
    method: 'GET',
    params
  })
}

export function deleteServer(data) {
  return request.post(baseApiUrl + 'deleteServer', data)
}
