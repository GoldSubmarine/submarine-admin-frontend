import request from '@/utils/request'

/**
 * 分页获取菜单
 */
export function getMenuPage(params) {
  return request({
    url: '/menu/list/page',
    method: 'get',
    params
  })
}

/**
 * 不分页获取菜单
 */
export function getMenuList(params) {
  return request({
    url: '/menu/list/all',
    method: 'get',
    params
  })
}

/**
 * 获取菜单详情
 */
export function getMenuDetail(id) {
  return request({
    url: '/menu/detail',
    method: 'get',
    params: { id }
  })
}

/**
 * 获取菜单的 tree
 */
export function getMenuTree(params) {
  return request({
    url: '/menu/tree/list',
    method: 'get',
    params
  })
}

/**
 * 保存菜单
 */
export function saveMenu(data) {
  return request({
    url: '/menu/save',
    method: 'post',
    data
  })
}

/**
 * 删除菜单
 */
export function deleteMenu(id) {
  return request({
    url: '/menu/del',
    method: 'delete',
    data: { id }
  })
}
