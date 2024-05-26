import request from '../req.js'
const baseApiUrl = '/exchange/'

export function getPage(params) {
  return request({
    url: baseApiUrl + 'getPage',
    method: 'GET',
    params
  })
}

export function createExchangeDetail(data) {
  return request.post(baseApiUrl + 'createExchangeDetail', data)
}

export function updateExchangeDetail(data) {
  return request.post(baseApiUrl + 'updateExchangeDetail', data)
}

export function getExchangeDetail(params) {
  return request({
    url: baseApiUrl + 'getExchangeDetail',
    method: 'GET',
    params
  })
}

export function deleteExchange(data) {
  return request.post(baseApiUrl + 'deleteExchange', data)
}

export function getProtocol() {
  return request({
    url: baseApiUrl + 'getProtocol',
    method: 'GET'
  })
}

export function getExchange() {
  return request({
    url: baseApiUrl + 'getExchange',
    method: 'GET'
  })
}
