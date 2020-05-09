import Vue from 'vue'
import Router from 'vue-router'
import {Page404,Transition,Result} from '../../baseComponents'
import CardList from '../components/cardlist'
import CardAdd from '../components/cardadd'
import BindCardList from '../components/bindcardlist'
import BindCard from '../components/bindcard'
import AccountAdd from '../components/accountadd'
import SuperCardList from '../components/supercardlist'
import VerifyCode from '../components/verifycode'
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
                name: 'cardlist',
                component: CardList,
                meta: {
                    title: '我的卡包'
                }
            },
            {
                path: '/cardadd',
                name: 'cardadd',
                component: CardAdd,
                meta: {
                    title: '添加银行卡'
                }
            },
            {
                path: '/bindCardList',
                name: 'bindCardList',
                component: BindCardList,
                meta: {
                    title: '银行账户服务'
                }
            },
            {
                path: '/bindCard',
                name: 'bindCard',
                component: BindCard,
                meta: {
                    title: '银行账户服务'
                }
            },
            {
                path: '/supercardlist',
                name: 'supercardlist',
                component: SuperCardList,
                meta: {
                    title: 'Ⅱ类户'
                }
            },
            {
                path: '/accountadd',
                name: 'accountadd',
                component: AccountAdd,
                meta: {
                    title: '加挂账户'
                }
            },
            {
                path: '/verifycode',
                name: 'verifycode',
                component: VerifyCode,
                meta: {
                    title: '验证'
                }
            },
            {
                path: '/result',
                name: 'result',
                component: Result
            },
            {
                path: '/protocol',
                name: 'protocol',
                component: Protocol,
                meta: {
                    title: '银行卡使用协议'
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

