<template>
    <div class="step4">
        <step-header class="step-header" :step="4"></step-header>
        <div class="identify-result">
            <i :class="'status'+status"></i>
            <span>{{statusText}}</span>
        </div>
        <div>
            <SnButton type="bottom" @SnButtonClickBottom="nextStep">完成</SnButton>
            <div v-if="status==1">
                <a class="sn-pointer" @click="nextStep3">点击此处，去开通Ⅱ类户</a>
            </div>
        </div>
    </div>
</template>
<script>
import { openRouterByValue } from '../../handler/handler'
import StepHeader from './stepheader'
import { SnButton } from 'components'
import { goBackPage,throttle,initTitleMenu,openPage } from 'sslib/common/extend'
export default {
    data(){
        return{
            status: 0
        }
    },
    created(){
        let _this = this;
        _this.init();
    },
    computed:{
        statusText(){
            let text = "";
            if(this.status === 1){
                text = "认证成功"
            }else if(this.status === 2){
                text = "认证失败"
            }else if(this.status === 3){
                text = "认证中"
            }
            return text
        }
    },
    components:{
        StepHeader,SnButton
    },
    methods:{
        /**
         * 数据初始化
         */
        init(){
            let _this = this;
            if(!!_this.$route.query.status){
                _this.status = _this.$route.query.status;
            }
        },
        /**
         * 完成
         */
        nextStep(){
            let _this = this;
            goBackPage('sswbv_close_browser');
        },
        /**
         * 后续操作
         */
        nextStep3(){
            let _this = this;
            openPage(`openaccount.html#/identifystep3?identify=1`);
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .step4{
        background: @color-bg;
        padding: .3rem 0;
        .step-header{
            margin: 0 .3rem .3rem .3rem;
        }
        .identify-result{
            background: @color-white;
            padding: .6rem 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .status1{
                background: url('../../../resource/img/icon_success_big.png') no-repeat center;
            }
            .status2{
                background: url('../../../resource/img/icon_failed_big.png') no-repeat center;
            }
            .status3{
                background: url('../../../resource/img/icon_wait_big.png') no-repeat center;
            }
            .status1,.status2,.status3{
                display: block;
                width: 1.04rem;
                height: 1.04rem;
                background-size: 1.04rem 1.04rem;
                margin-bottom: .15rem;
            }
        }
        .sn-pointer{
            position: absolute;
            bottom: 20%;
            left: 26%;
            text-decoration: underline;
            color: #E8422E;
        }
    }
</style>
