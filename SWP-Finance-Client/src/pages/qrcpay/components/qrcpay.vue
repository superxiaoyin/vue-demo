<template>
    <div class="qrcpay">
        <div class="shop-title">{{payeeInfo.payeeName}}</div>
        <div class="pay-input">
            <div class="pay-money">
                <span>付款金额</span>
                <div class="money">
                    <i class="money-unit">¥</i>
                    <div class="money-border">
                        <sn-money :placeholder="placeholder" v-model="payMoney" text-align="left"></sn-money>
                    </div>
                </div>
            </div>
            <div class="pay-account">
                <div class="account-title">
                    <span>付款账户</span>
                    <i class="loading" v-if="accountLoading"></i>
                </div>
                <div class="account-select" v-if="accountList.length" @click="selectAccount">
                    <span class="bank"><i class="bank-icon"></i><span>{{accountData.title}}</span></span>
                    <i class="right"></i>
                </div>
            </div>
            <div v-transfer-dom>
                <popup
                    ref="popup"
                    v-model="showPopup"
                    :descriptionText="descriptionText"
                    :closeOnClickingMask="true"
                    :showCancel="true"
                    @on-click-cancel="cancelFun">
                    <panel @on-choose-item="chooseItem" :chooseIndex="chooseIndex" :dataList="accountList"></panel>
                </popup>
            </div>
        </div>
        <div class="pay-desc">支付金额给商户</div>
        <SnButton @SnButtonClick="confirmPay" :showLoading="payLoading">{{payText}}</SnButton>
    </div>
</template>
<script>
import { registerHandler, notifyAppBackEvent,GetUserInfoFunction } from 'sslib/common/SnJsBridge'
import { throttle, initTitleMenu, getUrlParams, showToast, goBackPage } from 'sslib/common/extend'
import { openRouterByValue,backRouterByValue,formatSelectList,getServerData,openNativePage,getSignData} from '../../handler/handler'
import { SnButton } from 'components'
import {SnMoney} from 'biscomponents'
import {Popup,Panel} from '../../baseComponents'
import * as math from 'mathjs'
import { QRCPayModel } from '../../handler/model'
let urlParams = getUrlParams();
let payeeInfo = JSON.parse(decodeURIComponent(urlParams.payeeInfo)) || {};
let txnID = urlParams.txnID || "";
export default {
    data(){
        return{
            payText: "立即支付",
            showPopup:false,
            chooseIndex: 0,
            placeholder: "请输入付款金额",
            descriptionText: "选择付款账户",
            payMoney: "",
            accountLoading: false,
            payLoading: false,
            accountList:[],
            payeeInfo,
            txnID,
            deviceId: "",
            subTitle: ["泸商赢收款"]
        }
    },
    components:{
        SnButton,SnMoney,Popup,Panel
    },
    created() {
        let _this = this;
        initTitleMenu(_this.subTitle);
        _this.init();
    },
    methods:{
        init(){
            let _this = this;
            notifyAppBackEvent(); //调用app，通知返回事件
            registerHandler('notifyAppBack', function (data) {//点击app返回事件
                throttle(function () {
                    goBackPage('sswbv_close_browser');
                }.bind(this));
            });
            GetUserInfoFunction().then(function(Data){
                if(!!Data){
                    _this.deviceId = Data.deviceId;
                }
            })
            _this.queryAccountList();
        },
        /**
         * 调起选择账户列表弹窗
         */
        selectAccount(){
            let _this = this;
            if(_this.accountList.length){
                _this.showPopup=true;
            }
        },
        /**
         * 选择账户数据
         */
        chooseItem(index) {
            let _this = this;
            _this.chooseIndex = index;
            _this.accountData = _this.accountList[index];
            _this.showPopup=false
        },
        /**
         * 取消弹窗
         */
        cancelFun(){
            this.showPopup=false
        },
        /**
         * 查询账户列表
         */
        async queryAccountList(){
            let _this = this;
            const data = {
                cpyId:-1,
                businessType: 1
            }
            try {
                _this.accountLoading = true;
                const result = await getServerData('accountMgr/accountMgr.queryAccountList',data);
                _this.accountLoading = false;
                if(result.code === 0){
                    _this.accountList = formatSelectList(result.accountList,true);
                    if(!_this.accountList.length){
                        showToast('暂无可用账户，无法进行支付','middle');
                    }
                }
            } catch (error) {
                console.log(error);
                _this.accountLoading = false;
            }
        },
        /**
         * 数据校验
         */
        validate(){
            let _this = this;
            if(!_this.payMoney){
                showToast(_this.placeholder,"middle");
                return false;
            }else if(Number(_this.payMoney)===0){
                showToast("金额必须大于0","middle");
                return false;
            }
            return true;
        },
        /**
         * 确认支付
         */
        async confirmPay(){
            let _this = this;
            if(!_this.validate()){
                return;
            }
            let timeStamp = new Date().getTime()+"";
            let payData = new QRCPayModel(_this.txnID,
                                    Number(_this.payMoney), 
                                    _this.accountData.account,
                                    _this.accountData.name,
                                    _this.deviceId,
                                    timeStamp);
            const data = {
                payerAccount: _this.accountData.account,
                payerName: _this.accountData.name,
                txnAmt: Number(_this.payMoney),
                txnID: _this.txnID,
                timeStamp: timeStamp
            }
            try {
                const result = await getSignData(data);
                if(!!result.data.signData){
                    payData.extraInfo.signData.sign = result.data.signData;
                    const pwdData = await openNativePage('IntentAction_PayPasswordActivity', [{ key: "isEncrypted", value: 1, type: "int" }],[{key: "result_key",value: "",type: "string"}]);
                    if(!!pwdData[0].value){
                        payData.payPwd = pwdData[0].value;
                    }
                    _this.payText = "正在支付...";
                    _this.payLoading = true;
                    const payResult = await getServerData("qrcPay/qrcPay.payTxn",payData,false);
                    _this.payLoading = false;
                    _this.payText = "立即支付";
                    let data = {};
                    if(payResult.respCode === 0){//支付成功
                        data.status = 1;
                        data.text = '支付成功';
                        data.amount = Number(_this.payMoney);
                        data.infoList = [
                            {title:'付款方式',value:_this.accountData.title},
                            {title:'收款方',value:_this.payeeInfo.payeeName}
                        ];
                    }else{
                        data.status = 0;
                        data.text = '支付失败';
                        data.desc = payResult.desc;
                    }
                    openRouterByValue("result",{result:encodeURIComponent(JSON.stringify(data))},_this);
                }
            } catch (error) {
                _this.payLoading = false;
                _this.payText = "立即支付";
                console.log(error);
            }
        }
        
    },
    watch:{
        accountList:{
            handler(newVal,oldVal){
                let _this = this;
                if(newVal.length){
                    _this.accountData = _this.accountList[_this.chooseIndex];
                }
            }
        }
    }
}
</script>
<style lang="less">
    @import "~components/style/common.less";
    .qrcpay{
        padding: 0 .3rem;
        background: @color-bg;
        .shop-title{
            font-size: @fs-mob-big;
            text-align: center;
            padding: 1rem 0;
        }
        .pay-input{
            background: @color-white;
            border-radius: .1rem;
            padding: .6rem .3rem;
            .pay-account,.pay-money{
                display: flex;
                flex-direction: column;
            }  
            .pay-money{
                .money{
                    display: flex;
                    align-items: center;
                    .money-unit{
                        font-size: @fs-mob-big;
                        font-weight: bolder;
                    }
                    .money-border{
                        margin-left: .3rem;
                        border-bottom: 1px solid @color-bg;
                        width: 100%;
                        display: inline-flex;
                        align-items: center;
                        .overflow-show{
                            width: 100%;
                            .weui-cell{
                                padding-left: 0 !important;
                            }
                            input{
                                font-size: @fs-mob-bigger;
                            }
                        }
                    }
                }
            }
            .pay-account{
                padding-top: .3rem;
                .account-title{
                    display: inline-flex;
                    align-items: center;
                    justify-content: space-between;
                    .loading{
                        display: inline-block;
                        width: .4rem;
                        height: .4rem;
                        background: url("../../../resource/img/loading.gif") no-repeat center;
                        background-size: contain;
                    }
                }
                .account-select{
                    display: inline-flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: .3rem;
                    .bank{
                        display: inline-flex;
                        align-items: center;
                        .bank-icon{
                            display: inline-block;
                            width: .54rem;
                            height: .54rem;
                            background: url('../../../resource/img/icon_bank.png') no-repeat center;
                            background-size: .54rem .54rem;
                            margin-right: .1rem;
                        }              
                    }
                    .right{
                        display: inline-block;
                        width: .45rem;
                        height: .45rem;
                        background: url('../../../resource/img/icon_narrow_right.png') no-repeat center;
                        background-size: .45rem .45rem;
                        cursor: pointer;
                    }
                }
            }
        }
        .pay-desc{
            text-align: center;
            margin-top: .6rem;
            font-size: @fs-mob-small;
            color: @fc-info;
        }
    }
</style>
