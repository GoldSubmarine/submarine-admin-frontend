import request from '@/utils/request'

/**
 * 分页获取
 */
export function getLocationPage(params, pageNum, pageSize) {
  return request({
    url: '/location/list/page',
    method: 'get',
    params: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/**
 * 获取tree
 */
export function getLocationTree(params) {
  return request({
    url: '/location/tree',
    method: 'get',
    params: {
      ...params
    }
  })
}

/**
 * 不分页获取
 */
export function getLocationList(params) {
  return request({
    url: '/location/list/all',
    method: 'get',
    params
  })
}

/**
 * 获取详情
 */
export function getLocationDetail(id) {
  return request({
    url: '/location/detail/' + id,
    method: 'get'
  })
}

/**
 * 保存
 */
export function saveLocation(data) {
  return request({
    url: '/location/save',
    method: 'post',
    data
  })
}

/**
 * 删除
 */
export function deleteLocation(id) {
  return request({
    url: '/location/del/' + id,
    method: 'delete'
  })
}
