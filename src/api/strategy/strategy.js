import request from '../req.js'
const baseApiUrl = '/strategy/'

export function getPage(params) {
  return request({
    url: baseApiUrl + 'getPage',
    method: 'GET',
    params
  })
}

export function createStrategy(data) {
  return request.post(baseApiUrl + 'createStrategy', data)
}

export function updateStrategy(data) {
  return request.post(baseApiUrl + 'updateStrategy', data)
}

export function getStrategy(params) {
  return request({
    url: baseApiUrl + 'getStrategy',
    method: 'GET',
    params
  })
}

export function deleteStrategy(data) {
  return request.post(baseApiUrl + 'deleteStrategy', data)
}
