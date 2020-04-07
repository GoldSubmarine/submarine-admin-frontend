import request from '@/utils/request'

/**
 * 分页获取
 */
export function getQuartzJobPage(params, pageNum, pageSize) {
  return request({
    url: '/quartz-job/list/page',
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
export function getQuartzJobList(params) {
  return request({
    url: '/quartz-job/list/all',
    method: 'get',
    params
  })
}

/**
 * 获取详情
 */
export function getQuartzJobDetail(id) {
  return request({
    url: '/quartz-job/detail',
    method: 'get',
    params: { id }
  })
}

/**
 * 保存
 */
export function saveQuartzJob(data) {
  return request({
    url: '/quartz-job/save',
    method: 'post',
    data
  })
}

/**
 * 删除
 */
export function deleteQuartzJob(id) {
  return request({
    url: '/quartz-job/del',
    method: 'delete',
    data: { id }
  })
}

/**
 * 执行一次
 */
export function runQuartzJob(id) {
  return request({
    url: '/quartz-job/run',
    method: 'post',
    data: { id }
  })
}

/**
 * 停用
 */
export function changeQuartzJobStatus(id, status) {
  return request({
    url: '/quartz-job/status',
    method: 'post',
    data: { id, status }
  })
}

/**
 * 查询日志
 */
export function findLogByPage(params, pageNum, pageSize) {
  return request({
    url: '/quartz-job/log/page',
    method: 'get',
    params: {
      ...params,
      pageNum,
      pageSize
    }
  })
}
