import request from '@/utils/request'

export function queryDatabases(query) {
  return request({
    url: '/datasource/queryDatabases',
    method: 'get',
    params: query
  })
}

export function addDatasource(data) {
  return request({
    url: '/datasource/add',
    method: 'post',
    data
  })
}

export function testConnect(data) {
  return request({
    url: '/connect/test',
    method: 'post',
    data
  })
}

export function queryTables(query) {
  return request({
    url: '/datasource/queryTables',
    method: 'get',
    params: query
  })
}

export function queryField(query) {
  return request({
    url: '/datasource/queryField',
    method: 'get',
    params: query
  })
}
export function refresh(query) {
  return request({
    url: '/datasource/refresh',
    method: 'get',
    params: query
  })
}

