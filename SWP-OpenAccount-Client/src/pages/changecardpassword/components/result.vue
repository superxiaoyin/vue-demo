<template>
    <div class="step4">
        <div class="identify-result">
            <i :class="'status'+status"></i>
            <span>{{statusText}}</span>
            <!-- <span class="status-desc" v-if="!!desc">{{desc}}</span>  -->
      
            <SnButton v-if="status==1" type="bottom" @SnButtonClickBottom="nextStep">完成</SnButton>
      
        </div>
        
    </div>
</template>
<script>
import { openRouterByValue, backRouterByValue, getBusinessData, getLocalData, getServerDataH5,deleteLocalData,setBusinessData } from '../../handler/handler'
import { SnButton } from 'components'
import common from "sslib/common/common.js";
import { getUrlParams,goBackPage,throttle,initTitleMenu,openPage } from 'sslib/common/extend'
var urlParams = getUrlParams();
var orderNo = urlParams.orderNo;
export default {
    data(){
        return{
            status:1,
            cardData:{},
            desc:'',
        }
    },
    created(){
        let _this = this;
        _this.status =getBusinessData('statuc');
        let idNo = getLocalData(orderNo).idcard
        setLocalData(orderNo,'')
        setLocalData(idNo,'')
        
        // _this.init();
    },
    computed:{
        statusText(){
            let text = "";
            if(this.status == 1){
                text = "修改密码成功"
            }else{
                text = "修改密码失败"
            }
            return text
        }
    },
    components:{
        SnButton
    },
    methods:{
        /**
         * 数据初始化
         */
        init(){
          
        },
        /**
         * 完成
         */
        nextStep(){
            let _this = this;
            backRouterByValue('query','',_this)
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
            position: relative;
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
            .status-desc{
                color: @fc-info;
            }
            .sn-button-bottom{position: absolute;bottom: -1.3rem;padding: 0;}
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
