import request from '@/utils/request'

/**
 * 分页获取权限
 */
export function getPermissionPage(params, pageNum, pageSize) {
  return request({
    url: '/permission/list/page',
    method: 'get',
    params: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/**
 * 不分页获取权限
 */
export function getPermissionList(params) {
  return request({
    url: '/permission/list/all',
    method: 'get',
    params
  })
}

/**
 * 获取权限详情
 */
export function getPermissionDetail(id) {
  return request({
    url: '/permission/detail',
    method: 'get',
    params: { id }
  })
}

/**
 * 获取权限的 tree
 */
export function getPermissionTree(params) {
  return request({
    url: '/permission/tree/list',
    method: 'get',
    params
  })
}

/**
 * 保存权限
 */
export function savePermission(data) {
  return request({
    url: '/permission/save',
    method: 'post',
    data
  })
}

/**
 * 模块保存权限
 */
export function saveModulePermission(data) {
  return request({
    url: '/permission/save/module',
    method: 'post',
    data
  })
}

/**
 * 删除权限
 */
export function deletePermission(id) {
  return request({
    url: '/permission/del',
    method: 'delete',
    data: { id }
  })
}
