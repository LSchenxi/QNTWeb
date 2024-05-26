import request from '../req.js'
const baseApiUrl = '/realOffer/'

export function getPage(params) {
  return request({
    url: baseApiUrl + 'getPage',
    method: 'GET',
    params
  })
}

export function createRealOffer(data) {
  return request.post(baseApiUrl + 'createRealOffer', data)
}

export function updateRealOffer(data) {
  return request.post(baseApiUrl + 'updateRealOffer', data)
}

export function getRealOffer(params) {
  return request({
    url: baseApiUrl + 'getRealOffer',
    method: 'GET',
    params
  })
}

export function startRealOffer(data) {
  return request.post(baseApiUrl + 'startRealOffer', data)
}

export function stopRealOffer(data) {
  return request.post(baseApiUrl + 'stopRealOffer', data)
}

export function deleteRealOffer(data) {
  return request.post(baseApiUrl + 'deleteRealOffer', data)
}

export function getServerList() {
  return request({
    url: baseApiUrl + 'getServerList',
    method: 'GET'
  })
}

export function getStrategyList() {
  return request({
    url: baseApiUrl + 'getStrategyList',
    method: 'GET'
  })
}

export function getExchangeList() {
  return request({
    url: baseApiUrl + 'getExchangeList',
    method: 'GET'
  })
}

export function getTradingCurrencyList() {
  return request({
    url: baseApiUrl + 'getTradingCurrencyList',
    method: 'GET'
  })
}
