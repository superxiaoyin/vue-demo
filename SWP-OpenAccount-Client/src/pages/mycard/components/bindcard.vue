<template>
    <div>
        <div class="form">
            <div class="swripe">
                <div class="agreement">
                    <i :class="agree?'agree_pre':'agree_nor'" @click="agree=!agree"></i>
                    <span class="agree-text">我已阅读并同意以下协议</span>
                </div>
                <div class="agreement">
                    <span><a class="sn-pointer" @click="openProtocol">《银行卡使用协议》</a></span>               
                </div>
                <div class="content">
                    <div class="contentLine">
                        <SnNumber
                            title="签约账号:"
                            text-align="left"
                            v-model="content.cardNumber"
                            placeholder="请输入签约账号"
                            :minlength="1"
                            :maxlength="19"
                        ></SnNumber>
                        <!-- <ScanCard
                            title="签约账号:"
                            text-align="left"
                            v-model="content.cardNumber"
                            placeholder="请输入签约账号"
                            :minlength="1"
                            :maxlength="19"
                        ></ScanCard> -->
                        <SnText
                            title="证件类型:"
                            text-align="left"
                            :maxlength="30"
                            readonly
                            :value="content.cardTypeName"
                        ></SnText>
                        <SnText
                            title="证件号码:"
                            text-align="left"
                            :maxlength="18"
                            placeholder="请正确登录后获取证件号码"
                            readonly
                            :value="content.cardNum"
                        ></SnText>
                        <SnTel
                            title="签约手机:"
                            :maxlength="11"
                            text-align="left"
                            v-model="content.phone"
                            placeholder="请输入签约手机号"
                        ></SnTel>
                        <SnVerifyCode
                            title="验证码"
                            :maxlength="6"
                            text-align="left"
                            :phone-num="content.phone"
                            @getending="getendingfun"
                            v-model="content.vCode"
                            placeholder="请输入验证码"
                        ></SnVerifyCode>
                    </div>
                </div>
            </div>
            
            <SnButton :showLoading="loadingFlag" @SnButtonClick="submitOpen">确定</SnButton>
        </div>
    </div>
</template>

<script>
import {openRouterByValue,backRouterByValue, getServerData,cardError,getBusinessData,getServerDataH5,formatNumber} from '../../handler/handler'
import { registerHandler, notifyAppBackEvent,GetUserInfoFunction } from 'sslib/common/SnJsBridge'
import { throttle, goBackPage, initTitleMenu, openPage, showConfirm, showToast } from 'sslib/common/extend'
import { SnText, SnTel, SnNumber, SnVerifyCode } from 'biscomponents'
import { SnButton } from 'components'
import {BankList,ScanCard} from '../../baseComponents'
export default {
    components: {
        SnButton,
        SnTel,
        SnVerifyCode,
        SnText,
        SnNumber,
        BankList,
        ScanCard
    },
    data() {
        return {
            bankList: [],
            accountList: [],
            cardData:{},
            content: {name:'',userName:'',cardNumber:'',bankName:'泸州银行',phone:'',vCode:'',cardTypeName:'身份证'},
            checkBox: true,
            verifyCodeFlag: false,
            subTitle: ['添加银行卡'],
            uaId:'', 
            agree: true,
            loadingFlag: false,
            selectFlag: { 'show': false },//是否显示选择控件 默认为false
            phone:'',
            vtype:113,
            begin:6,
            end:4,
        }
    },
    created() {
        let _this = this;
        initTitleMenu(_this.subTitle);
        _this.init();
    },
    methods: {
        /**
         * 数据初始化
         */
        init() {
            let _this = this;
            if(!!_this.$route.query.uaId){
                _this.loginData = getBusinessData('userData'+_this.$route.query.uaId);
                _this.uaId = _this.loginData.UAId;
                _this.content.name = _this.loginData.name;
                _this.content.userName = _this.loginData.userName;
                // _this.content.cardNum = _this.loginData.cardNumber;
                if(!!_this.loginData.idNo){
                    _this.content.cardNum = formatNumber(_this.loginData.idNo,_this.begin,_this.end);
                }
            }
        },
        /**
         * 确认提交
         */
        submitOpen() {
            let _this = this;
            // if (!_this.validate()) {
            //     return;
            // }
            // if(!!_this.$route.query.cardNum){//绑定签约账户
                _this.confirm();                
            // }

        },
        /**
         * 数据校验
         */
        validate() {
            let _this = this;
            if (!_this.content.cardNumber) {
                showToast('请输入签约账号');
                return false;
            }
            if (_this.content.cardNumber.length !== 16 && _this.content.cardNumber.length !== 19) {
                showToast('请输入正确签约账号');
                return false;
            }
            if (!_this.content.phone) {
                showToast('请输入签约手机号');
                return false;
            }
            if (!_this.verifyCodeFlag) {
                showToast('请获取验证码');
                return false;
            }
            if (!_this.content.vCode&&_this.content.vCode.length !== 6) {
                showToast('请输入正确的验证码');
                return false;
            }
            if (!_this.agree) {
                showToast('请阅读并同意银行卡使用协议');
                return false;
            }
            return true;
        },
        /**
         * 确定添加银行卡
         */
        confirm() {
            let _this = this;
            let data = {
                UAId: _this.uaId,
                cardList:[
                    {
                        name: _this.content.name,
                        UAId: _this.uaId,
                        cardNumber: _this.content.cardNumber+'',
                        bankMemberId: '313657092617',//泸州银行行号
                        telphone: _this.content.phone,
                        vCode: _this.content.vCode,
                    }
                ],
                phone:_this.phone
            };
            _this.loadingFlag = true;
            getServerDataH5(textUrl+'/yqt/salaryCard/salaryCard.addVisitorCard',data,'POST',true).then(res=>{
                _this.loadingFlag = false;
                if(res.code === 0){
                    if(!!res.cardIdList){
                        showToast('绑定成功');
                        // openRouterByValue('result',{result:encodeURIComponent(JSON.stringify({status:1,text:'添加成功',desc:'您可以使用银行卡进行支付',backRouter:{name:'cardlist'}})),phone:_this.phone},_this);
                    }else if(!!res.failList&&res.failList.length){
                        const errorInfo = cardError[res.failList[0].status];
                        openRouterByValue('result',{result:encodeURIComponent(JSON.stringify({status:2,text:'添加失败',desc: errorInfo})),phone:_this.phone},_this);
                    }                    
                }else{
                    showToast(res.desc);
                }
            },rej=>{
                _this.loadingFlag = false;
            })
        },
        /**
         * 获取验证码
         */
        getendingfun(data) {
            let _this = this;
            if (data) {
                getServerDataH5(textUrl+'/SSP-HTTP/user.getVerifyCode',{userPhone :_this.content.phone,vType:_this.vtype},'GET').then(res => {
                    if (res.code ===0) {
                        _this.verifyCodeFlag = true;
                    }else{
                        showToast(res.desc);
                    }
                })
            }
        },
        /**
         * 打开协议
         */ 
        openProtocol(){
            let _this = this;
            let backData ={};
            if(!!_this.content.name){
                backData.name = _this.content.name;
                backData.content = encodeURIComponent(JSON.stringify({name:_this.content.name,bankName:'泸州银行',cardNumber: _this.content.cardNumber,phone: _this.content.phone,vCode: _this.content.vCode,verifyCodeFlag:_this.verifyCodeFlag}));
            }else if(!!_this.$route.query.cardData){
                backData.cardData = _this.$route.query.cardData;
                backData.content = encodeURIComponent(JSON.stringify({name:_this.cardData.cardName,cardNumber: _this.cardData.cardNumber,bankMemberId:_this.content.bankMemberId,phone: _this.content.phone,vCode: _this.content.vCode,verifyCodeFlag:_this.verifyCodeFlag}));
            }
            openRouterByValue("protocol",backData,_this);
        }
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
.right textarea {
    text-align: right !important;
}
.contentLine{
    .weui-cell__ft{
        display: flex;
    }
}
.form_line_input {
    display: inline-block;
    text-align: left;
    border: none;
    background: none;
    .flex(1);
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
.weui-cell{
    border-bottom: 1px solid @color-bg;
}
.weui-cell:before {
    display: block !important;
    border: none !important;
}
.swripe {
    width: 100%;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    overflow-y: auto;
}
.agreement {
    display: flex;
    align-items: center;
    margin: 0.3rem;
    font-size: 0.28rem;
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

@media screen and (min-width: @pc-width) {
    html {
        font-size: 50px !important;
    }
}
</style>
