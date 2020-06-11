import request from '@/utils/request'

/**
 * 分页获取
 */
export function getActModelPage(params, pageNum, pageSize) {
  return request({
    url: '/workflow/model/list/page',
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
export function getActModelDetail(id) {
  return request({
    url: '/workflow/model/detail/' + id,
    method: 'get'
  })
}

/**
 * 保存
 */
export function saveActModel(data) {
  return request({
    url: '/workflow/model/save',
    method: 'post',
    data
  })
}

/**
 * 部署
 */
export function deployActModel(id) {
  return request({
    url: '/workflow/model/deploy/' + id,
    method: 'post'
  })
}

/**
 * 删除
 */
export function deleteActModel(id) {
  return request({
    url: '/workflow/model/del/' + id,
    method: 'delete'
  })
}
