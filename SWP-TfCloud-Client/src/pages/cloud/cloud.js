import Vue from 'vue'
import moment from 'moment'
import store from './store'
import router from './router'
import App from './App'
import  { ConfirmPlugin } from 'vux'
Vue.use(require('vue-wechat-title')).use(ConfirmPlugin)
let textUrl = ''
if(process.env.NODE_ENV == 'development'){
    textUrl = 'https://lzccbdev.sinosun.com:12443'
}else{
    textUrl = ''
}
window.textUrl = textUrl

Vue.directive('time', {
    bind: function (el, binding) {
        let getTime = new Date(binding.value)
        el.innerHTML = `${getTime.getFullYear()}-${getTime.getMonth()+1}-${getTime.getDate()} ${getTime.getHours()}:${getTime.getMinutes()}:${getTime.getSeconds()}`;
    }
})


Vue.filter('time', function (value, formatString) {
    formatString = formatString || 'YYYY-MM-DD HH:mm';
    return moment(value).format(formatString);
})


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
