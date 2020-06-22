import request from '@/utils/request'

/**
 * 获取流程表单key
 */
export function getFormKey(processDefinitionId, taskDefinitionKey) {
  return request({
    url: '/workflow/task/form-key',
    method: 'get',
    params: { processDefinitionId, taskDefinitionKey }
  })
}

/**
 * 获取待办
 */
export function getTodoPage(data) {
  return request({
    url: '/workflow/task/todo/page',
    method: 'get',
    params: data
  })
}

/**
 * 获取我的申请
 */
export function getApplyPage(data) {
  return request({
    url: '/workflow/task/apply/page',
    method: 'get',
    params: data
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
export function getHistoryOperate(processInstanceId, activityId) {
  return request({
    url: '/workflow/task/history/operate',
    method: 'get',
    params: { processInstanceId, activityId }
  })
}
