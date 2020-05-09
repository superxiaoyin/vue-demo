import Vue from 'vue'
import Router from 'vue-router'
import {Page404, Transition} from '../../baseComponents'
import Query from '../components/query'
import InsuranceList from '../components/insuranceList'
import InsuranceDetail from '../components/insuranceDetail'
import NormalPay from '../components/normalPay'
import NormalPayDetail from '../components/normalPayDetail'
import PaycardInfo from '../components/paycardInfo'
import PayInfo from '../components/payInfo'
import Protocol from '../components/protocol'
import PayProtocol from '../components/payprotocol'
import Result from '../components/result'
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
                path: '/query',
                name: 'query',
                component: Query,
                meta: {
                    title: '社保缴纳'
                }
            },
            {
                path: '/insuranceList',
                name: 'insuranceList',
                component: InsuranceList,
                meta: {
                    title: '社保缴纳'
                }
            },
            {
                path: '/insuranceDetail',
                name: 'insuranceDetail',
                component: InsuranceDetail,
                meta: {
                    title: '项目详情'
                }
            },
            {
                path: '/normalPay',
                name: 'normalPay',
                component: NormalPay,
                meta: {
                    title: '正常缴费'
                }
            },
            {
                path: '/normalPayDetail',
                name: 'normalPayDetail',
                component: NormalPayDetail,
                meta: {
                    title: '缴费信息'
                }
            },
            {
                path: '/paycardInfo',
                name: 'paycardInfo',
                component: PaycardInfo,
                meta: {
                    title: '支付信息'
                }
            },
            {
                path: '/payInfo',
                name: 'payInfo',
                component: PayInfo,
                meta: {
                    title: '信息确认'
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
                path: '/payprotocol',
                name: 'payprotocol',
                component: PayProtocol,
                meta: {
                    title: '协议'
                }
            },
            {
                path: '/result',
                name: 'result',
                component: Result,
                meta: {
                    title: '缴费结果'
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

