import Vue from 'vue'
import Router from 'vue-router'
import {Page404, Transition} from '../../baseComponents'
import Index from '../components/index'
import Detail from '../components/detail'
import Insure from '../components/insure'
import Order from '../components/order'
import OrderInfo from '../components/orderInfo'
import Bank from '../components/bank'
import Pay from '../components/pay'
import Protocol from '../components/protocol'

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
                    title: '保险'
                }
            },
            {
                path: '/detail',
                name: 'detail',
                component: Detail,
                meta: {
                    title: '详情'
                }
            },
            {
                path: '/insure',
                name: 'insure',
                component: Insure,
                meta: {
                    title: '填写保单'
                }
            },
            {
                path: '/bank',
                name: 'bank',
                component: Bank,
                meta: {
                    title: '银行卡选择'
                }
            },
            {
                path: '/pay',
                name: 'pay',
                component: Pay,
                meta: {
                    title: '保单确认'
                }
            },
            {
                path: '/order',
                name: 'order',
                component: Order,
                meta: {
                    title: '我的保单'
                }
            },
            {
                path: '/orderinfo',
                name: 'orderinfo',
                component: OrderInfo,
                meta: {
                    title: '保单详情'
                }
            },
            {
                path: '/protocol',
                name: 'protocol',
                component: Protocol,
                meta: {
                    title: '协议'
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

