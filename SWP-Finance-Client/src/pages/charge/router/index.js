import Vue from 'vue'
import Router from 'vue-router'
import {Page404,Transition,Result} from '../../baseComponents'
import Search from '../components/search'
import Prestore from '../components/prestore'
import SettleMonth from '../components/settlemonth'
import History from '../components/history'
import Record from '../components/record'
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
                path: '',
                name: 'search',
                component: Search
            },
            {
                path: '/prestore',
                name: 'prestore',
                component: Prestore
            },
            {
                path: '/settlemonth',
                name: 'settlemonth',
                component: SettleMonth
            },
            {
                path: '/history',
                name: 'history',
                component: History
            },
            {
                path: '/result',
                name: 'result',
                component: Result
            },
            {
                path: '/record',
                name: 'record',
                component: Record
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

