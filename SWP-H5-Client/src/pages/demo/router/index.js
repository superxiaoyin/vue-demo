import Vue from 'vue'
import Router from 'vue-router'
import Transition from '../components/transition';

import Page404 from '../components/404';
import Empty from '../components/empty';
import Btn from '../components/btn';
import Toast from '../components/toast';
import Panel from '../components/panel';
import Loading from '../components/Loading';
import Input from '../components/input';
import Radio from '../components/radio';
import Tap from '../components/tap';
import List from '../components/list';
import Calendar from '../components/calendar';
import RangePicker from '../components/rangePicker';
import SnModal from '../components/SnModal';
import Code from '../components/code';
import ActionSheet from '../components/actionSheet';
import SnCell from '../components/sncell';

let Home = r => require.ensure([], () => r(require('../components/home')));

Router.prototype.goBack = function () {
    this.isBack = true
    window.history.go(-1)
}

Vue.use(Router)

const router = new Router({
    //mode: 'history',
    routes: [{
        path: '/',
        component: Transition,
        children: [{
                path: '',
                name: 'home',
                component: Home
            },
            {
                path: '/empty',
                name: 'empty',
                component: Empty
            },
            {
                path: '/btn',
                name: 'btn',
                component: Btn
            },
            {
                path: '/toast',
                name: 'toast',
                component: Toast
            },
            {
                path: '/panel',
                name: 'panel',
                component: Panel
            },
            {
                path: '/loading',
                name: 'loading',
                component: Loading
            },
            {
                path: '/input',
                name: 'input',
                component: Input
            },
            {
                path: '/radio',
                name: 'radio',
                component: Radio
            },
            {
                path: '/tap',
                name: 'tap',
                component: Tap
            },
            {
                path: '/list',
                name: 'list',
                component: List
            },
            {
                path: '/calendar',
                name: 'calendar',
                component: Calendar
            },
            {
              path: '/rangePicker',
              name: 'rangePicker',
              component: RangePicker
            },
            {
                path: '/SnModal',
                name: 'SnModal',
                component: SnModal
            },
            {
                path: '/code',
                name: 'code',
                component: Code
            },
            {
                path: '/actionsheet',
                name: 'actionsheet',
                component: ActionSheet
            },
            {
                path: '/sncell',
                name: 'sncell',
                component: SnCell
            },
            {
                path: '*',
                component: Page404,
            }
        ]
    }],
    scrollBehavior(to, from, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    }
});
export default router