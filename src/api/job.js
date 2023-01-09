import request from '@/utils/request'

export function queryJob(query) {
  return request({
    url: '/job/queryJob',
    method: 'get',
    params: query
  })
}

export function addJob(data) {
  return request({
    url: '/job/addJob',
    method: 'post',
    data
  })
}

export function updateJobInfo(data) {
  return request({
    url: '/job/updateJobInfo/' + data.job_id,
    method: 'post',
    data
  })
}

export function deleteJob(query) {
  return request({
    url: '/job/delJob',
    method: 'get',
    params: query
  })
}

export function getJob(query) {
  return request({
    url: '/job/info/' + query,
    method: 'get'
  })
}
export function changeJobStatus(data) {
  return request({
    url: '/job/changeStatus',
    method: 'post',
    data
  })
}
