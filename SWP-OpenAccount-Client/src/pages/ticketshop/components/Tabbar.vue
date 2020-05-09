<template>
    <div>
        <div v-transfer-dom>
            <tabbar style="position: fixed;">
                <tabbar-item :selected="$route.path == '/'" link='/'>
                    <img slot="icon" src="../../../resource/img/shop/home@2x.png">
                    <img slot="icon-active" src="../../../resource/img/shop/home_a@2x.png">
                    <span slot="label">门票</span>
                </tabbar-item>
                <tabbar-item :selected="$route.path == '/myticket'" link="/myticket">
                    <img slot="icon" src="../../../resource/img/shop/my@2x.png">
                    <img slot="icon-active" src="../../../resource/img/shop/my_a@2x.png">
                    <span slot="label">我的票</span>
                </tabbar-item>
                <tabbar-item :selected="$route.path == '/orderlist'" link="/orderlist">
                    <img slot="icon" src="../../../resource/img/shop/order@2x.png">
                    <img slot="icon-active" src="../../../resource/img/shop/order_a@2x.png">
                    <span slot="label">交易记录</span>
                </tabbar-item>
            </tabbar>
        </div>
    </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux'
export default {
    components: {
        Tabbar,
        TabbarItem
    }
}
</script>

<style lang="less">
.weui-tabbar{
    background-color:#fff !important;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    box-shadow:0px -2px 8px 0px rgba(0,0,0,0.06) !important;
}
.weui-tabbar::before{border-top: 0 !important}
.weui-bar__item_on .weui-tabbar__label{color: #333 !important}
</style>