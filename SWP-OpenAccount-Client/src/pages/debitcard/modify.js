import Vue from 'vue'
//import 'babel-polyfill'
import router from './router'
import 'sslib/common/extend.js';
import App from './App.vue';
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
