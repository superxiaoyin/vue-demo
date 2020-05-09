<template>
    <div class="wealth-product" :class="'product-bg'+pType">
        <div class="product-title">{{product.pTitle}}</div>
        <div class="product-info">
            <div class="rate">
                <span class="rate-num">{{product.rate|percentFrt}}</span>
                <span class="rate-title">年利率</span>
            </div>
            <div class="deadline">
                <span class="deadline-num">{{product.dueTime}}年</span>
                <span class="deadline-content">{{product.dueTime}}年存期 {{product.startAmount}}元起存</span>
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
        product:{
            type:Object,
            default:{}
        }
    },
    computed:{
        pType(){
            if(!!~this.product.pTitle.indexOf('月月红')){
                return 1
            }else if(!!~this.product.pTitle.indexOf('快乐金')){
                return 2
            }else{
                return 2
            }
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .product-bg1{
        background: url('../../../resource/img/wealth/month_red_bg.png') no-repeat center;
    }
    .product-bg2{
        background: url('../../../resource/img/wealth/happy_money_bg.png') no-repeat center;
    }
    .wealth-product{
        display: flex;
        flex-direction: column;
        height: 2.24rem;
        background-size: cover;
        border-radius: .1rem;
        padding-left: .6rem;
        .product-title{
            height: .54rem;
            line-height: .54rem;
        }
        .product-info{
            display: inline-flex;
            flex: 1;
            align-items: flex-end;
            padding-bottom: .35rem;
            .rate{
                display: inline-flex;
                flex-direction: column;
                flex: 1;
                .rate-num{
                    font-size: .54rem;
                }
                .rate-title{
                    font-size: .32rem;
                    color: @fc-label;
                }
            }
            .deadline{
                flex: 2;
                display: inline-flex;
                flex-direction: column;
                padding-left: 12%;
                font-size: .32rem;
                color: @fc-label;
            }
        }
    }
</style>
