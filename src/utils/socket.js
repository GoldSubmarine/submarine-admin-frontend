import io from 'socket.io-client'
import { Message } from 'element-ui'
import store from '@/store'

const defaultConfig = {
  path: store.getters.api.baseApi,
  domain: store.getters.api.socketApi,
  query: { Authorization: 'test' }
}

function createSocket(config = defaultConfig) {
  if (!socket) {
    socket = io(config.domain, {
      path: config.path + '/',
      query: config.query,
      transports: ['websocket']
    })
    // 重连时更新token,参见：https://github.com/socketio/socket.io-client/issues/1118
    socket.on('reconnect_attempt', function() {
      socket.io.opts.query.Authorization = store.getters.token
    })
    return socket
  } else {
    return socket
  }
}

let socket
let state

class SocketFactory {
  constructor(resolve, reject) {
    // type:事件类型，fun：逻辑函数
    this.events = {}
    // 添加事件
    this.addEvents = function(type, fun, interceptor) {
      if (type && fun) {
        if (!this.events[type]) {
          this.events[type] = []
        }
        this.events[type].push({
          fun: fun,
          interceptor: interceptor
        })
      }
    }
    // 删除事件
    this.removeListener = function(type, fun) {
      if (this.events[type] && type && fun) {
        this.events[type] = this.events[type].filter(item => {
          if (item.fun === fun) {
            this.socket.removeListener(type, item.interceptor)
          }
          return item.fun !== fun
        })
      } else if (this.events[type] && type) {
        this.events[type].forEach(item => {
          this.socket.removeListener(type, item.interceptor)
        })
        this.events[type] = []
      }
    }
    // 当前单例的socket的状态
    this.state = state
    // 原生的socket
    this.socket = createSocket()
    // 注册成功的逻辑
    this.registered = () => {
      state = this.socket.connected
      resolve && resolve()
    }
    // 注册失败的逻辑
    this.registrationFailed = () => {
      state = ''
      reject && reject()
    }
    // 注销
    this.destroy = (type, fun) => {
      if (type) {
        this.removeListener(type, fun)
      } else {
        for (const p in this.events) {
          this.removeListener(p)
        }
        this.socket.off(this.registered)
        this.socket.off(this.registrationFailed)
      }
    }
    // 监听事件
    this.on = (type, fun) => {
      const interceptor = this.interceptor(fun)
      this.addEvents(type, fun, interceptor)
      this.socket.on(type, interceptor)
    }
    // 一次性监听事件
    this.once = (type, fun) => {
      const interceptor = this.interceptor(fun)
      this.addEvents(type, fun, interceptor)
      this.socket.once(type, interceptor)
    }
    // 发送消息
    this.emit = (type, msg) => this.socket.emit(type, msg)
    // 回调拦截器
    this.interceptor = function(fun) {
      return function() {
        // 拦截操作
        const res = arguments[0]
        if (res.code !== 200) {
          console.log(res)// for debug
          Message({
            message: '返回错误！',
            type: 'error',
            duration: 5 * 1000
          })
        }
        fun(res)
      }
    }
    socket.on('connect', this.registered)
    socket.on('reconnect_failed', this.registrationFailed)
    socket.on('connect_failed', this.registrationFailed)
    // this.socket.on('registered', this.registered)
    // this.socket.on('registrationFailed', this.registrationFailed);
  }
}

export default function(resolve, reject) {
  return new SocketFactory(resolve, reject)
}
/* this.socket = createSip(() => {
        //成功的回调
    }, () => {
        //失败的回调
});

if(this.socket.state == 'success') {
    // 判断之前是否已经存在单例
} */
