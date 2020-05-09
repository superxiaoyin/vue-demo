import Vue from 'vue'
import Router from 'vue-router'
import {Page404,Transition,Result} from '../../baseComponents'
import WealthAccount from '../components/wealthaccount'
import TradeRecord from '../components/traderecord'
import WealthRedeem from '../components/wealthredeem'
import RedeemDetail from '../components/redeemdetail'
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
                name: 'wealthaccount',
                component: WealthAccount
            },
            {
                path: '/traderecord',
                name: 'traderecord',
                component: TradeRecord
            },
            {
                path: '/wealthredeem',
                name: 'wealthredeem',
                component: WealthRedeem
            },
            {
                path: '/redeemdetail',
                name: 'redeemdetail',
                component: RedeemDetail
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

