<template>
    <router-view v-wechat-title="$route.meta.title"></router-view>
</template>

<script>
    import 'components/style/common.less'
    export default {
        name: 'ticketshop',
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
    .weui-cell:before {
        display: block !important;
        border: none !important;
    }
    .weui-cell{
        border-bottom: 1px solid @color-bg;
        .weui-cell__ft{
            color: #c2c2c2 !important
        }
    }
    .inline-calendar td.is-today{
        color:  @color-luzhou;
    }
    .inline-calendar td.current {
        span.vux-calendar-each-date{
            background-color: @color-luzhou
        }
    }
    .vux-prev-icon, .vux-next-icon{
        border: 1px solid @color-luzhou;
    }
    .vux-prev-icon{
        border-top: none;
        border-right: none;
    }
    .vux-next-icon{
        border-top: none;
        border-right: none;
        transform: rotate(-135deg);
    }
    .vux-cell-placeholder{
        color: #c2c2c2 !important
    }
    .weui-cells::before,.vux-calendar:before{
        border-top: 0;
    }
    .vux-cell-value{
        color: #333
    }
    .vux-number-round .vux-number-selector-sub, .vux-number-round .vux-number-selector-plus{
        padding: 0;
        border:1px solid  @color-luzhou;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 30px;
    }
    .vux-number-selector svg{
        fill: @color-luzhou;
    }
    .vux-number-selector-plus{
        padding: 0;
    }
    .vux-number-round .vux-number-input{
        border:1px solid #f1f1f1 !important;
        margin: 0 4px;
        border-radius: 20px;
        font-size: .2rem;
        height: 30px;
        color: #333;
    }
    .weui-cells_checkbox .weui-check:checked + .vux-checklist-icon-checked:before{
        color: @color-luzhou
    }

    .sn-cell{
        border-bottom: 1px solid @color-bg;
        padding: .24rem .3rem !important;
    }
    .sn-cell:before{
        border: none !important;
    }
    .form_line_input {
        display: inline-block;
        text-align: right;
        border: none;
        background: none;
        flex:1
    }
    .cursor {
        position: absolute;
        margin-top: -3px;
        margin-left: 0px;
        width: 2px;
        height: 24px;
        display: none;
        z-index: 1000;
    }
    .weui-icon-success{color:  @color-luzhou !important}

    .vux-popup-mask{display: block !important}
    .sn-button{
        padding: 0 !important;
    }
    .sn-button button{
        background-color: transparent !important;
    }
    @media screen and (width: 375px) and (height: 812px){
        .button-on {
            padding-bottom: 34px;
        }
    }
</style>
