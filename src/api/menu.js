import request from '@/utils/request'

/**
 * 分页获取权限
 */
export function getMenuPage(params) {
  return request({
    url: '/menu/list/page',
    method: 'get',
    params
  })
}

/**
 * 不分页获取权限
 */
export function getMenuList(params) {
  return request({
    url: '/menu/list/all',
    method: 'get',
    params
  })
}

/**
 * 获取权限详情
 */
export function getMenuDetail(id) {
  return request({
    url: '/menu/detail',
    method: 'get',
    params: {id}
  })
}

/**
 * 获取权限的 tree
 */
export function getMenuTree() {
  return request({
    url: '/menu/tree/list',
    method: 'get',
  })
}

/**
 * 保存权限
 */
export function saveMenu(data) {
  return request({
    url: '/menu/save',
    method: 'post',
    data
  })
}

/**
 * 删除权限
 */
export function deleteMenu(id) {
  return request({
    url: '/menu/del',
    method: 'delete',
    data: { id }
  })
}
