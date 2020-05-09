import Vue from 'vue'
import Router from 'vue-router'
import {Page404,Transition} from '../../baseComponents'
import Query from '../components/query'
import Step1 from '../components/step1'
import Step2 from '../components/step2'
import Step3 from '../components/step3'
import Step4 from '../components/step4'
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
                    title: '修改银行卡密码'
                }
            },
            {
                path: '/step1',
                name: 'step1',
                component: Step1,
                meta: {
                    title: '实名认证'
                }
            },
            {
                path: '/step2',
                name: 'step2',
                component: Step2,
                meta: {
                    title: '实名认证'
                }
            },
            {
                path: '/step3',
                name: 'step3',
                component: Step3,
                meta: {
                    title: '实名认证'
                }
            },
            {
                path: '/step4',
                name: 'step4',
                component: Step4,
                meta: {
                    title: '实名认证'
                }
            },
            {
                path: '/result',
                name: 'result',
                component: Result,
                meta: {
                    title: '修改密码'
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

