import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

/**
 * 分页获取
 */
export function getUserPage(params) {
  return request({
    url: '/user/list/page',
    method: 'get',
    params
  })
}

/**
 * 不分页获取
 */
export function getUserList(params) {
  return request({
    url: '/user/list/all',
    method: 'get',
    params
  })
}

/**
 * 获取详情
 */
export function getUserDetail(id) {
  return request({
    url: '/user/detail',
    method: 'get',
    params: {id}
  })
}

/**
 * 保存
 */
export function saveUser(data) {
  return request({
    url: '/user/save',
    method: 'post',
    data
  })
}

/**
 * 删除
 */
export function deleteUser(id) {
  return request({
    url: '/user/del',
    method: 'delete',
    data: { id }
  })
}
