import Vue from 'vue'
import axios from 'axios'
import iohook from 'iohook'
import { ipcRenderer, remote } from 'electron'
import App from './App'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'

import './assets/ant.less'

const opConfig = remote.getGlobal('opConfig')

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(Antd)
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')


//快捷键呼出面板
// iohook.start(false)

// let down_time = 0
// let isPress = false

// iohook.on('mousedown', (e) => {
//   if (e.button === 1) return
//   isPress = true
//   down_time = Date.now()
//   const config = opConfig.get()
//   setTimeout(async () => {
//     if (isPress) {
//       //长按呼出面板
//       ipcRenderer.send('right-down')
//     }
//   }, config.superPanel.mouseDownTime);
// })

// iohook.on('mouseup', (e) => {
//   if (e.button === 1) return
//   isPress = false
// })
