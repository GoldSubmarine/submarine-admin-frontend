import request from '@/utils/request'

/**
 * 分页获取
 */
export function getActProcessPage(params, pageNum, pageSize) {
  return request({
    url: '/workflow/process/list/page',
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
export function getActProcessList(params) {
  return request({
    url: '/workflow/process/list/all',
    method: 'get',
    params
  })
}

/**
 * 获取详情
 */
export function getActProcessDetail(id) {
  return request({
    url: '/workflow/process/detail/' + id,
    method: 'get'
  })
}

/**
 * 获取资源
 */
export function getActProcessResource(id, name) {
  return request({
    url: '/workflow/process/resource/' + id,
    method: 'get',
    params: { name }
  })
}

/**
 * 保存
 */
export function saveActProcess(data) {
  return request({
    url: '/workflow/process/save',
    method: 'post',
    data
  })
}

/**
 * 激活/挂起
 */
export function changeProcessStatus({ id, suspensionState }) {
  return request({
    url: '/workflow/process/status/' + id,
    method: 'post',
    data: { suspensionState }
  })
}

/**
 * 删除
 */
export function deleteActDeployment(id) {
  return request({
    url: '/workflow/process/del/' + id,
    method: 'delete'
  })
}
