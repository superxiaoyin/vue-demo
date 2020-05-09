import Vue from 'vue'
import Router from 'vue-router'
import {Page404,Transition,Result} from '../../baseComponents'
import Open from '../components/open'
import Password from '../components/password'
import IdentifyStep1 from '../components/identifystep1'
import IdentifyStep2 from '../components/identifystep2'
import IdentifyStep3 from '../components/identifystep3'
import IdentifyStep4 from '../components/identifystep4'
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
                path: '/open',
                name: 'open',
                component: Open
            },
            {
                path: '/password',
                name: 'password',
                component: Password
            },
            {
                path: '/result',
                name: 'result',
                component: Result
            },
            {
                path: '/identifystep1',
                name: 'identifystep1',
                component: IdentifyStep1,
            },
            {
                path: '/identifystep2',
                name: 'identifystep2',
                component: IdentifyStep2,
            },
            {
                path: '/identifystep3',
                name: 'identifystep3',
                component: IdentifyStep3,
            },
            {
                path: '/identifystep4',
                name: 'identifystep4',
                component: IdentifyStep4,
            },
            {
                path: '/protocol',
                name: 'protocol',
                component: Protocol,
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

