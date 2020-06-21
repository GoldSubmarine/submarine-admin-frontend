import request from '@/utils/request'

/**
 * 分页获取
 */
export function getFlowLeavePage(params, pageNum, pageSize) {
  return request({
    url: '/flow-leave/list/page',
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
export function getFlowLeaveList(params) {
  return request({
    url: '/flow-leave/list/all',
    method: 'get',
    params
  })
}

/**
 * 获取详情
 */
export function getFlowLeaveDetail(id) {
  return request({
    url: '/flow-leave/detail/' + id,
    method: 'get'
  })
}

/**
 * 获取详情
 */
export function getFlowLeaveDetailByProcessInstanceId(id) {
  return request({
    url: '/flow-leave/detail/by-process-instance-id/' + id,
    method: 'get'
  })
}

/**
 * 保存
 */
export function saveFlowLeave(data) {
  return request({
    url: '/flow-leave/save',
    method: 'post',
    data
  })
}

/**
 * 删除
 */
export function deleteFlowLeave(id) {
  return request({
    url: '/flow-leave/del/' + id,
    method: 'delete'
  })
}
