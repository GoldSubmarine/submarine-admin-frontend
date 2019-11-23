import request from '@/utils/request'

/**
 * 分页获取
 */
export function getDictionaryItemPage(params) {
  return request({
    url: '/dictionary-item/list/page',
    method: 'get',
    params
  })
}

/**
 * 不分页获取
 */
export function getDictionaryItemList(params) {
  return request({
    url: '/dictionary-item/list/all',
    method: 'get',
    params
  })
}

/**
 * 获取详情
 */
export function getDictionaryItemDetail(id) {
  return request({
    url: '/dictionary-item/detail',
    method: 'get',
    params: { id }
  })
}

/**
 * 保存
 */
export function saveDictionaryItem(data) {
  return request({
    url: '/dictionary-item/save',
    method: 'post',
    data
  })
}

/**
 * 删除
 */
export function deleteDictionaryItem(id) {
  return request({
    url: '/dictionary-item/del',
    method: 'delete',
    data: { id }
  })
}
