<template>
    <div class="step3">
        <step-header v-if="!identifyState" class="step-header" :step="3"></step-header>
        <div class="face-identify" @click="faceIdentify">
            <div class="face">
                <i class="face-icon"></i>
                <span>人脸采集</span>                
            </div>
            <div class="identify">
                <span class="identify-title" :class="{'success':collectState}">{{collectState?"已采集":"未采集"}}</span>
                <i class="right-icon"></i>             
            </div>
        </div>
        <!-- <SnButton type="bottom" :showLoading="loadingFlag" @SnButtonClickBottom="nextStep">下一步</SnButton> -->
    </div>
</template>
<script>
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { openRouterByValue,openNativePage,getBusinessData, setBusinessData, getServerData, setLocalData, getServerDataH5 } from '../../handler/handler'
import StepHeader from './stepheader'
import { SnButton } from 'components'
import { sendPost } from "sslib/common/HttpProtocol.js"
import common from "sslib/common/common.js";
import { getUrlParams, initTitleMenu, openPage, showToast, goBackPage, throttle } from 'sslib/common/extend'
var urlParams = getUrlParams();
var identify = Number(urlParams.identify || 0);
var name = urlParams.name || "";
var orderNo = urlParams.orderNo;
export default {
    data(){
        return{
            orderNo:'',
            cardData:{},
            identifyState: identify,
            collectState: 0,
            livePhoto: '',
            loadingFlag: false
        }
    },
    components:{
        StepHeader,SnButton
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
            // notifyAppBackEvent(); //调用app，通知返回事件
            // registerHandler('notifyAppBack', function (data) {//点击app返回事件
            //     throttle(function () {
            //         goBackPage('sswbv_close_browser');                   
            //     }.bind(this));
            // });
            // if(_this.identifyState){
            //     initTitleMenu(['2类开户']);
            // }
        },
        /**
         * 活体检测
         */
        async faceIdentify(){
            let _this = this;
            try {
                // const faceData = await openNativePage("IntentAction_TfdIdentify",[{key:"ocr_live",value:"1",type:"string"},{key:"action_count",value:"3",type:"string"}],[{type:"string", value: "", key: "live_info"}]); 
                // if(!!faceData[0].value){
                //     _this.collectState = 1;
                //     _this.livePath = JSON.parse(faceData[0].value).photoPath;
                //     setBusinessData("livePath",_this.livePath);
                // }
                if(!!_this.$route.query.orderNo){
                    _this.orderNo = decodeURIComponent(_this.$route.query.orderNo);
                    _this.cardData = getBusinessData(_this.orderNo);
                    _this.identifyState = _this.$route.query.identify;
                } else if (!!orderNo){
                    _this.orderNo = orderNo;
                    _this.cardData = getBusinessData(orderNo);
                }
                let param = {
                    faceId:_this.cardData.faceId,
                    UAId:_this.cardData.UAId,
                    orderNo:_this.cardData.orderNo,
                }
                //获取nonce ticket
                getServerDataH5(textUrl+'/yqt/certification/certificateTencent.getTicket',param,'GET').then(result => {
                    if(result.code===0){
                        let data = result;
                        let responseUrl = window.location.protocol+"//"+window.location.host;
                        setLocalData(_this.orderNo,_this.cardData);
                        let loginData = getBusinessData(_this.cardData.phone);
                        if(!!loginData){
                            setLocalData(_this.cardData.phone,loginData);
                        }
                        if(_this.identifyState){
                            responseUrl += '/static/openAccount/pages/openaccount.html#/open';
                            // responseUrl += '/openaccount.html#/open';
                        }else{
                            responseUrl += '/static/openAccount/pages/openaccount.html#/identifystep4';
                            // responseUrl += '/openaccount.html#/identifystep4';
                        }
                        let loginParam = {
                            webankAppId:'TIDAlbnL',
                            version:'1.0.0',
                            nonce:data.nonce,
                            orderNo:_this.orderNo,
                            h5faceId:_this.cardData.faceId,
                            url:encodeURIComponent(responseUrl),
                            resultType:'1',
                            userId:_this.cardData.UAId,
                            sign:data.sign,
                            from:'browser'
                        }
                        let locationUrl ='https://ida.webank.com/api/web/login?'
                        for(var key in loginParam){
                            locationUrl += key + '=' + loginParam[key] + '&';
                        }
                        window.location.href=locationUrl;
                        // $.ajax({
                        //     type: 'GET',
                        //     //cache: false,
                        //     url: 'https://ida.webank.com/api/web/login',
                        //     data: loginParam,
                        //     contentType: 'application/x-www-form-urlencoded',
                        //     async:false,
                        //     success: function(data) {
                        //         var dataJson = JSON.parse(data);
                        //         if(dataJson.success) {
                        //             mstpAddress = dataJson.result.paramValue;
                        //         }
                        //     },
                        //     error: function(data) {
                        //         console.log('未获取到MSTP配置');
                        //     }
                        // });
                    }else{
                        showToast(result.desc);
                    }
                })
                
            } catch (error) {
                console.log(error);
            }
        },

        
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .step3{
        background: @color-bg;
        padding: .3rem 0;
        .step-header{
            margin: 0 .3rem .3rem .3rem;
        }
        .face-identify{
            background: @color-white;
            padding: .9rem .45rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .face{
                display: inline-flex;
                align-items: center;
                .face-icon{
                    display: inline-block;
                    width: 1.04rem;
                    height: 1.04rem;
                    background: url('../../../resource/img/openaccount/icon_face.png') no-repeat center;
                    background-size: 1.04rem 1.04rem;
                    margin-right: .3rem;
                }                
            }
            .identify{
                display: inline-flex;
                align-items: center;
                .identify-title{
                    color: @fc-info;
                    font-size: @fs-mob-small;
                }
                .success{
                    color: #20BD2A;
                }
                .right-icon{
                    display: inline-block;
                    height: .44rem;
                    width: .44rem;
                    background: url('../../../resource/img/icon_narrow_right.png') no-repeat center;
                    background-size: .44rem .44rem;
                }
            }

        }
    }
</style>
