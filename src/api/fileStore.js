import request from '@/utils/request'

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
    url: '/file/detail',
    method: 'get',
    params: { id }
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
    url: '/file/del',
    method: 'delete',
    data: { id }
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
export function getFileStoreBinary(url) {
  return request({
    url: url,
    method: 'get',
    responseType: 'blob'
  })
}
