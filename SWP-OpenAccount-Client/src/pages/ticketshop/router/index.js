import Vue from 'vue'
import Router from 'vue-router'
import {Page404, Transition} from '../../baseComponents'
import Index from '../components/index'
import Detail from '../components/detail'
import Buyconfirm from '../components/buyconfirm'
import Myticket from '../components/myticket'
import Pay from '../components/pay'
import Orderlist from '../components/orderlist'
import Orderinfo from '../components/orderinfo'

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
                path: '/',
                name: 'index',
                component: Index,
                meta: {
                    title: '花田酒地'
                }
            },
            {
                path: '/detail',
                name: 'detail',
                component: Detail,
                meta: {
                    title: '购买详情'
                }
            },
            {
                path: '/buyconfirm',
                name: 'buyconfirm',
                component: Buyconfirm,
                meta: {
                    title: '填写订单'
                }
            },
            {
                path: '/pay',
                name: 'pay',
                component: Pay,
                meta: {
                    title: '填写订单'
                }
            },
            {
                path: '/myticket',
                name: 'myticket',
                component: Myticket,
                meta: {
                    title: '我的票'
                }
            },
            {
                path: '/orderlist',
                name: 'orderlist',
                component: Orderlist,
                meta: {
                    title: '我的票'
                }
            },
            {
                path: '/orderinfo',
                name: 'orderinfo',
                component: Orderinfo,
                meta: {
                    title: '我的票'
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

