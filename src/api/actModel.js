import request from '@/utils/request'

/**
 * 分页获取
 */
export function getActModelPage(params, pageNum, pageSize) {
  return request({
    url: '/act/model/list/page',
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
    url: '/act/model/detail/' + id,
    method: 'get'
  })
}

/**
 * 保存model
 */
export function saveActModelXML(data) {
  return request({
    url: '/act/model/save/xml',
    method: 'post',
    data
  })
}

/**
 * 保存
 */
export function saveActModel(data) {
  return request({
    url: '/act/model/save',
    method: 'post',
    data
  })
}

/**
 * 部署
 */
export function deployActModel(id) {
  return request({
    url: '/act/model/deploy/' + id,
    method: 'post'
  })
}

/**
 * 删除
 */
export function deleteActModel(id) {
  return request({
    url: '/act/model/del/' + id,
    method: 'delete'
  })
}
