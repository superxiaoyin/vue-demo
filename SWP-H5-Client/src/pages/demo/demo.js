import Vue from 'vue'
//import 'babel-polyfill'
import router from './router'
import App from './App'
import { ToastPlugin } from "vux";
Vue.use(ToastPlugin);


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')

