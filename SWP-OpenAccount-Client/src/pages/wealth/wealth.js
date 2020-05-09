import Vue from 'vue'
//import 'babel-polyfill'
import router from './router'
import App from './app'
import { TransferDom } from 'vux'
Vue.directive('transfer-dom', TransferDom)
Vue.use(require('vue-wechat-title'))

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
