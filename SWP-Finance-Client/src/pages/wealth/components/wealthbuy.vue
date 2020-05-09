<template>
    <div class="wealth-buy">
        <div class="product-label">
            <label class="product-name">{{product.pTitle}}</label> 
            <div class="product-desc">
                <span>{{interestDesc}}</span>
                <span class="save-date">存期{{num2Chinese(product.dueTime)}}年</span>
                <span>{{product.startAmount}}元起存</span>
            </div>               
        </div>
        <div class="product-input">
            <div class="buy-money">
                <div class="buy-title">购入金额</div>
                <SnMoney placeholder="请输入本金金额" :startAmount="product.startAmount" text-align="left" v-model="buyAmount"></SnMoney>
            </div> 
            <div class="buy-account" @click='selectAccount'>
                <div class="buy-title">
                    <span>付款账户</span>
                    <i class="loading" v-if="accountLoading"></i>
                </div>  
                <div class="account" v-if="accountList.length">
                    <div class="account-label">{{accountData.title}}</div>
                    <div class="account-balance">可用余额:<span>{{accountData.balance|moneyFrt}}</span><i class="account-icon"></i></div>
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
            <div class="product-tip" v-if="product.pTitle == '月月红'">
                <sn-cell title="年利率">{{product.rate|percentFrt}}</sn-cell>
                <sn-cell title="每月领取利息">{{!!monthInterest?monthInterest:monthInterest|moneyFrt(1)}}</sn-cell>
                <sn-cell :title="`${num2Chinese(product.dueTime)}年累计利息`">{{!!yearInterest?yearInterest:yearInterest|moneyFrt(1)}}</sn-cell>                
            </div>
        </div>
        <div class="buy-btn">
            <sn-button @SnButtonClick="confirmPay" :showLoading="payLoading">{{payText}}</sn-button>
        </div>
    </div>
</template>
<script>
import { Popup,Panel } from '../../baseComponents'
import * as math from 'mathjs'
import { SnMoney } from 'biscomponents'
import { WealthPayModel } from '../../handler/model'
import { getServerData,openNativePage,getSignData,openRouterByValue,backRouterByValue,num2Cn,formatSelectList,getBusinessData,setBusinessData } from '../../handler/handler'
import { SnCell,SnButton } from 'components'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { throttle, goBackPage_new, initTitleMenu, showToast } from 'sslib/common/extend'
export default {
    data(){
        return{
            accountData:{},
            showActionSheetSelect: false,
            descriptionText:'选择付款方式',
            accountList:[],
            monthInterest: 0,
            yearInterest: 0,
            buyAmount:'',
            subTitle:['买入'],
            product:{},
            chooseIndex:0,
            showPopup: false,
            accountLoading: false,
            payLoading: false,
            payText: '确定'
        }
    },
    components:{
        SnMoney,SnCell,SnButton,Popup,Panel
    },
    computed:{
        interestDesc(){
            if(!!~this.product.pName.indexOf('月月红')){
                return '月月取息'
            }else if(!!~this.product.pName.indexOf('随心存')){
                return '按档计息'
            }else{
                return '月月取息'
            }
        }
    },
    created(){
        let _this = this;
        initTitleMenu(_this.subTitle);
        _this.init();
    },
    methods:{
        /**
         * 数据初始化，注册返回事件
         */
        init(){
            let _this = this;
            notifyAppBackEvent(); //调用app，通知返回事件
            registerHandler('notifyAppBack', function (data) {//点击app返回事件
                throttle(function () {
                    backRouterByValue("wealthdetail",_this.$route.query,_this);
                }.bind(this));
            })
            if(!!_this.$route.query.product){
                _this.product = JSON.parse(decodeURIComponent(_this.$route.query.product));
            }
            if(!!getBusinessData('selectListData')){
                _this.accountList = getBusinessData('selectListData');
            }else{
                _this.queryAccountList();
            }
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
                    if(_this.accountList.length){
                        setBusinessData('selectListData',_this.accountList);
                    }else{
                        showToast('暂无可用账户，无法进行理财产品购买','middle');
                    }
                }
            } catch (error) {
                console.log(error);
                _this.accountLoading = false;
            }
        },
        /**
         * 选择付款账号
         */
        chooseItem(index) {
            let _this = this;
            _this.chooseIndex = index;
            _this.accountData = _this.accountList[index];
            _this.showPopup = false;
        },
        selectAccount(){
            let _this = this;
            if(_this.accountList.length){
                _this.showPopup = true;
            }
        },
        cancelFun(){
            this.showPopup = false;
        },
        /**
         * 数据校验
         */
        validate(){
            let _this = this;
            if(!_this.accountList.length){
                showToast('暂无可用账户，无法进行理财产品购买','middle');
                return false;
            }
            if(!_this.buyAmount){
                showToast('请输入本金金额','middle');
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
            let payData = new WealthPayModel(Number(_this.buyAmount),
                                _this.accountData.account,
                                _this.product.pName,
                                _this.product.pCode,
                                {
                                    currency: _this.product.currency,
                                    period: _this.product.period,
                                    rate: _this.product.rate,
                                    startAmount: _this.product.start
                                },
                                timeStamp);
            //1.获取签名 2.安全键盘获取交易密码 3.调支付接口
            const data = {
                amount: Number(_this.buyAmount),
                payerAccount: _this.accountData.account,
                timeStamp:timeStamp
            }
            try {
                const result = await getSignData(data);
                if(!!result.data.signData){
                    payData.extraInfo.signData.sign = result.data.signData;
                    const pwdData = await openNativePage('IntentAction_PayPasswordActivity', [{ key: "isEncrypted", value: 1, type: "int" }],[{key: "result_key",value: "",type: "string"}]);
                    if(!!pwdData[0].value){
                        payData.pwd = pwdData[0].value;
                    }
                    _this.payText = "正在买入...";
                    _this.payLoading = true;
                    const payResult = await getServerData('wealth/wealthManage.buyFinancialProduct',payData,false);
                    _this.payLoading = false;
                    _this.payText = "确定";
                    let data = {};
                    if(payResult.code === 0 && !!payResult.voucherNo){//支付成功
                        data.status = 1;
                        data.text = '购买成功';
                        data.amount = Number(_this.buyAmount);
                        data.infoList = [
                            {title:'付款方式',value:_this.accountData.title},
                            {title:'产品',value:_this.product.pTitle}
                        ];
                    }else{//支付失败
                        data.status = 0;
                        data.text = '购买失败';
                        data.desc = payResult.desc;
                    }
                    openRouterByValue("result",{result:encodeURIComponent(JSON.stringify(data))},_this);
                }                
            } catch (error) {
                _this.payLoading = false;
                _this.payText = "确定";
                console.log(error);
            }
        },

        /**
         * 数字转中文
         */
        num2Chinese(num){
            return num2Cn(num);
        },
        /**
         * 乘法
         */
        mathMultiply(a, b) {
            return math.format(math.chain(math.bignumber(a)).multiply(math.bignumber(b)).done());
        },
        /**
         * 除法
         */
        mathDivide(a,b){
            return math.format(math.chain(math.bignumber(a)).divide(math.bignumber(b)).done());
        },
        /**
         * 计算利息
         */
        calculateInterest(amount,month){
            let _this = this;
            const rate = _this.mathDivide(_this.product.rate,100000);
            let yearInterest = _this.mathMultiply(_this.mathMultiply(amount,rate),_this.product.dueTime);
            let monthInterest = _this.mathDivide(_this.mathMultiply(_this.mathMultiply(amount,rate),_this.product.dueTime),_this.mathMultiply(_this.product.dueTime,12));
            return !month?Number(math.round(yearInterest,2)).toFixed(2):Number(math.round(monthInterest,2)).toFixed(2)
        }
    },
    watch:{
        buyAmount(newVal,oldVal){
            let _this = this;
            if(!!newVal){
                _this.monthInterest = _this.calculateInterest(_this.mathDivide(newVal,100),1);
                _this.yearInterest = _this.calculateInterest(_this.mathDivide(newVal,100));
            }else{
                _this.monthInterest = 0;
                _this.yearInterest = 0;
            }
        },
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
    @import '~components/style/common.less';
    .wealth-buy{
        background: @color-bg;
        padding: 0 .3rem;
        .product-label{
            display: flex;
            flex-direction: column;
            text-align: center;
            .product-name{
                font-size: .5rem;
                height: 1.5rem;
                line-height: 1.5rem;
            }
            .product-desc{
                display: inline-flex;
                padding-bottom: .3rem;
                .save-date{
                    border-right: 1px solid #ccc;
                    border-left: 1px solid #ccc;
                }
                span{
                    flex: 1;
                }
            }
        }  
        .product-input{
            background: @color-white;
            border-radius: .1rem;
            padding: .3rem;
            .buy-title{
                padding-top: .3rem;
                display: flex;
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
            .buy-account{
                .account{
                    display: flex;
                    width: 100%;
                    justify-content: space-between;
                    align-items: center;
                    padding: .3rem 0;
                    border-bottom: 1px solid @color-bg;
                    .account-balance{
                        display: inline-flex;
                        align-items: center;
                        .account-icon{
                            display: inline-block;
                            width: .45rem;
                            height: .45rem;
                            background: url('../../../resource/img/icon_narrow_right.png') no-repeat right;
                            background-size: .45rem .45rem;
                            cursor: pointer;
                        }
                    }
                }
            } 
            .product-tip{
                padding: .3rem 0;
            }
        }              
        .overflow-show{
            .weui-cell{
                padding: .24rem 0 !important;
                border-bottom: 1px solid @color-bg;
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
       
        .sn-cell:before{
            border-bottom: none !important;
        } 
        .sn-cell{
            padding: .24rem 0 0 0 !important;
            .sn-cell-label{
                width: 2.5rem !important;
            }
        }
        .buy-btn{
            flex: 1;
        }
    }
</style>
