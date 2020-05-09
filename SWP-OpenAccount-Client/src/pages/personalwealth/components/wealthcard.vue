<template>
    <div class="wealth-card">
        <div class="wealth-label">
            <span>{{financeData.pTitle}}</span>
            <span class="label-date">{{financeData.endTime|dateFrt({serverFormat:'timestamp',format:'YYYY.MM.DD'})}}到期</span>
        </div>
        <div class="welath-info">
            <div class="info-money">
                <span class="money-value">{{financeData.amount|moneyFrt(1)}}</span>
                <label class="money-title">持有金额</label>  
            </div>  
            <div class="info-profit">
                <span class="profit-value">{{financeData.prospective|moneyFrt(1)}}</span>
                <label class="profit-title">预计收益</label>  
            </div>  
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    props:{
        financeData:{
            type:Object,
            default:{},
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .wealth-card{
        display: flex;
        flex-direction: column;
        padding: 0 .3rem;
        background: url('../../../resource/img/wealth/icon_profit.png') no-repeat 100% 100%;
        background-size: 25%;
        .wealth-label{
            display: inline-flex;
            justify-content: space-between;
            align-items: center;
            padding: .24rem 0;
            border-bottom: 1px solid @color-bg;
        }
        .welath-info{
            display: inline-flex;
            padding: .48rem 0;
            .info-money,.info-profit{
                flex: 1;
                display: inline-flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .profit-value{
                font-size: @fs-mob-big;
                color: @color-yellow;
                font-weight: bolder;
            }
            .money-value{
                font-size: @fs-mob-big;
                font-weight: bolder;
            } 
        }
        .money-title,.profit-title,.label-date{
            color: @fc-info;
            font-size: @fs-mob-small;
        }
    }
</style>
