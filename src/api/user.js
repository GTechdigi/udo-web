import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'get',
    params: data
  })
}

export function loginByLdap(data) {
  return request({
    url: '/auth/loginByLdap',
    method: 'get',
    params: data
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function queryList(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

export function getUser(username) {
  return request({
    url: '/user/' + username,
    method: 'get'
  })
}
export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}
