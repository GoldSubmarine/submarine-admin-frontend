import request from '@/utils/request'

/**
 * 分页获取
 */
export function getActivitiPage(params, pageNum, pageSize) {
  return request({
    url: '/activiti/list/page',
    method: 'get',
    params: {
      ...params,
      pageNum,
      pageSize
    }
  })
}

/**
 * 获取详情
 */
export function getActivitiDetail(id) {
  return request({
    url: '/activiti/detail/' + id,
    method: 'get'
  })
}

/**
 * 删除
 */
export function deleteActiviti(id) {
  return request({
    url: '/activiti/del/' + id,
    method: 'delete'
  })
}
