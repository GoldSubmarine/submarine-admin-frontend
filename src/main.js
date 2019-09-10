import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import importDic from '@/mixin/importDic'; //全局加载数据字典
import importRules from '@/mixin/importRules'; //全局加载校验
import checkPermission from '@/mixin/permission'; //全局加载校验
import commonMsg from '@/mixin/commonMsg'; //全局加载校验
import Xcrud from '../package/index'; //全局加载数据字典

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

Vue.use(ElementUI)
Vue.use(importDic)
Vue.use(importRules)
Vue.use(checkPermission)
Vue.use(commonMsg)
Vue.use(Xcrud)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
