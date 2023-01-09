import Vue from 'vue'
import Element from 'element-ui'
import App from './App'
import store from './store'
import router from './router'
import i18n from './lang'
import * as filters from './filters'

import './styles/element-variables.scss'
import '@/styles/index.scss'

import './icons'
import './permission'
import './utils/error-log'

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
