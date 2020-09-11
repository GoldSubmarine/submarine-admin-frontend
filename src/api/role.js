import request from '@/utils/request'

/**
 * 分页获取
 */
export function getRolePage(params, pageNum, pageSize) {
  return request({
    url: '/role/list/page',
    method: 'get',
    params: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/**
 * 不分页获取
 */
export function getRoleList(params) {
  return request({
    url: '/role/list/all',
    method: 'get',
    params
  })
}

/**
 * 获取详情
 */
export function getRoleDetail(id) {
  return request({
    url: '/role/detail/' + id,
    method: 'get'
  })
}

/**
 * 保存
 */
export function saveRole(data) {
  return request({
    url: '/role/save',
    method: 'post',
    data
  })
}

/**
 * 权限保存
 */
export function saveRolePermission(roleId, permissionList) {
  return request({
    url: '/role/permission/save',
    method: 'post',
    data: {
      roleId,
      permissionList
    }
  })
}

/**
 * 批量权限保存
 */
export function saveRolePermissionBatch(batchAuthType, roleIds, permissionList) {
  return request({
    url: '/role/permission/batch-save',
    method: 'post',
    data: {
      batchAuthType,
      roleIds,
      permissionList
    }
  })
}

/**
 * 删除
 */
export function deleteRole(id) {
  return request({
    url: '/role/del/' + id,
    method: 'delete'
  })
}
