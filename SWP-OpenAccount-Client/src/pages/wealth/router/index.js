import Vue from 'vue'
import Router from 'vue-router'
import {Page404,Transition,Result} from '../../baseComponents'
import WealthList from '../components/wealthlist'
import WealthDetail from '../components/wealthdetail'
import WealthBuy from '../components/wealthbuy'
import WealthShare from '../components/wealthshare'
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
                component: WealthList,
                meta: {
                    title: '产品列表'
                }
            },
            {
                path: '/wealthdetail',
                name: 'wealthdetail',
                component: WealthDetail,
                meta: {
                    title: '产品详情'
                }
            },
            {
                path: '/wealthbuy',
                name: 'wealthbuy',
                component: WealthBuy,
                meta: {
                    title: '买入'
                }
            },
            {
                path: '/wealthshare',
                name: 'wealthshare',
                component: WealthShare,
                meta: {
                    title: '分享'
                }
            },
            {
                path: '/result',
                name: 'result',
                component: Result,
                meta: {
                    title: '结果'
                }
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

