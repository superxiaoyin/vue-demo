import Vue from 'vue'
import Router from 'vue-router'
import {Page404,Transition,Result} from '../../baseComponents'
import WealthList from '../components/wealthlist'
import WealthDetail from '../components/wealthdetail'
import WealthBuy from '../components/wealthbuy'
Router.prototype.goBack = function () {
    this.isBack = true
    window.history.go(-1)
}

Vue.use(Router)

const router = new Router({
    routes: [{
        path: '/',
        component: Transition,
        children: [
            {
                path: '/wealthlist',
                name: 'wealthlist',
                component: WealthList
            },
            {
                path: '/wealthdetail',
                name: 'wealthdetail',
                component: WealthDetail
            },
            {
                path: '/wealthbuy',
                name: 'wealthbuy',
                component: WealthBuy
            },
            {
                path: '/result',
                name: 'result',
                component: Result
            },
            {
                path: '*',
                component: Page404,
            }
        ]
    }],
    scrollBehavior(to, from, savedPosition) {
        return {x: 0, y: 0}
    }
});
export default router

