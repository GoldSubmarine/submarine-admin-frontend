/**
 * Created by PanJiaChen on 16/11/18.
 */

import * as ruleListAll from '../utils/rules'
import * as selectListAll from '../utils/dic'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * 导入数据字典
 */
export function importDic(...listName) {
  let arr = []
  listName.forEach(name => {
    if (selectListAll[name]) {
      arr = arr.concat(selectListAll[name])
    } else {
      console.log(`不存在数据字典${name}！！！`)
    }
  })
  return arr
}

/**
 * 从数据字典中获取到 value
 */
export function filterDic(listName, value) {
  const dic = selectListAll[listName]
  if (dic) {
    for (let i = 0; i < dic.length; i++) {
      if (dic[i].value === value) return dic[i].label
    }
  }
  return ''
}

/**
 * 导入校验规则
 */
export function importRules(...names) {
  let result = []
  names.forEach(name => {
    result = result.concat(ruleListAll[name])
  })
  return result
}

/**
 * 生成字符串长度的校验
 */
export function limitStrRule(min, max) {
  return [
    { min: min, max: max, message: `长度为 ${min} 到 ${max} 个字符`, trigger: 'blur' }
  ]
}

/**
 * 生成数字大小的校验
 */
export function limitNumRule(min, max) {
  return [
    { min: min, max: max, message: `数字在 ${min} 到 ${max} 之间`, trigger: 'blur' }
  ]
}

/**
 * 导出表格的数据整理
 * @param {Array} columnConfig 必须有name,label，如果有dic或formatter会自动转换，show如果是false则不会导出
 * @param {Array} rawListData
 */
export function generateExcelData(columnConfig, rawListData) {
  const result = {
    header: [],
    data: []
  }
  // 填充头部
  columnConfig.forEach(column => {
    if (column.show !== false) {
      result.header.push(column.label)
    }
  })
  // 填充数据
  rawListData.forEach(rawData => {
    const row = []
    columnConfig.forEach(column => {
      let value = rawData[column.name]
      if (column.dic) value = filterDic(column.dic, value)
      if (column.formatter) value = column.formatter(rawData)
      if (column.show !== false) {
        row.push(value)
      }
    })
    result.data.push(row)
  })
  return result
}
