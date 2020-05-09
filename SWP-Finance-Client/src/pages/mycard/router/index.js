import Vue from 'vue'
import Router from 'vue-router'
import {Page404,Transition,Result} from '../../baseComponents'
import CardList from '../components/cardlist'
import CardAdd from '../components/cardadd'
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
                component: CardList
            },
            {
                path: '/cardadd',
                name: 'cardadd',
                component: CardAdd
            },
            {
                path: '/supercardlist',
                name: 'supercardlist',
                component: SuperCardList
            },
            {
                path: '/accountadd',
                name: 'accountadd',
                component: AccountAdd
            },
            {
                path: '/verifycode',
                name: 'verifycode',
                component: VerifyCode
            },
            {
                path: '/result',
                name: 'result',
                component: Result
            },
            {
                path: '/protocol',
                name: 'protocol',
                component: Protocol
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

