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
        <div class="notes"  v-show="!pwds">*充值存在延迟，若余额不正确，请稍后查询</div>
        <div class="password-input" v-show="pwds">
            <SnCell title="支付密码" value-align="left" title-width="2.2rem">
                <span class="cursor" id="pwdCursor"></span>
                <input
                    class="form_line_input"
                    type="tel" 
                    style="-webkit-text-security:disc"
                    placeholder="请输入支付密码"
                    maxlength="6"
                    ref="pwd"
                    id="pwd"
                />
            </SnCell>
        </div>
        <SnButton @SnButtonClick="confirmOperate" :showLoading="payLoading">{{payText}}</SnButton>
    </div>
</template>
<script>
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import {initInput,numberKeyboard} from "sslib/common/cfcaKeyS.js";
import { throttle, goBackPage, initTitleMenu, openPage, showConfirm, showToast, getUrlParams } from 'sslib/common/extend'
import { OperatePayModel } from '../../handler/model'
import { SnActionSheet,SnButton,SnCell } from 'components'
import {SnMoney} from 'biscomponents'
import {Popup,Panel} from '../../baseComponents'
import { openRouterByValue,backRouterByValue,formatSelectList,setBusinessData,getServerData,openNativePage,getSignData,getBusinessData,getServerDataH5,getSignDataH5 } from '../../handler/handler'
var urlParams = getUrlParams();
var phone = urlParams.phone;
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
            phone:'',
            loginData:{},
            random:'123',
            pwds:false
        }
    },
    created(){
        let _this = this;
        _this.init();
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
    mounted(){
        let _this = this;
        
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
        }
    },
    components:{
        SnActionSheet,SnMoney,Popup,Panel,SnButton,SnCell
    },
    methods:{
        /**
         * 数据初始化
         */
        init(){
            let _this = this;
            if(!!_this.$route.query.accountData){
                _this.accountData = JSON.parse(decodeURIComponent(_this.$route.query.accountData));
                _this.phone = _this.$route.query.phone;
                _this.loginData = getBusinessData(_this.$route.query.phone);
            }
            if(!!_this.$route.query.operateType){
                _this.operateType = Number(_this.$route.query.operateType);
            }
            _this.payText = _this.subTitle;
            if(!!getBusinessData(`${_this.accountData.account}selectListData`)){
                let accountListData = getBusinessData(`${_this.accountData.account}selectListData`)
                console.log(accountListData)
                if(accountListData[0].bankId == 313657092617){
                    _this.pwds = true
                }else{
                    _this.pwds = false
                }
                _this.accountList = accountListData
            }else{
                _this.querysuperAccount();
            }
        },
        /**
         * 查询Ⅱ类户对应的Ⅰ类户列表
         */
        async querysuperAccount(){
            let _this = this;
            const data = {
                account: _this.accountData.account,
                phone:_this.phone,
            }
            try {
                _this.accountLoading = true;
                const superData = await getServerDataH5('/yqt/accountMgr/accountMgr.querysuperAccount',data);
                _this.accountLoading = false;
                if(superData.code == 0 &&!!superData.accountList){
                    _this.accountList = formatSelectList(superData.accountList);
                    if(_this.accountList.length){
                        if(superData.accountList[0].bankId == 313657092617){
                            _this.pwds = true
                        }else{
                            _this.pwds = false
                        }

                        setBusinessData(`${_this.accountData.account}selectListData`, _this.accountList);
                    }else{
                        showToast(`未绑定Ⅰ类户，无法进行${_this.subTitle}`,'middle');
                    }
                }else{
                    showToast(superData.desc,'middle');
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
            if(_this.accountList[index].bankId == 313657092617){
                _this.pwds = true
            }else{
                _this.pwds = false
            }

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
                showToast(`暂未绑定Ⅰ类户，无法进行${_this.subTitle}`,'middle');
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
                payData.extraInfo.signData.sign = getSignDataH5(JSON.stringify(data));
                _this.payLoading = true;
                _this.payText = `正在${_this.subTitle}...`;
               
                if(_this.pwds){
                    var errorCode = numberKeyboard.getErrorCode('pwd').toString(16);
                    _this.pwdShow=true
                    console.log('errorCode',errorCode)
                    if(errorCode == 0){
                        //获取密码输入框中加密后的数据
                        var encryptedInputValue = numberKeyboard.getEncryptedInputValue('pwd');
                        console.log('encryptedInputValue',encryptedInputValue)
                        var randomValue = numberKeyboard.getEncryptedClientRandom('pwd');
                        if(!encryptedInputValue){
                            showToast('请输入正确的6位数密码!');
                            _this.pwdShow = false
                            _this.payLoading = false;
                            _this.payText = `充值`;
                            return;
                        }
                        payData.pwd = encryptedInputValue;
                        payData.encryptedRc = randomValue;           
                    }else{
                        showToast('请输入正确的6位数密码!');
                        _this.pwdShow = false
                        _this.payLoading = false;
                        _this.payText = `充值`;
                        return;
                    }
                }

                payData.channel = "2";//渠道号
                payData.phone = _this.phone;

                const payResult = await getServerDataH5('/yqt/accountMgr/accountMgr.chargeByTTJM',payData);
                // const payResult = await getServerDataH5('/yqt/accountMgr/accountMgr.charge',payData);

                if(payResult.channelFlg == 1){
                    document.write(payResult.data)
                }else{
                    _this.payLoading = false;
                    _this.payText = _this.subTitle;
                    // let data = {};
                    if(payResult.code === 0 && payResult.status === 1){//成功
                        data.status = 1;
                        data.text = `${_this.subTitle}成功`;
                        data.amount = Number(_this.operateMoney);
                        data.infoList = [{title:`${_this.subTitle}账户`,value:_this.superAccountData.title}];
                    }else{//支付失败
                        data.status = 0;
                        data.text = `${_this.subTitle}失败`;
                        data.desc = payResult.rdesc;
                    }
                    openRouterByValue("result",{result:encodeURIComponent(JSON.stringify(data)),phone:_this.phone},_this);
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
    },
    mounted () {
        ;
    },
}
</script>
<style lang="less">
    @import '~components/style/common.less';
    .notes{
        font-size: 14px;
        margin: 10px;
        color: #ff9245;
    }
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
