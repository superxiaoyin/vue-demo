<template>
    <div class="redeem-detail">
        <div class="detail-desc">
            <div class="detail-top">
                <label>{{finance.pTitle|'月月红'}}</label>
                <span class="amount-title">持有金额</span>
                <span class="amount-num"><i class="money-tip">¥</i>{{finance.amount|moneyFrt(1)}}</span>
            </div>
            <div class="detail-middle">
                <div class="total-income">
                    <label>预计收益</label>
                    <span class="income-num">{{finance.prospective|moneyFrt(1)}}</span>
                </div>
                <div class="date-due">
                    <label>到期日</label>
                    <span class="date">{{finance.endTime|dateFrt({serverFormat:'timestamp',format:'YYYY.MM.DD'})}}</span>
                </div>
            </div>
            <div class="detail-bottom">
                <sn-cell title="交易类型" value="理财产品购买"></sn-cell>
                <sn-cell title="购买账号">{{finance.account}}</sn-cell>
                <sn-cell title="存款期限">{{finance.period}}年</sn-cell>
                <sn-cell title="利率">{{finance.rate|percentFrt}}</sn-cell>
            </div>  
        </div>
        <sn-button @SnButtonClick="redeem">赎回</sn-button> 
    </div>
</template>
<script>
import { openRouterByValue, backRouterByValue } from '../../handler/handler'
import { SnCell,SnButton } from 'components'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { throttle, initTitleMenu, showToast } from 'sslib/common/extend'
export default {
    data(){
        return{
            finance: {},
            subTitle: ["持仓详情"]
        }
    },
    components:{
        SnButton,SnCell
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
                    backRouterByValue("wealthaccount","",_this);
                }.bind(this));
            })
            if(!!_this.$route.query.finance){
                _this.finance = JSON.parse(decodeURIComponent(_this.$route.query.finance));
            }
        },
        /**
         * 赎回
         */
        redeem(){
            let _this = this;
            openRouterByValue("wealthredeem",_this.$route.query,_this);
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .redeem-detail{
        padding: .3rem;
        background: @color-bg;
        .detail-desc{
            background: @color-white;
            padding: .3rem;
            border-radius: .1rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .detail-top{
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                .amount-title{
                    color: @fc-info;
                    font-size: @fs-mob-small;
                    margin-top: .3rem;
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
            .detail-middle{
                display: flex;
                padding: .3rem 0;
                border-bottom: 1px solid @color-bg;
                .date-due,.total-income{
                    flex: 1;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                }
                .income-num{
                    color: @color-blue;
                    font-size: .34rem;
                    font-weight: bolder;
                    padding-top: .15rem;
                }
                .date{
                    font-weight: bolder;
                    font-size: .34rem;
                    padding-top: .15rem;
                }
            }
            .detail-bottom{
                padding-top: .3rem; 
                .sn-cell:before{
                    border-bottom: none !important;
                } 
                .sn-cell{
                    padding: .24rem 0 0 0 !important;
                    .sn-cell-label{
                        width: 2.5rem !important;
                    }
                }
            }
        }
    }
</style>
