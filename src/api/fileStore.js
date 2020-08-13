import request from '@/utils/request'
import store from '@/store'

/**
 * 分页获取
 */
export function getFileStorePage(params, pageNum, pageSize) {
  return request({
    url: '/file/list/page',
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
export function getFileStoreList(params) {
  return request({
    url: '/file/list/all',
    method: 'get',
    params
  })
}

/**
 * 获取详情
 */
export function getFileStoreDetail(id) {
  return request({
    url: '/file/detail/' + id,
    method: 'get'
  })
}

/**
 * 保存
 */
export function saveFileStore(data) {
  return request({
    url: '/file/save',
    method: 'post',
    data
  })
}

/**
 * 删除
 */
export function deleteFileStore(id) {
  return request({
    url: '/file/del/' + id,
    method: 'delete'
  })
}

/**
 * 文件上传
 */
export function uploadFileStore(data) {
  return request({
    url: '/file/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data
  })
}

/**
 * 获取文件的二进制数据
 */
export function getFileStoreBinary(url, responseType = 'blob') {
  if (url.indexOf(store.getters.api.baseUrl) === 0) {
    url = url.substring(store.getters.api.baseUrl.length)
  }
  return request({
    url: url,
    method: 'get',
    responseType: responseType // arraybuffer, blob
  })
}
