import request from '../req.js'
const baseApiUrl = '/realOfferDetail/'

export function getRealOffer(params) {
  return request({
    url: baseApiUrl + 'getRealOffer',
    method: 'GET',
    params
  })
}

export function updateRealOfferBase(data) {
  return request.post(baseApiUrl + 'updateRealOfferBase', data)
}

export function updateRealOfferAutoTrade(data) {
  return request.post(baseApiUrl + 'updateRealOfferAutoTrade', data)
}

export function updateRealOfferTradeParam(data) {
  return request.post(baseApiUrl + 'updateRealOfferTradeParam', data)
}

export function getAllExchange(params) {
  return request({
    url: baseApiUrl + 'getAllExchange',
    method: 'GET' ,
    params
  })
}

export function getAllSymbol() {
  return request({
    url: baseApiUrl + 'getAllSymbolList',
    method: 'GET'
  })
}

export function getRealOfferSymbol(params) {
  return request({
    url: baseApiUrl + 'getRealOfferSymbolList',
    method: 'GET',
    params
  })
}

export function getCurrentSymbolExchangeList(params) {
  return request({
    url: baseApiUrl + 'getCurrentSymbolExchangeList',
    method: 'GET',
    params
  })
}

export function updateSymbolExchange(data) {
  return request.post(baseApiUrl + 'updateSymbolExchange', data)
}

export function updateAddSymbol(data) {
  return request.post(baseApiUrl + 'updateAddSymbol', data)
}

export function getRealOfferRevenueChartData(params) {
  return request({
    url: baseApiUrl + 'getRealOfferRevenueChartData',
    method: 'GET',
    params
  })
}

export function getRealOfferStrategyChartData(params) {
  return request({
    url: baseApiUrl + 'getRealOfferStrategyChartData',
    method: 'GET',
    params
  })
}

export function getLogTablePage(params) {
  return request({
    url: baseApiUrl + 'getLogTableData',
    method: 'GET',
    params
  })
}

export function getLogTablePage2(params) {
  return request({
    url: baseApiUrl + 'getLogTableData2',
    method: 'GET',
    params
  })
}

export function getRealOfferAllSymbol(params) {
  return request({
    url: baseApiUrl + 'getRealOfferAllSymbol',
    method: 'GET',
    params
  })
}

export function getRealOfferStartingSymbol(params) {
  return request({
    url: baseApiUrl + 'getRealOfferStartingSymbol',
    method: 'GET',
    params
  })
}

export function updateStartSymbol(data) {
  return request.post(baseApiUrl + 'updateStartSymbol', data)
}

export function getRealOfferExchangeList(params) {
  return request({
    url: baseApiUrl + 'getRealOfferExchangeList',
    method: 'GET',
    params
  })
}

export function getRealOfferEnableSymbolList(params) {
  return request({
    url: baseApiUrl + 'getRealOfferEnableSymbolList',
    method: 'GET',
    params
  })
}

export function getRealOfferClearingSymbolList(params) {
  return request({
    url: baseApiUrl + 'getRealOfferClearingSymbolList',
    method: 'GET',
    params
  })
}

export function getRealOfferLockingSymbolList(params) {
  return request({
    url: baseApiUrl + 'getRealOfferLockingSymbolList',
    method: 'GET',
    params
  })
}

export function getRealOfferSuspendSymbolList(params) {
  return request({
    url: baseApiUrl + 'getRealOfferSuspendSymbolList',
    method: 'GET',
    params
  })
}

export function getRealOfferSummarySymbolList(params) {
  return request({
    url: baseApiUrl + 'getRealOfferSummarySymbolList',
    method: 'GET',
    params
  })
}

export function getRealOfferSymbolRecordsList(params) {
  return request({
    url: baseApiUrl + 'getRealOfferSymbolRecordsList',
    method: 'GET',
    params
  })
}

export function getSymbolList(params) {
  return request({
    url: baseApiUrl + 'getSymbolList',
    method: 'GET',
    params
  })
}

export function getSymbolTableData(params) {
  return request({
    url: baseApiUrl + 'getSymbolTableData',
    method: 'GET',
    params
  })
}




