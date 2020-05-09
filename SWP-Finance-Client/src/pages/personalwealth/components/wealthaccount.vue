<template>
    <div class="wealth-account">
        <SnLoading v-if="pageLoading"></SnLoading>
        <div v-if="!pageLoading">
            <div class="account-card">
                <div class="account-info">
                    <span class="amount-label">总金额<i @click="moneyFlag = !moneyFlag" class="money-eye" :class="!moneyFlag?'money-closed':''"></i></span>
                    <span class="amount-num" v-if="moneyFlag"><i class="money-tip">¥</i>{{totalAmount|moneyFrt(1)}}</span>
                    <span class="amount-num" v-else>******</span>
                </div>
                <div class="income-info">
                    <div class="day-income">
                        <label>昨日收益</label>
                        <span v-if="moneyFlag">0.00</span>
                        <span v-else>******</span>
                    </div>
                    <div class="total-income">
                        <label>预计收益</label>
                        <span v-if="moneyFlag">{{totalInterest|moneyFrt(1)}}</span>
                        <span v-else>******</span>
                    </div>
                </div>
            </div>
            <div>
                <!-- <div class="trade-record" @click="showRecord">
                    <span>交易记录</span>
                    <i class="trade-icon"></i>
                </div> -->
                <div class="profit-card"  v-if="!noInfo" v-for="finance in financeList" @click="redeemWealth(finance)">
                    <wealth-card :financeData="finance"></wealth-card>
                </div>
            </div>
            <SnEmpty v-if="noInfo" :isShow="true" icon="no-product" tip="您还没有购买理财产品哦~"></SnEmpty>
        </div>     
    </div>
</template>
<script>
import * as math from 'mathjs'
import {openRouterByValue,openNativePage,backRouterByValue,getBusinessData,setBusinessData,getServerData,formatProduct,getSignData } from '../../handler/handler'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { throttle, goBackPage, initTitleMenu } from 'sslib/common/extend'
import WealthCard from './wealthcard'
import { SnEmpty,SnLoading } from 'components'
import {WealthRedeemModel} from '../../handler/model'
export default {
    data(){
        return{
            financeList: [],
            subTitle: ['个人财富'],
            totalAmount: 0,
            totalInterest: 0,
            pageLoading: false,
            noInfo: false,
            moneyFlag: true
        }
    },
    components:{
        WealthCard,SnEmpty,SnLoading
    },
    created(){
        let _this = this;
        initTitleMenu(_this.subTitle);
        _this.init();
    },
    methods:{
        /**
         * 数据初始化
         */
        init(){
            let _this = this;
            notifyAppBackEvent(); //调用app，通知返回事件
            registerHandler('notifyAppBack', function (data) {//点击app返回事件
                throttle(function () {
                    goBackPage('sswbv_close_browser');
                }.bind(this));
            });
            if(!!_this.$route.query.tradeFlag){
                if(!!getBusinessData('financeData')){
                    _this.financeList = getBusinessData('financeData').financeList;
                    _this.totalAmount = getBusinessData('financeData').totalAmount;
                    _this.totalInterest = getBusinessData('financeData').totalInterest;
                }else{
                    _this.noInfo = true;
                }
            }else{
                if(!!getBusinessData('financeData')){
                    _this.financeList = getBusinessData('financeData').financeList;
                    _this.totalAmount = getBusinessData('financeData').totalAmount;
                    _this.totalInterest = getBusinessData('financeData').totalInterest;
                }else{
                    _this.queryFinancialPosition();
                }                
            }
        },
        /**
         * 查询持仓列表
         */
        async queryFinancialPosition(){
            let _this = this;
            const data = {
                cpyId: -1,
                businessType: 1,
                pType: 1
            }
            try {
                _this.pageLoading = true;
                const result = await getServerData('wealth/wealthManage.queryFinancialPosition',data);
                _this.pageLoading = false;
                if(result.code === 0){
                    _this.totalAmount = result.totalAmount;
                    if(!!result.financeList&&result.financeList.length){
                        _this.financeList = result.financeList.map(product => {
                            _this.totalInterest = _this.mathAdd(_this.totalInterest,product.prospective);
                            return formatProduct(product)
                        });
                        setBusinessData('financeData',{financeList:_this.financeList,totalAmount:_this.totalAmount,totalInterest:_this.totalInterest});
                    }else{
                        _this.noInfo = true;
                    }
                }else{
                    _this.noInfo = true;
                }
            } catch (error) {
                _this.pageLoading = false;
                _this.noInfo = true;
                console.log(error);
            }
        },
        /**
         * 加法
         */
        mathAdd(a,b){
            return Number(math.format(math.chain(math.bignumber(a)).add(math.bignumber(b)).done()));
        },
        /**
         * 查看交易记录
         */
        showRecord(){
            let _this = this;
            openRouterByValue('traderecord','',_this);
        },
        /**
         * 理财赎回
         */
        redeemWealth(finance){
            let _this = this;
            openRouterByValue("redeemdetail",{finance:encodeURIComponent(JSON.stringify(finance))},_this);
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .wealth-account{
        background: @color-bg;
        .account-card{
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: @fs-mob-small;
            background: url('../../../resource/img/wealth/personal_wealth_bg.png') no-repeat center;
            height: 4rem;
            background-size: cover;
            color: @color-white;
            .account-info{
                text-align: center;
                margin-bottom: .3rem;
                display: inline-flex;
                align-items: center;
                flex-direction: column;
                .amount-label{    
                    display: inline-flex;
                    align-items: center;
                     .money-eye{
                        display: inline-block;
                        background: url('../../../resource/img/accountlist/eye_open.png') no-repeat center;
                        width: 0.36rem;
                        height: 0.36rem;
                        background-size: 0.36rem 0.36rem;
                        cursor: pointer;
                        margin-left: .1rem;
                    }
                    .money-closed{
                        background: url('../../../resource/img/accountlist/eye_close.png') no-repeat center;
                        background-size: 0.36rem 0.36rem;
                    }
                }
                .amount-num{
                    font-size: @fs-mob-bigger;
                    font-weight: bolder;
                    height: 1.2rem;
                    line-height: 1.2rem;
                    .money-tip{
                        font-size: @fs-mob-big;
                    }
                }
            }
            .income-info{
                display: flex;
                .day-income,.total-income{
                    flex: 1;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                }
            }
        }
        .trade-record{
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: @color-white;
            height: 1rem;
            margin: -.5rem .3rem .3rem .3rem;
            border-radius: .1rem;
            padding: 0 .3rem;
            .trade-icon{
                display: inline-block;
                width: .45rem;
                height: .45rem;
                background: url('../../../resource/img/icon_narrow_right.png') no-repeat center;
                background-size: .45rem .45rem;
                cursor: pointer;
            }
        }
        .profit-card{
            margin: 0 .3rem .3rem .3rem;
            background-color: @color-white;
            border-radius: .1rem;
        }
        .empty-comp{
            position: relative;
            padding-top: 2rem;
        }
    }
</style>
