import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'assets/fonts/iconfont.css';

import './plugins/element.js'
import './plugins/vant.js'        /* 模仿ele ui；放在那儿(也可以直接放其他地方)，不然写在这儿这里太多了 */

/*  全局引入组件才需要在这儿额外导入css样式文件。  按需加载组件，在babel.config.js中配置之后，不需要再额外导入了
import 'vant/lib/index.css'
import 'element-ui/lib/theme-chalk/index.css'; */

//注册全局 导航条 组件
import NavBar from 'components/common/navbar/NavBar.vue'
Vue.component('nav-bar',NavBar)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
