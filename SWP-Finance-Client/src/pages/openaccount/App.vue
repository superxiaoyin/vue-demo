<template>
    <router-view/>
</template>

<script>
    import 'components/style/common.less'
    export default {
        name: 'identfication',
    }
</script>
<style lang="less">
    @import '~components/style/variables.less';
    html{
        font-size: 10000/750vw;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
    }
    body{
        width: 100%;
        /*overflow: hidden;*/
    }
    .vux-x-dialog{
        .weui-mask{
            background: #fff;
        }
        .weui-dialog{
            width: 60vh;
            overflow: unset;
            max-width: 100vh!important;
            //top: 30vh!important;
            left: -1vh!important;;
        }
    }
    .weui-cells_radio .weui-check:checked + .weui-icon-checked:before{
        color: @color-blue;

    }
    .debitSelect{
        .vux-popup-header-left{
            width: .3rem;
           // background: url('../../../resource/img/icon_close2.png') no-repeat right;
            background-size:.38rem .38rem;
        }
    }
</style>
