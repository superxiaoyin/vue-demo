<template>
    <div class="finance-wrapper">
        <sn-button @SnButtonClick="test">测试</sn-button>
        <sn-button @SnButtonClick="download">下载</sn-button>
    </div>
</template>
<script>
import { SnButton } from 'components'
import { registerHandler, notifyAppBackEvent, OpenThirdPartMapFunction } from 'sslib/common/SnJsBridge'
import { throttle, openPage, showConfirm, showToast, getUrlParams, goBackPage } from 'sslib/common/extend'
export default {
    data(){
        return{
        }
    },
    components:{
        SnButton
    },
    created(){
        let _this = this;
        _this.init();
    },
    methods:{
        /**
         * 数据初始化
         */
        init(){
            let _this = this;
            notifyAppBackEvent(); //调用app，通知返回事件
            registerHandler('notifyAppBack', function (data) {//点击app返回事件
                throttle(function () {
                    goBackPage('sswbv_close_browser');
                }.bind(this));
            })
        },
        test(){
            let _this = this;
            OpenThirdPartMapFunction({destinationLocation:{latitude :30.596601871099754,longitude:114.30524999999997}}).then(data=>{

            })
        },
        download(){
            openPage("https://10.0.4.97:12443/download/download.html");
        }

    }
}
</script>
<style lang="less">
    @import '~components/style/common.less';
    .finance-wrapper{
        background: @color-white;
    }
</style>
