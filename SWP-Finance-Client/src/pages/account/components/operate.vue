<template>
    <div class="operate">
        <div class="operate-account">
            <div class="account-title">
                <span></span>
                <i class="loading" v-if="accountLoading"></i>
            </div>
            <div class="account-select" v-if="accountList.length" @click="selectAccount">
                <span class="bank"><i class="bank-icon"></i><span>{{superAccountData.title}}</span></span>
                <i class="right"></i>
            </div>
        </div>
        <div class="operate-money">
            <span>{{subTitle}}金额</span>
            <div class="money">
                <i class="money-unit">¥</i>
                <div class="money-border">
                    <sn-money :placeholder="placeholder" v-model="operateMoney" text-align="left"></sn-money><span v-if="operateType===2" class="all" @click="all">全部</span>
                </div>
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
        <SnButton @SnButtonClick="confirmOperate" :showLoading="payLoading">{{payText}}</SnButton>
    </div>
</template>
<script>
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { throttle, goBackPage, initTitleMenu, openPage, showConfirm, showToast, getUrlParams } from 'sslib/common/extend'
import { OperatePayModel } from '../../handler/model'
import { SnActionSheet,SnButton } from 'components'
import {SnMoney} from 'biscomponents'
import {Popup,Panel} from '../../baseComponents'
import { openRouterByValue,backRouterByValue,formatSelectList,setBusinessData,getServerData,openNativePage,getSignData,getBusinessData } from '../../handler/handler'
export default {
    data(){
        return{
            accountData:{},
            superAccountData:{},
            showActionSheetSelect: false,
            operateMoney: 0,
            showPopup:false,
            chooseIndex: 0,
            accountList: [],
            operateType: 0,
            payText:'',
            accountLoading: false,
            payLoading: false,
        }
    },
    created(){
        let _this = this;
        _this.init();
    },
    computed:{
        subTitle(){
            return this.operateType===1?'充值':'提现'
        },
        descriptionText(){
            return this.operateType===1?'选择充值账户':'选择提现账户'
        },
        placeholder(){
            return this.operateType===1?'请输入充值金额':'请输入提现金额'
        },
        payurl(){
            return this.operateType===1?'accountMgr/accountMgr.charge':'accountMgr/accountMgr.cashout'
        }
    },
    components:{
        SnActionSheet,SnMoney,Popup,Panel,SnButton
    },
    methods:{
        /**
         * 数据初始化
         */
        init(){
            let _this = this;
            if(!!_this.$route.query.accountData){
                _this.accountData = JSON.parse(decodeURIComponent(_this.$route.query.accountData));
            }
            if(!!_this.$route.query.operateType){
                _this.operateType = Number(_this.$route.query.operateType);
            }
            initTitleMenu([_this.subTitle]);
            _this.payText = _this.subTitle;
            notifyAppBackEvent(); //调用app，通知返回事件
            registerHandler('notifyAppBack', function (data) {//点击app返回事件
                throttle(function () {
                    backRouterByValue('accountdetail',_this.$route.query,_this);
                }.bind(this));
            });
            if(!!getBusinessData(`${_this.accountData.account}selectListData`)){
                _this.accountList = getBusinessData(`${_this.accountData.account}selectListData`);
            }else{
                _this.querysuperAccount();
            }
        },
        /**
         * 查询Ⅱ类户对应的一类户列表
         */
        async querysuperAccount(){
            let _this = this;
            const data = {
                account: _this.accountData.account,
            }
            try {
                _this.accountLoading = true;
                const superData = await getServerData('accountMgr/accountMgr.querysuperAccount',data);
                _this.accountLoading = false;
                if(superData.code === 0 &&!!superData.accountList){
                    _this.accountList = formatSelectList(superData.accountList);
                    if(_this.accountList.length){
                        setBusinessData(`${_this.accountData.account}selectListData`, _this.accountList);
                    }else{
                        showToast(`未绑定一类户，无法进行${_this.subTitle}`,'middle');
                    }
                }
            } catch (error) {
                _this.accountLoading = false;
                console.log(error);
            }
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
            _this.superAccountData = _this.accountList[index];
            _this.showPopup=false
        },
        /**
         * 取消弹窗
         */
        cancelFun(){
            this.showPopup=false
        },
        /**
         * 选择全部
         */
        all(){
            this.operateMoney = this.accountData.accountBalance;
        },
        /**
         * 数据校验
         */
        validate(){
            let _this = this;
            if(!_this.accountList.length){
                showToast(`暂未绑定一类户，无法进行${_this.subTitle}`,'middle');
                return false;
            }
            if(!_this.operateMoney){
                showToast(_this.placeholder,'middle');
                return false;
            }else if(Number(_this.operateMoney)===0){
                showToast("金额必须大于0","middle");
                return false;
            }
            return true;
        },
        /**
         * 确认支付
         */
        async confirmOperate(){
            let _this = this;
            if(!_this.validate()){
                return;
            }
            let timeStamp = new Date().getTime()+"";
            const payData = _this.operateType === 1 ? new OperatePayModel(_this.superAccountData.account,
                                    _this.superAccountData.name,
                                    _this.accountData.account,
                                    _this.accountData.name,
                                    Number(_this.operateMoney),timeStamp)
                                : new OperatePayModel(_this.accountData.account,
                                    _this.accountData.name,
                                    _this.superAccountData.account,
                                    _this.superAccountData.name,
                                    Number(_this.operateMoney),timeStamp);
            try {     
                //签名字段按字典顺序签名                    
                const data = _this.operateType === 1 ? {
                    amount: Number(_this.operateMoney),
                    payeeAccount: _this.accountData.account,
                    payeeName: _this.accountData.name,
                    payerAccount: _this.superAccountData.account,
                    payerName: _this.superAccountData.name,
                    timeStamp:timeStamp
                }:{
                    amount: Number(_this.operateMoney),
                    payeeAccount: _this.superAccountData.account,
                    payeeName: _this.superAccountData.name,
                    payerAccount: _this.accountData.account,
                    payerName: _this.accountData.name,
                    timeStamp:timeStamp
                }
                const result = await getSignData(data);
                if(!!result.data.signData){
                    payData.extraInfo.signData.sign = result.data.signData;
                    const pwdData = await openNativePage('IntentAction_PayPasswordActivity', [{ key: "isEncrypted", value: 1, type: "int" }],[{key: "result_key",value: "",type: "string"}]);
                    if(!!pwdData[0].value){
                        payData.pwd = pwdData[0].value;
                    }
                    _this.payLoading = true;
                    _this.payText = `正在${_this.subTitle}...`;
                    const payResult = await getServerData(_this.payurl,payData,false);
                    _this.payLoading = false;
                    _this.payText = _this.subTitle;
                    let data = {};
                    if(payResult.code === 0 && payResult.status === 1){//成功
                        data.status = 1;
                        data.text = `${_this.subTitle}成功`;
                        data.amount = Number(_this.operateMoney);
                        data.infoList = [{title:`${_this.subTitle}账户`,value:_this.superAccountData.title}];
                    }else{//支付失败
                        data.status = 0;
                        data.text = `${_this.subTitle}失败`;
                        data.desc = payResult.desc;
                    }
                    openRouterByValue("result",{result:encodeURIComponent(JSON.stringify(data))},_this);
                }
            } catch (error) {
                _this.payLoading = false;
                _this.payText = _this.subTitle;
                console.log(error);
            }
        }
    },
    watch:{
        accountList:{
            handler(newVal,oldVal){
                let _this = this;
                if(newVal.length){
                    _this.superAccountData = _this.accountList[_this.chooseIndex];
                }
            }
        }
    }
}
</script>
<style lang="less">
    @import '~components/style/common.less';
    .operate{
        background: @color-bg;
        .operate-account,.operate-money{
            background: @color-white;
            padding: .3rem;
            display: flex;
            flex-direction: column;
        }   
        .operate-account{
            margin-bottom: .3rem;
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
        .operate-money{
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
                    .all{
                        display: inline-block;
                        width: 1rem;
                        text-align: center;
                        font-size: @fs-mob-small;
                        color:#3891FF;
                    }
                }
            }
        }
        .overflow-show{
            width: 100%;
            .weui-cell{
                padding-left: 0 !important;
                .weui-cell__ft{
                    input{
                        font-size: @fs-mob-big;
                        font-weight: bold;
                    }
                    ::-webkit-input-placeholder {
                        font-weight: normal;
                    }
                }
            }
        }
    }
</style>
