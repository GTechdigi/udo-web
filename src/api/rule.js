import request from '@/utils/request'

export function queryTimely(query) {
  return request({
    url: '/rule/list',
    method: 'get',
    params: query
  })
}

export function addRule(data) {
  return request({
    url: '/rule/add',
    method: 'post',
    data
  })
}

export function updateRule(rule_code, data) {
  return request({
    url: '/rule/update/' + rule_code,
    method: 'post',
    data
  })
}

export function runRule(id) {
  return request({
    url: '/runRule/runRule/' + id,
    method: 'get'
  })
}

export function delRule(id) {
  return request({
    url: '/rule/deleteRule/' + id,
    method: 'get'
  })
}

export function ruleInfo(query) {
  return request({
    url: '/rule/info',
    method: 'get',
    params: query
  })
}
