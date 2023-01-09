import request from '@/utils/request'

export function queryLogList(query) {
  return request({
    url: '/rule/logList',
    method: 'get',
    params: query
  })
}

export function queryJob(query) {
  return request({
    url: '/job/queryJob',
    method: 'get',
    params: query
  })
}
