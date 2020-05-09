<template>
    <div>
        <div class="form">
            <div class="swripe">
                <div class="textTips">请绑定您的同名1类账号</div>
                <div class="content">
                    <div class="contentLine">
                        <SnText
                            title="姓名"
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
                    </div>
                </div>
                <div class="borderTip"></div>
                <div class="content">
                    <div class="contentLine">
                        <SnTel
                            title="手机号"
                            :maxlength="11"
                            text-align="left"
                            v-model="content.telphone"
                            placeholder="请输入银行预留手机号"
                        ></SnTel>
                        <SnVerifyCode
                            title="验证码"
                            :maxlength="6"
                            text-align="left"
                            :phone-num="content.telphone"
                            @getending="getendingfun"
                            v-model="content.verifyCode"
                            placeholder="请输入验证码"
                        ></SnVerifyCode>
                    </div>
                </div>
            </div>
            <div class="agreement">
                <i :class="agree?'agree_pre':'agree_nor'" @click="agree=!agree"></i>
                <span class="agree-text">同意</span>
                <a class="sn-pointer" @click="openProtocol">《开通Ⅱ类账户协议》</a>
            </div>
            <SnButton @SnButtonClick="nextStep">下一步</SnButton>
        </div>
    </div>
</template>

<script>
import {openRouterByValue,backRouterByValue, getServerData} from '../../handler/handler'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
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
            content: {name:'',cardNumber:'',bankMemberId:'',telphone:'',verifyCode:''},
            checkBox: true,
            verifyCodeFlag: false,
            subTitle: ['Ⅱ类开户'],
            agree: true,
            selectFlag: { 'show': false },//是否显示选择控件 默认为false
        }
    },
    created() {
        let _this = this;
        initTitleMenu(_this.subTitle);
        _this.init();
    },
    methods: {
        init() {
            let _this = this;
            if(!!_this.$route.query){
                _this.content.name = _this.$route.query.name || '';
                _this.content.cardNumber = _this.$route.query.cardNumber || '';
                _this.content.bankMemberId = _this.$route.query.bankMemberId || '';
                _this.content.telphone = _this.$route.query.telphone || '';
                _this.content.verifyCode = _this.$route.query.verifyCode || '';
                _this.verifyCodeFlag = _this.$route.query.verifyCodeFlag;
            }
            notifyAppBackEvent(); //调用app，通知返回事件
            registerHandler('notifyAppBack', function (data) {//点击app返回事件
                throttle(function () {
                    if (_this.selectFlag.show) {
                        initTitleMenu(_this.subTitle);
                        _this.selectFlag.show = false;
                    } else {
                        goBackPage('sswbv_close_browser');                        
                    }
                }.bind(this));
            });
        },
        /**
         * 下一步
         */
        nextStep(){
            let _this = this;
            if (!_this.validate()) {
                return;
            }
            const data = {
                name: _this.content.name,
                account: _this.content.cardNumber,
                mode: 1,
                type: 1,
                bankMemberId: _this.content.bankMemberId,
                phone: _this.content.telphone,
                vCode: _this.content.verifyCode
            };
            openRouterByValue("password",{data:encodeURIComponent(JSON.stringify(data))},_this);
        },
        /**
         * 数据校验
         */
        validate() {
            let _this = this;
            if (!_this.content.name) {
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
            if (!_this.content.bankMemberId) {
                showToast('请选择所属银行');
                return false;
            }
            if (!_this.content.telphone) {
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
            if (!_this.agree) {
                showToast('请阅读并同意Ⅱ类账户协议');
                return false;
            }
            return true;
        },
        /**
         * 获取验证码
         */
        getendingfun(data) {
            let _this = this;
            if (data) {
                getServerData('user/user.getVerifyCode',{userPhone :_this.content.telphone,vType:16}).then(res => {
                    if (res.code === 0) {
                        _this.verifyCodeFlag = true;
                    }
                })
            }
        },
        /**
         * 打开Ⅱ类开户协议
         */
        openProtocol(){
            let _this = this;
            openRouterByValue("protocol",{name:_this.content.name,cardNumber:_this.content.cardNumber,bankMemberId: _this.content.bankMemberId,telphone: _this.content.telphone,verifyCode: _this.content.verifyCode,verifyCodeFlag:_this.verifyCodeFlag},_this);
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
