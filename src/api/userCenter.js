import request from '@/utils/request'

/**
 * 获取详情
 */
export function getUserDetail(id) {
  return request({
    url: '/user-center/detail',
    method: 'get'
  })
}

/**
 * 保存
 */
export function saveUser(data) {
  return request({
    url: '/user-center/save',
    method: 'post',
    data
  })
}

/**
 * 修改密码
 */
export function changePass(data) {
  return request({
    url: '/user-center/changePass',
    method: 'post',
    data
  })
}
