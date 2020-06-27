import request from '@/utils/request'

/**
 * 获取待办
 */
export function getTodoPage(data, pageNum, pageSize) {
  return request({
    url: '/workflow/task/todo/page',
    method: 'get',
    params: { ...data, pageNum, pageSize }
  })
}

/**
 * 获取已办任务
 */
export function getDonePage(data, pageNum, pageSize) {
  return request({
    url: '/workflow/task/done/page',
    method: 'get',
    params: { ...data, pageNum, pageSize }
  })
}

/**
 * 获取我的申请
 */
export function getApplyPage(data, pageNum, pageSize) {
  return request({
    url: '/workflow/task/apply/page',
    method: 'get',
    params: { ...data, pageNum, pageSize }
  })
}

/**
 * 撤销申请
 */
export function deleteApply(processInstanceId, deleteReason) {
  return request({
    url: '/workflow/task/apply/delete',
    method: 'post',
    data: { processInstanceId, deleteReason }
  })
}

/**
 * 获取历史操作记录
 */
export function getHistoryOperate(processInstanceId, taskDefinitionKey) {
  return request({
    url: '/workflow/task/history/operate',
    method: 'get',
    params: { processInstanceId, taskDefinitionKey }
  })
}
