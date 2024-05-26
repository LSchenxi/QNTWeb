import request from '../req.js'
const baseApiUrl = '/dataOverview/'

export function getRealOfferList() {
  return request({
    url: baseApiUrl + 'getRealOfferList',
    method: 'GET'
  })
}

export function getAccountProfitChartData(params) {
  return request({
    url: baseApiUrl + 'getAccountProfitChartData',
    method: 'GET',
    params
  })
}

export function getAccountStrategyChartData(params) {
  return request({
    url: baseApiUrl + 'getAccountStrategyChartData',
    method: 'GET',
    params
  })
}
