// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
//引入公共样式
import cssAll from '@/common/scss/index.css'  
Vue.config.productionTip = false
Vue.use(VueResource)
import vueg from 'vueg'    
import 'vueg/css/transition-min.css'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
   Vue.use(vueg, router)  
