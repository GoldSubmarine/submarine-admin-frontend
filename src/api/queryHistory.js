import request from '@/utils/request'

/**
 * 查询历史记录
 * @param value: value 有值时进行模糊查询，无值时查出所有的历史
 */
export function queryHistory(table, field, value) {
  return request({
    url: '/query/history',
    method: 'get',
    params: { table, field, value }
  })
}
