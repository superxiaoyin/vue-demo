<template>
    <div class="wealth-redeem">
        <div class="redeem-title">
            <i class="redeem-icon"></i>
            <span class="wealth-title">{{finance.pTitle}}</span>
        </div>
        <div class="redeem-info">
            <sn-cell title="赎回金额" value-align="left">{{finance.amount|moneyFrt(1)}}</sn-cell>
            <sn-cell title="收款账户" value-align="left">泸州银行({{finance.account.substr(-4)}})</sn-cell>
        </div>
        <div class="password-input">
            <SnCell title="支付密码" value-align="left" title-width="1.9rem">
                <span class="cursor" id="pwdCursor"></span>
                <input
                    class="form_line_input"
                    type="tel" 
                    style="-webkit-text-security:disc"
                    placeholder="请输入支付密码"
                    v-model="password"
                    maxlength="6"
                    ref="pwd"
                    id="pwd"
                />
            </SnCell>
        </div>
        <div class="redeem-btn">
            <sn-button :showLoading="payLoading" @SnButtonClick="confirmRedeem">{{redeemText}}</sn-button> 
        </div>
    </div>
</template>
<script>
import { openRouterByValue,backRouterByValue,getSignData,openNativePage,getServerData,getServerDataH5,getSignDataH5 } from '../../handler/handler'
import { WealthRedeemModel } from '../../handler/model'
import {initInput,numberKeyboard} from "sslib/common/cfcaKeyS.js";
import { SnCell,SnButton } from 'components'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { throttle, initTitleMenu, showToast, moneyStringFixTwo } from 'sslib/common/extend'
export default {
    data(){
        return{
            finance:{},
            loadingFlag: false,
            redeemText: "确定赎回",
            subTitle:["赎回"],
            phone:'',
            random:'123',
            password:'',
            payLoading:false
        }
    },
    components:{
        SnCell,SnButton
    },
    created(){
        let _this = this;
        // initTitleMenu(_this.subTitle);
        _this.init();
    },
    mounted(){
        let _this = this;
        let param = {
            phone:_this.phone,
        };
        getServerDataH5(textUrl+'/yqt/accountMgr/accountMgr.genServerRandom',param,'POST').then(result => {
            if (result.code===0) {
                _this.random = result.serverRandom;
                initInput(_this.random);
            }else{
                showToast(result.desc);
            }
        })
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
            //         backRouterByValue("redeemdetail",_this.$route.query,_this);
            //     }.bind(this));
            // })
            if(!!_this.$route.query.finance){
                _this.finance = JSON.parse(decodeURIComponent(_this.$route.query.finance));
                _this.phone = _this.$route.query.phone;
            }
        },
        /**
         * 确定赎回
         */
        async confirmRedeem(){
            let _this = this;
            let timeStamp = new Date().getTime()+"";
            const payData = new WealthRedeemModel(_this.finance.bankFinanceNo,
                                        _this.finance.amount,
                                        _this.finance.account,
                                        _this.finance.pName,
                                        _this.finance.pCode,
                                        {
                                            currency:Number(_this.finance.currency),
                                            period: _this.finance.period,
                                            rate: _this.finance.rate,
                                            openAccDate: _this.finance.openAccDate,
                                            endTime: _this.finance.endTime,
                                            startAmount: _this.finance.startAmount
                                        },
                                        timeStamp);
            try {
                    //1.获取签名 2.安全键盘获取交易密码 3.调赎回接口
                    const data = {
                        amount: Number(_this.finance.amount),
                        payeeAccount: _this.finance.account,
                        timeStamp:timeStamp
                    }
                    payData.extraInfo.signData.sign = getSignDataH5(JSON.stringify(data));
                    _this.payLoading = true;
                    _this.payText = `正在赎回...`;
                    var errorCode = numberKeyboard.getErrorCode('pwd').toString(16);
                    if(parseInt(errorCode) == 0){
                        //获取密码输入框中加密后的数据
                        var encryptedInputValue = numberKeyboard.getEncryptedInputValue('pwd');
                        var randomValue = numberKeyboard.getEncryptedClientRandom('pwd');
                        if(!encryptedInputValue){
                            showToast('请输入正确的6位数密码!');
                            _this.payLoading = false;
                            _this.payText = `确定赎回`;
                            return;
                        }
                        payData.pwd = encryptedInputValue;
                        payData.encryptedRc = randomValue;
                        // //跳转
                        // if(result.code === 0){

                            
                        // }else{
                            
                        // }             
                    }else{
                        showToast('请输入正确的6位数密码!');
                        _this.payLoading = false;
                        _this.payText = `确定赎回`;
                        return;
                    }
                // const result = await getSignData(data);
                // if(!!result.data.signData){
                //     redeemData.extraInfo.signData.sign = result.data.signData;
                //     const pwdData = await openNativePage('IntentAction_PayPasswordActivity', [{ key: "isEncrypted", value: 1, type: "int" }],[{key: "result_key",value: "",type: "string"}]);
                //     if(!!pwdData[0].value){
                //         redeemData.pwd = pwdData[0].value;
                //     }
                    // _this.redeemText = "正在赎回...";
                    // _this.loadingFlag = true;
                    payData.channel = "2";//渠道号
                    payData.phone = _this.phone;
                    const redeemResult = await getServerDataH5(textUrl+'/yqt/wealth/wealthManage.redeemFinancialProduct',payData,false);
                    _this.payLoading = false;
                    _this.redeemText = "确定赎回";
                    let tmpdata={};
                    if(redeemResult.code === 0&&!!redeemResult.voucherNo){
                        tmpdata.status = 1;
                        tmpdata.text = '赎回成功';
                        tmpdata.amount = redeemResult.principal+redeemResult.interest;
                        tmpdata.info = `本金: ${moneyStringFixTwo(redeemResult.principal)}      利息: ${moneyStringFixTwo(redeemResult.interest)}`;
                        tmpdata.infoList = [
                            {title:'收款账户',value: `泸州银行(${_this.finance.account.substr(-4)})`},
                            {title:'产品',value:_this.finance.pTitle}
                        ];
                    }else{
                        tmpdata.status = 0;
                        tmpdata.text = '赎回失败';
                        tmpdata.desc = redeemResult.desc;
                    }
                    openRouterByValue("result",{result:encodeURIComponent(JSON.stringify(tmpdata)),phone:_this.phone},_this);
                // }
            }catch(error){
                _this.payLoading = false;
                _this.redeemText = "确定赎回";
                console.log(error);
            }
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .wealth-redeem{
        background: @color-bg;
        .redeem-title{
            padding: .3rem .3rem .1rem .3rem;
            display: flex;
            align-items: center;
            .wealth-title{
                padding-left: .1rem;
                font-weight: bolder;
            }
            .redeem-icon{
                display: inline-block;
                width: .44rem;
                height: .44rem;
                background: url('../../../resource/img/wealth/icon_redeem.png') no-repeat center;
                background-size: .44rem .44rem;
            }
        }
        .redeem-info{
            background: @color-white;
            .sn-cell:before{
                border-bottom: none !important;
            }
            .sn-cell{
                margin: 0 .3rem;
                padding: .24rem 0;
                border-bottom: 1px solid @color-bg;
            } 
        }
        .redeem-btn{
            padding: 0 .3rem;
        }
        .password-input{
            background: @color-white;
        }
        .textTips {
            padding-left: 0.3rem;
            font-size: 0.28rem;
            background: @color-bg;
            color: @fc-info;
            height: 0.6rem;
            line-height: 0.6rem;
        }
        .sn-cell{
            border-bottom: 1px solid @color-bg;
            margin: 0 .3rem;
            padding: .24rem .3rem !important;
        }
        .sn-cell:before{
            border: none !important;
        }
        .form_line_input {
            display: inline-block;
            text-align: left;
            border: none;
            background: none;
            .flex(1);
        }
        .cursor {
            position: absolute;
            margin-top: -3px;
            margin-left: 0px;
            width: 2px;
            height: 24px;
            display: none;
            z-index: 1000;
        }
    }
</style>
