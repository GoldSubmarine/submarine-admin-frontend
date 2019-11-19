import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'
import qs from 'qs'
const vsprintf = require('sprintf-js').vsprintf

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'bearer ' + getToken()
    }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    config.url = config.url + '?_timestamp=' + Date.now()
    removeBlankKeys(config.data)
    removeBlankKeys(config.params)
    config.data = qs.stringify(config.data, { allowDots: true, indices: false })
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // 更新token
    if (response.headers['x-token']) {
      setToken(response.headers['x-token'])
    }

    const res = response.data ? response.data : {}
    formatMsg(res)

    // if the custom code is not 20000, it is judged as an error.
    // 业务代码错误
    if (res.code && res.code >= 50000) {
      Message({
        message: res.msg || '服务器错误',
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    const res = error.response.data ? error.response.data : {}
    formatMsg(res)
    console.log('err' + error) // for debug

    let msg
    if (error.response.status === 404) {
      msg = '接口不存在'
    } else if (error.response.status === 403) {
      msg = '无权访问'
    } else if (error.response.status === 401) {
      msg = '认证失败，请重新登录'
    }
    Message({
      message: res.msg || msg || '服务器错误',
      type: 'error',
      duration: 5 * 1000
    })

    if (error.response.status === 401) {
      // to re-login
      if (error.config.url.startWith(process.env.VUE_APP_BASE_API + '/auth/info')) {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      } else {
        MessageBox.confirm('当前登录已过期，请重新登录', '提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
    }

    return Promise.reject(error)
  }
)

function removeBlankKeys(obj) {
  if (!obj) return undefined
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && (obj[key] === '' || obj[key] === undefined || obj[key] === null)) {
      delete obj[key]
    }
  }
}

// 用于将转换提示的 msg 信息，或国际化
function formatMsg(res) {
  if (res && res.msg && res.data instanceof Array) {
    res.msg = vsprintf(res.msg, res.data)
  }
}

export default service
