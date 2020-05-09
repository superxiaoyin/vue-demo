<template>
    <div class="verify-code">
        <SnTel
            title="手机号"
            :maxlength="11"
            text-align="left"
            v-model="mPhone"
            placeholder="请输入手机号"
        ></SnTel>
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
import { SnVerifyCode,SnTel } from 'biscomponents'
import { SnButton } from 'components'
var urlParams = getUrlParams();
var phone = urlParams.phone;
var listType = urlParams.listType;

export default {
    data(){
        return{
            cardData: {}, //Ⅰ类户数据
            superCardData: {}, //Ⅱ类户数据
            loadingFlag: false,
            agree: true,
            vCode: '',
            mPhone:'',
            tokenKey:'',
            extParams:{},
            map:null,
            geolocation:'',
        }
    },
    components:{
        SnVerifyCode,SnButton,SnTel
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
        _this.init();
    },
    methods:{
        /**
         * 数据初始化
         */
        init(){
            let _this = this;
            // _this.clickMap();
            _this.initAmap();
        },
        //初始化高德地图
        initAmap(){
            let _this = this;
            //加载地图，调用浏览器定位服务
            _this.map = new AMap.Map('container', {
                resizeEnable: true
            });
            _this.map.plugin('AMap.Geolocation', function() {
                _this.geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true, //是否使用高精度定位，默认:true
                    timeout: 10000, //超过10秒后停止定位，默认：无穷大
                    buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    buttonPosition: 'RB'
                });
                _this.map.addControl(_this.geolocation);
                _this.geolocation.getCurrentPosition();
                AMap.event.addListener(_this.geolocation, 'complete', _this.onComplete); //返回定位信息
                AMap.event.addListener(_this.geolocation, 'error', _this.onError); //返回定位出错信息
            });
        },
        //解析定位结果
        onComplete(data) {
            let _this = this;
            _this.getParam().then(result=>{
                _this.extParams = result;
                _this.extParams.ip = returnCitySN['cip'];
                _this.extParams.longitude = data.position.getLng();
                _this.extParams.latitude = data.position.getLat();
                let seqGUID = new Common.GUID();
                _this.tokenKey = seqGUID.newGUID1();
                antiFraudCheck(_this.tokenKey,_this.extParams);
            })
        },

        //解析定位错误信息
        onError(data) {
            let _this = this;
            // showToast('无法定位');
            _this.getParam().then(result=>{
                _this.extParams = result;
                _this.extParams.ip = returnCitySN['cip'];
                let seqGUID = new Common.GUID();
                _this.tokenKey = seqGUID.newGUID1();
                antiFraudCheck(_this.tokenKey,_this.extParams);
            })
        },

        getParam(){
            let _this = this;
            return new Promise(function (res, rej) { 
                let extParams = {};
                if(navigator){
                    extParams.platform = navigator.platform;
                    // mapObj = new AMap.Map('iCenter');
                    // mapObj.plugin('AMap.Geolocation', function () {
                    //     geolocation = new AMap.Geolocation({
                    //         enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    //         timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                    //         maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                    //         convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    //         showButton: true,        //显示定位按钮，默认：true
                    //         buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                    //         buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    //         showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                    //         showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                    //         panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                    //         zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    //     });
                    //     mapObj.addControl(geolocation);
                    //     geolocation.getCurrentPosition();
                    //     AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
                    //     AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
                    // });

                    // if(navigator.geolocation) {
                    //     navigator.geolocation.getCurrentPosition(
                    //         function (position) {  
                    //             extParams.longitude = position.coords.longitude;
                    //             extParams.latitude = position.coords.latitude;
                    //         },
                    //     ) 
                    // }
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
            let reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
            if(!_this.mPhone){
                showToast('请输入手机号');
                return;
            }
            if (!reg.test(_this.mPhone)) {
                showToast('请输入正确手机号');
                return false;
            }
            if(!_this.vCode&&_this.vCode.length !== 6){
                showToast('请输入正确的验证码');
                return;
            }

            let param = {
                phone:_this.mPhone,
                verifyCode:_this.vCode,
                IMEI:'lkadjsfojasdfj'
            }
            // getServerDataH5(textUrl+'/SSP-HTTP/user.verifyH5Code',param,'GET').then(result => {
            getServerDataH5(textUrl+'/SSP-HTTP/user.loginByCodeForH5',param,'GET').then(result => {
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
                           setBusinessData("phone", _this.mPhone);
                        window.location.href='home.html#/index?phone='+_this.mPhone;
                        // window.location.href='home.html#/index?phone='+_this.mPhone;
                        // window.open(`finance.html?phone=`+_this.mPhone);
                        // window.open(`openaccount.html#/finance?phone=`+_this.mPhone);
                        openRouterByValue("finance",{phone:_this.mPhone,listType:listType},_this);
                    } else {
                        if(!!data.verifyStatus){
                            let tmpData = {
                                tokenKey:_this.tokenKey,
                                platform:_this.extParams.platform,
                            }
                            setBusinessData(_this.mPhone,tmpData);
                            // window.location.href='home.html#/index?phone='+_this.mPhone;
                            openRouterByValue("finance",{phone:_this.mPhone,listType:listType},_this);
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
        background: @color-white;
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
            .button-detail{
                background: none !important;
                border-radius: .3rem !important;
                border: 1px solid @color-blue;
                color: @color-blue !important;                
            }

        }
    }
</style>
