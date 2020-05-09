import Vue from 'vue'
import Router from 'vue-router'
import {Page404, Transition} from '../../baseComponents'

Router.prototype.goBack = function () {
    this.isBack = true
    window.history.go(-1)
}

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/add'
        },
        {
        path: '/',
        component: Transition,
        children: [
            {
                path: '/add',
                name: 'add',
                component: resolve=>(require(["../components/add"], resolve)),
                meta: { title: '银行账户服务'}
            },
            {
                path: '/addInfo',
                name: 'addInfo',
                component: resolve=>(require(["../components/addInfo"], resolve)),
                meta: { title: '银行账户服务'}
            },
            {
                path: '/protocol',
                name: 'protocol',
                component: resolve=>(require(["../components/protocol"], resolve)),
                meta: { title: '银行账户服务'}
            },
            {
                path: '/account',
                name: 'account',
                component: resolve=>(require(["../components/account"], resolve)),
                children:[
                    {
                        path: '/info',
                        name: 'info',
                        component: resolve=>(require(["../components/info"], resolve)),
                    },
                    {
                        path: '/list',
                        name: 'list',
                        component: resolve=>(require(["../components/list"], resolve)),
                    },
                    {
                        path: '/record',
                        name: 'record',
                        component: resolve=>(require(["../components/record"], resolve)),
                    },
                ]
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

