import request from '../req.js'
const baseApiUrl = '/pathfinder/'

export function getDetectIndexList() {
  return request({
    url: baseApiUrl + 'getDetectIndexList',
    method: 'GET'
  })
}

export function getDetectPage(params) {
  return request({
    url: baseApiUrl + 'getDetectPage',
    method: 'GET',
    params
  })
}

export function getDetectColumns(params) {
  return request({
    url: baseApiUrl + 'getDetectColumns',
    method: 'GET',
    params
  })
}
