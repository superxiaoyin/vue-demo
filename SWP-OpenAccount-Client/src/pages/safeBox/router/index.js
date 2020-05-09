import Vue from 'vue'
import Router from 'vue-router'
import {Page404,Transition } from '../../baseComponents'
import Home from '../components/home'
import SafeBoxInfo from '../components/safeBoxInfo'
import rentWithDraw from '../components/rentWithDraw'
import Introduction from '../components/introduction'
import Reservation from '../components/reservation'
import ResultReservation from '../components/resultReservation'

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
                path: '/home',
                name: 'home',
                component: Home,
                meta: {
                    title: '保险箱主页'
                }
            },
            {
                path: '/rentWithDraw',
                name: 'rentWithDraw',
                component: rentWithDraw,
                meta: {
                    title: '续租'
                }
            },
            {
                path: '/safeBoxInfo',
                name: 'safeBoxInfo',
                component: SafeBoxInfo,
                meta: {
                    title: '保险箱详情'
                }
            },
      
            {
                path: '/introduction',
                name: 'introduction',
                component: Introduction,
                meta: {
                    title: '业务介绍'
                }
            }, 
            {
                path: '/reservation',
                name: 'reservation',
                component: Reservation,
                meta: {
                    title: '预约'
                }
            },
            {
                path: '/resultReservation',
                name: 'resultReservation',
                component: ResultReservation,
                meta: {
                    title: '预约结果'
                }
            },
            {
                path: '/handleRentIndex',
                name: 'handleRentIndex',
                component: ()=>import('../components/handleRent/HandleRentIndex.vue'),
                meta: {
                    title: '保管箱租用'
                }
            },
            {
                path: '/handleRentIntroduce',
                name: 'handleRentIntroduce',
                component: ()=>import('../components/handleRent/HandleRentIntroduce.vue'),
                meta: {
                    title: '保管箱租用'
                }
            },
            {
                path: '/handleRentOcr',
                name: 'handleRentOcr',
                component: ()=>import('../components/handleRent/HandleRentOcr.vue'),
                meta: {
                    title: '保管箱租用'
                }
            },
            {
                path: '/handleRentPersoninfo',
                name: 'handleRentPersoninfo',
                component: ()=>import('../components/handleRent/HandleRentPersoninfo.vue'),
                meta: {
                    title: '保管箱租用'
                }
            },
            {
                path: '/handleRentConfirm',
                name: 'handleRentConfirm',
                component: ()=>import('../components/handleRent/HandleRentConfirm.vue'),
                meta: {
                    title: '保管箱租用'
                }
            },
            {
                path: '/handleRentAgreement',
                name: 'handleRentAgreement',
                component: ()=>import('../components/handleRent/HandleRentAgreement.vue'),
                meta: {
                    title: '保管箱租用协议'
                }
            },
            {
                path: '*',
                component: Page404,
            },
        ]
    }],
    scrollBehavior(to, from, savedPosition) {
        return {x: 0, y: 0}
    }
});
export default router

