import Vue from 'vue'
//import 'babel-polyfill'
import router from './router'
import App from './App'
import { TransferDom, LoadingPlugin } from 'vux'
Vue.use(require('vue-wechat-title')).use(LoadingPlugin)
Vue.directive('transfer-dom', TransferDom)
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
