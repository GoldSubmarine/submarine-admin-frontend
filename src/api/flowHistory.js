import request from '@/utils/request'

/**
 * 分页获取
 */
export function getFlowHistoryPage(params, pageNum, pageSize) {
  return request({
    url: '/flow-history/list/page',
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
export function getFlowHistoryList(params) {
  return request({
    url: '/flow-history/list/all',
    method: 'get',
    params
  })
}

/**
 * 获取详情
 */
export function getFlowHistoryDetail(id) {
  return request({
    url: '/flow-history/detail/' + id,
    method: 'get'
  })
}

/**
 * 保存
 */
export function saveFlowHistory(data) {
  return request({
    url: '/flow-history/save',
    method: 'post',
    data
  })
}

/**
 * 删除
 */
export function deleteFlowHistory(id) {
  return request({
    url: '/flow-history/del/' + id,
    method: 'delete'
  })
}
