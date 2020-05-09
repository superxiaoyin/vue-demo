import Vue from 'vue'
import Router from 'vue-router'
import {Page404,Transition,Result} from '../../baseComponents'
import AccountList from '../components/accountlist'
import AccountDetail from '../components/accountdetail'
import Operate from '../components/operate'
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
                component: AccountList
            },
            {
                path: '/accountdetail',
                name: 'accountdetail',
                component: AccountDetail
            },
            {
                path: '/operate',
                name: 'operate',
                component: Operate
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

