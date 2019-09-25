import request from '@/utils/request'

/**
 * 分页获取
 */
export function getRolePage(params) {
  return request({
    url: '/role/list/page',
    method: 'get',
    params
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
    url: '/role/detail',
    method: 'get',
    params: { id }
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
export function saveRolePermission(id, permissionList) {
  return request({
    url: '/role/permission/save',
    method: 'post',
    data: {
      id,
      permissionList
    }
  })
}

/**
 * 菜单保存
 */
export function saveRoleMenu(id, menuList) {
  return request({
    url: '/role/menu/save',
    method: 'post',
    data: {
      id,
      menuList
    }
  })
}

/**
 * 删除
 */
export function deleteRole(id) {
  return request({
    url: '/role/del',
    method: 'delete',
    data: { id }
  })
}
