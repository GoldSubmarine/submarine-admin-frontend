import request from '@/utils/request'

/**
 * 分页获取
 */
export function getDictionaryPage(params, pageNum, pageSize) {
  return request({
    url: '/dictionary/list/page',
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
export function getDictionaryList(params) {
  return request({
    url: '/dictionary/list/all',
    method: 'get',
    params
  })
}

/**
 * 获取详情
 */
export function getDictionaryDetail(id) {
  return request({
    url: '/dictionary/detail',
    method: 'get',
    params: { id }
  })
}

/**
 * 保存
 */
export function saveDictionary(data) {
  return request({
    url: '/dictionary/save',
    method: 'post',
    data
  })
}

/**
 * 删除
 */
export function deleteDictionary(id) {
  return request({
    url: '/dictionary/del',
    method: 'delete',
    data: { id }
  })
}
