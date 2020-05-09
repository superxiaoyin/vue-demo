import Vue from 'vue'
import Router from 'vue-router'
import {Page404,Transition,Result} from '../../baseComponents'
import AccountList from '../components/accountlist'
import AccountDetail from '../components/accountdetail'
import Operate from '../components/operate'
import OperatePay from '../components/operatePay'
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
                path: '',
                name: 'accountlist',
                component: AccountList,
                meta: {
                    title: '账户余额'
                }
            },
            {
                path: '/accountdetail',
                name: 'accountdetail',
                component: AccountDetail,
                meta: {
                    title: 'Ⅱ类户'
                }
            },
            {
                path: '/operate',
                name: 'operate',
                component: Operate,
                meta: {
                    title: '充值提现'
                }
            },
            {
                path: '/operatepay',
                name: 'operatepay',
                component: OperatePay,
                meta: {
                    title: '充值'
                }
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

