<template>
    <router-view v-wechat-title="$route.meta.title"></router-view>
</template>

<script>
    export default {
        name: 'app',
    }
</script>
<style lang="less">
    html{
        font-size: 10000/750vw;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
    }
    body{
        width: 100%;
        /*overflow: hidden;*/
    }
    .weui-dialog__btn_primary{
        color: #E8422E!important;
    }
</style>
