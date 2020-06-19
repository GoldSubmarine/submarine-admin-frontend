import request from '@/utils/request'

/**
 * 分页获取
 */
export function getLeaveFlowPage(params, pageNum, pageSize) {
  return request({
    url: '/leave-flow/list/page',
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
export function getLeaveFlowList(params) {
  return request({
    url: '/leave-flow/list/all',
    method: 'get',
    params
  })
}

/**
 * 获取详情
 */
export function getLeaveFlowDetail(id) {
  return request({
    url: '/leave-flow/detail/' + id,
    method: 'get'
  })
}

/**
 * 保存
 */
export function saveLeaveFlow(data) {
  return request({
    url: '/leave-flow/save',
    method: 'post',
    data
  })
}

/**
 * 删除
 */
export function deleteLeaveFlow(id) {
  return request({
    url: '/leave-flow/del/' + id,
    method: 'delete'
  })
}
