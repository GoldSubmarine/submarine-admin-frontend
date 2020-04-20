import request from '@/utils/request'

/**
 * 分页获取部门
 */
export function getDeptPage(params, pageNum, pageSize) {
  return request({
    url: '/dept/list/page',
    method: 'get',
    params: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/**
 * 不分页获取部门
 */
export function getDeptList(params) {
  return request({
    url: '/dept/list/all',
    method: 'get',
    params
  })
}

/**
 * 获取部门详情
 */
export function getDeptDetail(id) {
  return request({
    url: '/dept/detail/' + id,
    method: 'get'
  })
}

/**
 * 获取部门的 tree
 */
export function getDeptTree(params) {
  return request({
    url: '/dept/tree/list',
    method: 'get',
    params
  })
}

/**
 * 保存部门
 */
export function saveDept(data) {
  return request({
    url: '/dept/save',
    method: 'post',
    data
  })
}

/**
 * 删除部门
 */
export function deleteDept(id) {
  return request({
    url: '/dept/del/' + id,
    method: 'delete'
  })
}
