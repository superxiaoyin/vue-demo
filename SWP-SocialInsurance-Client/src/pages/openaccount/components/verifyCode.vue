<template>
    <div class="verify-code">
        <div class="verify-title">{{`验证码已发送至：${mPhone}`}}</div>
        <SnVerifyCode
            ref="verifyCode"
            title="验证码"
            :maxlength="6"
            text-align="left"
            :phone-num="mPhone"
            @getending="getendingfun"
            v-model="vCode"
            placeholder="请输入验证码"
        ></SnVerifyCode>            
        <SnButton v-if="agree" :showLoading="loadingFlag" @SnButtonClick="submitBind">确定</SnButton>
        <SnButton v-else-if="!agree" class="btn-grey">确定</SnButton>
    </div>
</template>
<script>
import { openRouterByValue,backRouterByValue, getServerData,cardError,setBusinessData,setLocalData,getServerDataH5 } from '../../handler/handler'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { throttle, initTitleMenu, showToast,getUrlParams,GUID } from 'sslib/common/extend'
import common from "sslib/common/common.js";
import { antiFraudCheck } from 'sslib/common/antiFraudCheck'
import { SnVerifyCode } from 'biscomponents'
import { SnButton } from 'components'
var urlParams = getUrlParams();
var phone = urlParams.phone;
export default {
    data(){
        return{
            cardData: {}, //一类户数据
            superCardData: {}, //二类户数据
            loadingFlag: false,
            agree: true,
            vCode: '',
            mPhone:'',
            tokenKey:'',
            extParams:{},
        }
    },
    components:{
        SnVerifyCode,SnButton
    },
    created(){
        let _this = this;
        // initTitleMenu(['验证']);
        _this.mPhone = phone;
        // _this.init();
    },
    mounted(){
        let _this = this;
        // _this.getPosition();
        _this.getParam().then(result=>{
            _this.extParams = result;
            _this.extParams.ip = returnCitySN['cip'];
            let seqGUID = new Common.GUID();
            _this.tokenKey = seqGUID.newGUID1();
            antiFraudCheck(_this.tokenKey,_this.extParams);
        })
    },
    methods:{
        /**
         * 数据初始化
         */
        init(){
            let _this = this;
        },
        getParam(){
            let _this = this;
            return new Promise(function (res, rej) { 
                let extParams = {};
                if(navigator){
                    extParams.platform = navigator.platform;
                    if(navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            function (position) {  
                                extParams.longitude = position.coords.longitude;
                                extParams.latitude = position.coords.latitude;
                            },
                        ) 
                    }
                    res(extParams);
                }
            })
        },
        getPosition(){
            let _this = this;
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {  
                        console.log( position.coords.longitude );
                        console.log( position.coords.latitude );
                    },
                ) 
            }
        },
        /**
         * 提交绑定
         */
        submitBind(){
            let _this = this;
            if(!_this.vCode&&_this.vCode.length !== 6){
                showToast('请输入正确的验证码');
                return;
            }
            let param = {
                phone:_this.mPhone,
                verifyCode:_this.vCode,
                IMEI:'lkadjsfojasdfj'
            }
            getServerDataH5(textUrl+'/SSP-HTTP/user.verifyH5Code',param,'GET').then(result => {
                if(result.code === 0){
                    let data = result;
                    // if(!!data.verifyStatus){
                    //     if(!!data.isLogin){
                    //         let tmpData = {
                    //             UAId:data.UAId,
                    //             token:data.Token,
                    //             lgParam:data.lgParam,
                    //             ssoParam:data.ssoParam
                    //         }
                    //         setBusinessData(_this.mPhone,tmpData);
                    //     }
                    //     // window.open(`finance.html?phone=`+_this.mPhone);
                    //     window.location.href='finance.html?phone='+_this.mPhone;
                    // } else {
                    //     showToast('验证码验证失败');
                    // }
                    if(!!data.isLogin){
                        let tmpData = {
                            UAId:data.UAId,
                            token:data.token,
                            lgParam:data.lgParam,
                            ssoParam:data.ssoParam,
                            tokenKey:_this.tokenKey,
                            platform:_this.extParams.platform,
                        }
                        setBusinessData(_this.mPhone,tmpData);
                        // window.location.href='finance.html?phone='+_this.mPhone;
                        // window.open(`finance.html?phone=`+_this.mPhone);
                        // window.open(`openaccount.html#/finance?phone=`+_this.mPhone);
                        openRouterByValue("finance",{phone:_this.mPhone},_this);
                    } else {
                        if(!!data.verifyStatus){
                            let tmpData = {
                                tokenKey:_this.tokenKey,
                                platform:_this.extParams.platform,
                            }
                            setBusinessData(_this.mPhone,tmpData);
                            openRouterByValue("finance",{phone:_this.mPhone},_this);
                        } else {
                            showToast('验证码验证失败');
                        }
                    }                        
                } else {
                    showToast(result.desc||'验证码验证失败');
                }
            });
            // Common.AjaxFun('GET',textUrl+'/SSP-HTTP/user.verifyH5Code', param, function (result) {
            //     if (!!result.success) {
            //         let data = result.result;
            //         // if(!!data.verifyStatus){
            //         //     if(!!data.isLogin){
            //         //         let tmpData = {
            //         //             UAId:data.UAId,
            //         //             token:data.Token,
            //         //             lgParam:data.lgParam,
            //         //             ssoParam:data.ssoParam
            //         //         }
            //         //         setBusinessData(_this.mPhone,tmpData);
            //         //     }
            //         //     // window.open(`finance.html?phone=`+_this.mPhone);
            //         //     window.location.href='finance.html?phone='+_this.mPhone;
            //         // } else {
            //         //     showToast('验证码验证失败');
            //         // }
            //         if(!!data.isLogin){
            //             let tmpData = {
            //                 UAId:data.UAId,
            //                 token:data.token,
            //                 lgParam:data.lgParam,
            //                 ssoParam:data.ssoParam
            //             }
            //             loginInfo = data;
            //             setLocalData(_this.mPhone,tmpData);
            //             // window.location.href='finance.html?phone='+_this.mPhone;
            //             // window.open(`finance.html?phone=`+_this.mPhone);
            //             // window.open(`openaccount.html#/finance?phone=`+_this.mPhone);
            //             openRouterByValue("finance",{mPhone:_this.mPhone},_this);
            //         } else {
            //             if(!!data.verifyStatus){
            //                 window.open(`finance.html?phone=`+_this.mPhone);
            //             } else {
            //                 showToast('验证码验证失败');
            //             }
            //         }
            //     } else {
            //         showToast('验证码验证失败');
            //     }
            // })
        },
        /**
         * 获取验证码
         */
        getendingfun(data) {
            let _this = this;
            if (data) {
                let param = {
                    userPhone:_this.mPhone,
                    vType:12
                }
                getServerDataH5(textUrl+'/SSP-HTTP/user.getVerifyCode',param,'GET').then(result => {
                    if (result.code===0) {
                        _this.verifyCodeFlag = true;
                    }
                })
            }
        },
    }
}
</script>
<style lang="less">
    @import '~components/style/common.less';
    .verify-code{
        background: @color-bg;
        .verify-title{
            color: @fc-info;
            font-size: @fs-mob-small;
            padding: .3rem .3rem .15rem .3rem;
        }
        .agreement {
            display: flex;
            align-items: center;
            margin: 0.3rem;
            font-size: @fs-mob-smaller;
            .agree_pre{
                background: url('../../../resource/img/icon_agree_pre.png') no-repeat center;
            }
            .agree_nor{
                background: url('../../../resource/img/icon_agree_nor.png') no-repeat center;
            }
            .agree_pre,.agree_nor{
                display: inline-block;
                width: .24rem;
                height: .24rem;
                background-size: .24rem .24rem;
            }
            .agree-text{
                margin-left: 0.15rem;
                color: @fc-info;
            }
            a {
                color: #3891FF;
            }
        }
        .btn-grey button{
            background-color: @color-disable;
            &:hover{
                background-color: @color-disable;
            }
        }

        .snVerifyCode{
            background: @color-white;
            .button-detail{
                background: none !important;
                border-radius: .3rem !important;
                border: 1px solid @color-blue;
                color: @color-blue !important;                
            }

        }
    }
</style>
