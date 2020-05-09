<template>
    <div>
        <div class="form">
            <div class="swripe">
                <div class="content">
                    <div class="contentLine">
                        <SnInput
                            title="银行卡号"
                            text-align="left"
                            v-model="content.cardNumber"
                            maxlength="19"
                            @blur="getPhone"
                            @focus="editCardNumber"
                            placeholder="请输入银行卡号"
                            :disabled="getNumStataus"
                        ></SnInput>
                    </div>
                </div>
                <div class="borderTip"></div>
                <div class="content">
                    <div class="contentLine">
                        <SnInput
                            title="手机号"
                            maxlength="11"
                            text-align="left"
                            v-model="content.phone"
                            placeholder="请输入银行预留手机号"
                            :disabled="getPhoneStataus"
                        ></SnInput>
                        <SnVerifyCode
                            title="验证码"
                            :maxlength="6"
                            text-align="left"
                            :phone-num="content.phone"
                            @getending="getendingfun"
                            v-model="content.verifyCode"
                            placeholder="请输入验证码"
                        ></SnVerifyCode>
                    </div>
                </div>
            </div>
            <!-- <div class="agreement">
                <i :class="agree?'agree_pre':'agree_nor'" @click="agree=!agree"></i>
                <span class="agree-text">同意</span>
                <a class="sn-pointer" @click="openProtocol">《开通2类账户协议》</a>
            </div> -->
            <SnButton :showLoading="loadingFlag" @SnButtonClick="nextStep">下一步</SnButton>
        </div>
        
    </div>
</template>

<script>
import {openRouterByValue,backRouterByValue, getServerData, getBusinessData,setBusinessData, getServerDataH5,setLocalData} from '../../handler/handler'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { throttle, goBackPage, initTitleMenu, openPage, showConfirm, showToast } from 'sslib/common/extend'
import { SnVerifyCode } from 'biscomponents'
import { SnButton,SnInput } from 'components'

export default {
    name:'query',
    components: {
        SnButton,
        SnInput,
        SnVerifyCode,
    },
    data() {
        return {
            content: {cardNumber:'',phone:'',verifyCode:''},
            verifyCodeFlag: false,
            subTitle: ['修改银行卡密码'],
            url:{phone:'',idNo:'',account:''},
            getPhoneStataus:false,
            getNumStataus:false,
            loadingFlag:false,
            phoneStat : false
        }
    },
    created() {
        let _this = this;
        _this.init();
    },
    methods: {
        init() {
            let _this = this;
        },
        editCardNumber(){
            this.content['phone']= ''
            this.content['verifyCode']= ''
            this.getPhoneStataus = false
            this.getNumStataus = false
            
        },
        getPhone(){
            let _this = this
            throttle(function(){
                if(!!_this.content.cardNumber){
                    _this.$vux.loading.show({text: '手机号获取中...'})
                    _this.getPhoneStataus = true
                    _this.getNumStataus = true
                    let param = {cardNo:_this.content.cardNumber}
                    getServerDataH5('/yqt/accountMgr/accountMgrForH5.queryAccountInfo',param,'POST').then(result => {
                        console.log(result)
                        if (result.status === 0) {
                            if(result.phone == undefined || result.phone == null || result.phone == ''){
                                _this.getPhoneStataus = false
                                _this.getNumStataus = false
                                _this.phoneStat = false
                                showToast('未查询到手机号,请手动输入');
                            }else{
                                _this.getNumStataus = false
                                _this.getPhoneStataus = true
                                _this.phoneStat = true
                            }
                            _this.$vux.loading.hide()
                            _this.content['phone'] = result.phone
                            _this.url['idNo'] = result.idNo
                            _this.url['cardNum'] = _this.content.cardNumber
                            _this.url['account'] = result.account
                            _this.verifyCodeFlag = true;

                        }else if(result.status === 1){
                            _this.$vux.loading.hide()
                            _this.getNumStataus = false
                            _this.getPhoneStataus = true
                            showToast('该银行卡已激活，不能进行重复激活');
                        }else{
                            _this.getNumStataus = false
                            _this.getPhoneStataus = true
                            _this.$vux.loading.hide()
                            showToast(result.rdesc);
                        }
                    })
                    
                }else{
                    _this.getPhoneStataus=false
                    _this.getNumStataus = false
                    showToast('请输入银行卡卡号');
                }
            }.bind(_this))
        },
        /**
         * 下一步
         */
        nextStep(){
            let _this = this;
            if (!_this.validate()) {
                return;
            }
            _this.loadingFlag = true;

            throttle(function(){
                let param = {
                    userPhone:_this.content.phone,
                    vType:11,
                    verifyCode:_this.content.verifyCode
                }
                getServerDataH5(textUrl+'/SSP-HTTP/user.checkVCode',param,'GET').then(result => {
                    console.log(result)
                    if (result.verifyStatus) {
                        _this.verifyCodeFlag = true;
                        _this.url['phone'] = _this.content.phone
                        console.log('url',_this.url)
                        setLocalData(_this.url.idNo,_this.url);

                        if(!_this.phoneStat){
                            _this.queryPersonByPhone()
                        }else{
                            _this.loadingFlag = false;
                            openRouterByValue("step1",{idNo:encodeURIComponent(_this.url.idNo)},_this);
                        }
                    }else{  
                        _this.loadingFlag = false;
                        showToast(result.desc);
                    }
                })
            }.bind(_this))
            
        },
        queryPersonByPhone(){
            let _this =this
            let param = {
                lxPhone:_this.content.phone
            }
            getServerDataH5('/yqt/accountMgr/accountMgrForH5.queryPersonByPhone',param,'POST').then(result => {
                console.log(result)
                if (result.isBuild) {
                    _this.loadingFlag = false;
                    openRouterByValue("step1",{idNo:encodeURIComponent(_this.url.idNo)},_this);
                }else{  
                    _this.loadingFlag = false;
                    showToast(result.rdesc);
                }
            })
        },
        /**
         * 数据校验
         */
        validate() {
            let _this = this;
            if (!_this.content.cardNumber) {
                showToast('请输入银行卡');
                return false;
            }
            if (!_this.content.phone) {
                showToast('请输入手机号');
                return false;
            }
            if (!_this.verifyCodeFlag) {
                showToast('请获取验证码');
                return false;
            }
            if (!_this.content.verifyCode) {
                showToast('请输入正确的验证码');
                return false;
            }
            // if (!_this.agree) {
            //     showToast('请阅读并同意2类账户协议');
            //     return false;
            // }
            return true;
        },
        /**
         * 获取验证码
         */
        getendingfun(data) {
            let _this = this;
            if (data) {
                let param = {
                    userPhone:_this.content.phone,
                    vType:11
                }
                getServerDataH5(textUrl+'/SSP-HTTP/user.getVerifyCode',param,'GET').then(result => {
                    if (result.code===0) {
                        _this.verifyCodeFlag = true;
                    }else{
                        showToast(result.desc);
                    }
                })
            }
        },
        /**
         * 打开2类开户协议
         */
        // openProtocol(){
        //     let _this = this;
        //     openRouterByValue("protocol",{name:_this.content.name,cardNumber:_this.content.cardNumber,bankMemberId: _this.content.bankMemberId,telphone: _this.content.telphone,verifyCode: _this.content.verifyCode,verifyCodeFlag:_this.verifyCodeFlag},_this);
        // }
    }
}
</script>
<style lang="less">
@import (reference) "~components/style/common";

.textTips {
    padding-left: 0.3rem;
    font-size: 0.28rem;
    background: @color-bg;
    color: @fc-info;
    height: 0.6rem;
    line-height: 0.6rem;
}
.borderTip{
    background: @color-bg;
    height: 0.3rem;
    line-height: 0.3rem;
}

.content {
    background: #fff;
}
.text {
    height: 0.4rem;
    line-height: 0.4rem;
    font-size: 0.28rem;
    color: #666;
    padding-left: 0.4rem;
}
.weui-cell:before {
    display: block !important;
    border: none !important;
}
.weui-cell{
    border-bottom: 1px solid @color-bg;
}
.swripe {
    width: 100%;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    overflow-y: auto;
    margin-top: 0.3rem;
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


.snVerifyCode .button-detail{
    background: none !important;
    border-radius: .3rem !important;
    border: 1px solid @color-blue;
    color: @color-blue !important;
}
.disable {
    button {
        background: @btn-disable;
    }
}
.weui-icon_toast.weui-loading{
    width: 20px !important;
    height: 20px !important;
}

@media screen and (min-width: @pc-width) {
    html {
        font-size: 50px !important;
    }
}
</style>
