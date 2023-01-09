import request from '@/utils/request'

export function lastMonthJobTrend() {
  return request({
    url: '/dashboard/lastMonthJobTrend',
    method: 'get'
  })
}

export function ruleYesterdaySuccessCount() {
  return request({
    url: '/dashboard/ruleYesterdaySuccessCount',
    method: 'get'
  })
}
export function ruleYesterdayFailCount() {
  return request({
    url: '/dashboard/ruleYesterdayFailCount',
    method: 'get'
  })
}
export function projectCount() {
  return request({
    url: '/dashboard/projectCount',
    method: 'get'
  })
}

export function jobCount() {
  return request({
    url: '/dashboard/jobCount',
    method: 'get'
  })
}

export function ruleCount() {
  return request({
    url: '/dashboard/ruleCount',
    method: 'get'
  })
}

export function projectRuleCount() {
  return request({
    url: '/dashboard/projectRuleCount',
    method: 'get'
  })
}

export function projectJobCount() {
  return request({
    url: '/dashboard/projectJobCount',
    method: 'get'
  })
}

