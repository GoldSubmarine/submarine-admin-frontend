import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'
import qs from 'qs';

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
      config.headers['Authorization'] = "bearer " + getToken();
    }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    config.url = config.url + '?_timestamp=' + Date.now();
    removeBlankKeys(config.data);
    removeBlankKeys(config.params);
    config.data = qs.stringify(config.data, { allowDots: true, indices: false });
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
    if(response.headers['x-token']) {
      setToken(response.headers['x-token']);
    }

    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    // 业务代码错误
    if (res.code && res.code >= 400) {
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
    let res = error.response.data;
    console.log('err' + error) // for debug

    // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      // to re-login
      MessageBox.confirm('当前登录已过期，请重新登录', '提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else {
      Message({
        message: res.msg || '服务器错误',
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
)

function removeBlankKeys(obj) {
  if(!obj) return undefined;
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && (obj[key] === '' || obj[key] === undefined || obj[key] === null) ) {
      delete obj[key];
    }
  }
}

export default service
