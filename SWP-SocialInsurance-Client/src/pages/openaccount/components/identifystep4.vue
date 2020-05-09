<template>
    <div class="step4">
        <step-header class="step-header" :step="4"></step-header>
        <div class="identify-result">
            <i :class="'status'+status"></i>
            <span>{{statusText}}</span>
            <span class="status-desc" v-if="!!desc">{{desc}}</span> 
        </div>
        <div>
            <SnButton v-if="status==1" type="bottom" @SnButtonClickBottom="nextStep">完成</SnButton>

        </div>
    </div>
</template>
<script>
import { openRouterByValue, getBusinessData, getLocalData, getServerDataH5,deleteLocalData,setBusinessData } from '../../handler/handler'
import StepHeader from './stepheader'
import { SnButton } from 'components'
import common from "sslib/common/common.js";
import { getUrlParams,goBackPage,throttle,initTitleMenu,openPage } from 'sslib/common/extend'
var urlParams = getUrlParams();
var orderNo = urlParams.orderNo;
var h5faceId = urlParams.h5faceId;
var newSignature = urlParams.newSignature;
var UAId = urlParams.UAId;
export default {
    data(){
        return{
            status: 3,
            cardData:{},
            desc:'',
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
            if(!!orderNo){
                _this.cardData = getBusinessData(orderNo);
                if(!_this.cardData){
                    _this.cardData = getLocalData(orderNo);
                    let loginData = getLocalData(_this.cardData.phone);
                    if(!!loginData){
                        setBusinessData(_this.cardData.phone,loginData);
                    }
                }
            }
            let param = {
                UAId:_this.cardData.UAId,
                orderNo:orderNo,
                faceId:h5faceId,
                ticket:'aass',
                phone:_this.cardData.phone,
                profession:_this.cardData.profession,
                imageFontFileId:_this.cardData.imageFontFileId,
                imageBackFileId:_this.cardData.imageBackFileId,
            }
            getServerDataH5(textUrl+'/SSP-HTTP/userTencent.certification',param,'GET').then(result => {
                if(result.code===0){
                    let data = result;
                    _this.status = data.status;
                    deleteLocalData(orderNo);
                    deleteLocalData(_this.cardData.phone);
                    let loginData = getBusinessData(_this.cardData.phone);
                    if(!!loginData&&!loginData.lgParam){
                        loginData.UAId=data.UAId;
                        loginData.token=data.token;
                        loginData.lgParam=data.lgParam;
                        loginData.ssoParam=data.ssoParam;
                        setBusinessData(_this.cardData.phone,loginData);
                    }
                }else{
                    _this.status = 2;
                    if(!!result.desc){
                        _this.desc = result.desc;
                    }
                }
            })
        },
        /**
         * 完成
         */
        nextStep(){
            let _this = this;
            openRouterByValue("finance",{phone:_this.cardData.phone},_this);
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
            .status-desc{
                color: @fc-info;
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
