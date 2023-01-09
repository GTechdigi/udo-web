import request from '@/utils/request'

export function queryProject(query) {
  return request({
    url: '/project/list',
    method: 'get',
    params: query
  })
}

export function getProject(project_code) {
  return request({
    url: '/project/' + project_code,
    method: 'get'
  })
}

export function addProject(data) {
  return request({
    url: '/project/add',
    method: 'post',
    data
  })
}

export function deleteProject(query) {
  return request({
    url: '/project/delProject',
    method: 'get',
    params: query
  })
}

export function updateProject(project_code, data) {
  return request({
    url: '/project/update/' + project_code,
    method: 'post',
    data
  })
}

export function projectUserList(query) {
  return request({
    url: '/projectUser/list',
    method: 'get',
    params: query
  })
}
export function addProjectUser(data) {
  return request({
    url: '/projectUser/add',
    method: 'post',
    data
  })
}
export function deleteProjectUser(query) {
  return request({
    url: '/projectUser/delete',
    method: 'get',
    params: query
  })
}
