import Vue from 'vue'
import Router from 'vue-router'
import {Page404, Transition} from '../../baseComponents'
import PageOne from '../components/pageOne'
import PageTwo from '../components/pageTwo'
import PageThree from '../components/pageThree'
import Index from '../components/index'


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
                path: '/index',
                name: 'index',
                component: Index,
                meta: {
                    title: '主页 '
                }
            }, 
            {
                path: '/pageOne',
                name: 'pageOne',
                component: PageOne,
                meta: {
                    title: '理财'
                }
            },
            {
                path: '/pageTwo',
                name: 'pageTwo',
                component: PageTwo,
                meta: {
                    title: '购票'
                }
            }, 
            {
                path: '/pageThree',
                name: 'pageThree',
                component: PageThree,
                meta: {
                    title: '保险'
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

