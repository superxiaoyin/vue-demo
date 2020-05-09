<template>
    <div>
        <div class="form">
            <div class="swripe">
                <div class="textTips">仅支持绑定本人的实名制借记卡</div>
                <div class="content">
                    <div class="contentLine">
                        <SnText
                            title="持卡人"
                            text-align="left"
                            :maxlength="30"
                            readonly
                            :value="content.name"
                        ></SnText>
                        <SnNumber
                            title="银行卡号"
                            text-align="left"
                            v-model="content.cardNumber"
                            placeholder="请输入银行卡号"
                            :minlength="1"
                            :maxlength="19"
                        ></SnNumber>
                        <BankList
                            v-if="!!cardData.cardName"
                            title="所属银行"
                            text-align="left"
                            :hasDefault="false"
                            :subTitle="subTitle"
                            noTips="没有可选择银行"
                            :selectFlag="selectFlag"
                            :payeeAccount="content.cardNumber"
                            placeholder="请选择银行"
                            v-model="content.bankMemberId"
                            value-text-align="left"
                        />
                        <SnText
                            v-else
                            title="所属银行"
                            text-align="left"
                            :maxlength="30"
                            readonly
                            :value="content.bankName"
                        ></SnText>
                    </div>
                </div>
                <div class="borderTip"></div>
                <div class="content">
                    <div class="contentLine">
                        <SnTel
                            title="手机号"
                            :maxlength="11"
                            text-align="left"
                            v-model="content.phone"
                            placeholder="请输入银行预留手机号"
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
            <div class="agreement">
                <i :class="agree?'agree_pre':'agree_nor'" @click="agree=!agree"></i>
                <span class="agree-text">同意<a class="sn-pointer" @click="openProtocol">《银行卡使用协议》</a></span>               
            </div>
            <SnButton :showLoading="loadingFlag" @SnButtonClick="submitOpen">确定</SnButton>
        </div>
    </div>
</template>

<script>
import {openRouterByValue,backRouterByValue, getServerData,cardError,getBusinessData,getServerDataH5} from '../../handler/handler'
import { registerHandler, notifyAppBackEvent,GetUserInfoFunction } from 'sslib/common/SnJsBridge'
import { throttle, goBackPage, initTitleMenu, openPage, showConfirm, showToast } from 'sslib/common/extend'
import { SnText, SnTel, SnNumber, SnVerifyCode } from 'biscomponents'
import { SnButton } from 'components'
import {BankList} from '../../baseComponents'
export default {
    components: {
        SnButton,
        SnTel,
        SnVerifyCode,
        SnText,
        SnNumber,
        BankList
    },
    data() {
        return {
            bankList: [],
            accountList: [],
            cardData:{},
            content: {name:'',cardNumber:'',bankName:'泸州银行',phone:'',vCode:''},
            checkBox: true,
            verifyCodeFlag: false,
            subTitle: ['添加银行卡'],
            uaId:'', 
            agree: true,
            loadingFlag: false,
            selectFlag: { 'show': false },//是否显示选择控件 默认为false
            phone:'',
            vtype:113,
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
            if(!!_this.$route.query.phone){
                _this.loginData = getBusinessData(_this.$route.query.phone);
                _this.phone = _this.$route.query.phone;
                _this.uaId = _this.loginData.UAId;
                _this.sessionKey = 'cardData'+_this.loginData.UAId;
            }else if(!!phone){
                _this.loginData = getBusinessData(phone);
                _this.sessionKey = 'cardData'+_this.loginData.UAId;
            }
            if(!!_this.$route.query.name){
                _this.content.name = _this.$route.query.name;
            }
            if(!!_this.$route.query.cardData){
                _this.vtype = 114;
                _this.cardData = JSON.parse(decodeURIComponent(_this.$route.query.cardData));
                _this.content.name =  _this.cardData.cardName;
            }
            if(!!_this.$route.query.content){
                _this.content =  JSON.parse(decodeURIComponent(_this.$route.query.content));
                _this.verifyCodeFlag = _this.content.verifyCodeFlag;
            }
        },
        /**
         * 确认提交
         */
        submitOpen() {
            let _this = this;
            if (!_this.validate()) {
                return;
            }
            if(!!_this.$route.query.cardData){//加挂Ⅰ类户
                _this.bindFirstCard();
            }else if(!!_this.$route.query.name){//添加银行卡
                _this.confirm();                
            }

        },
        /**
         * 绑定Ⅰ类户
         */
        async bindFirstCard(){
            let _this = this;
            const bindData = {
                account: _this.cardData.cardNumber,
                superAccount: _this.content.cardNumber,
                telphone: _this.content.phone,
                accountName: _this.content.name,
                vCode: _this.content.vCode,
                phone:_this.phone,
            }
            try {
                _this.loadingFlag = true;
                const bindResult = await getServerDataH5(textUrl+'/yqt/accountMgr/accountMgr.bindFirstCard',bindData,false);
                _this.loadingFlag = false;
                let data = {
                    backRouter: {name:'supercardlist', data: _this.cardData}
                }
                if(bindResult.code === 0 && bindResult.status === 1){//成功
                    data.status = 1;
                    data.text = '加挂成功'; 
                }else{
                    data.status = 0;
                    data.text = '加挂失败';
                    data.desc = bindResult.desc;
                }
               openRouterByValue('result',{result:encodeURIComponent(JSON.stringify(data)),phone:_this.phone},_this);
            } catch (error) {
                _this.loadingFlag = false;
                console.log(error);
            }
        },
        /**
         * 数据校验
         */
        validate() {
            let _this = this;
            if ('' == _this.content.name) {
                showToast('请输入姓名');
                return false;
            }
            if (!_this.content.cardNumber) {
                showToast('请输入银行卡号');
                return false;
            }
            if (_this.content.cardNumber.length !== 16 && _this.content.cardNumber.length !== 19) {
                showToast('请输入正确银行卡号');
                return false;
            }
            if (!_this.content.phone) {
                showToast('请输入银行预留手机号');
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
                cardList:[
                    {
                        name: _this.content.name,
                        UAId: _this.uaId,
                        cardNumber: _this.content.cardNumber,
                        bankMemberId: '313657092617',//泸州银行行号
                        telphone: _this.content.phone,
                        vCode: _this.content.vCode,
                    }
                ],
                phone:_this.phone
            };
            _this.loadingFlag = true;
            getServerDataH5(textUrl+'/yqt/salaryCard/salaryCard.add',data).then(res=>{
                _this.loadingFlag = false;
                if(res.code === 0){
                    if(!!res.cardIdList){
                        openRouterByValue('result',{result:encodeURIComponent(JSON.stringify({status:1,text:'添加成功',desc:'您可以使用银行卡进行支付',backRouter:{name:'cardlist'}})),phone:_this.phone},_this);
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
            if(!!_this.$route.query.name){
                backData.name = _this.$route.query.name;
                backData.content = encodeURIComponent(JSON.stringify({name:_this.$route.query.name,bankName:'泸州银行',cardNumber: _this.content.cardNumber,phone: _this.content.phone,vCode: _this.content.vCode,verifyCodeFlag:_this.verifyCodeFlag}));
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

@media screen and (min-width: @pc-width) {
    html {
        font-size: 50px !important;
    }
}
</style>
