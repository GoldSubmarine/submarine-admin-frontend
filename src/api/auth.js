import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
  })
}

export function getInfo() {
  return request({
    url: '/auth/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
