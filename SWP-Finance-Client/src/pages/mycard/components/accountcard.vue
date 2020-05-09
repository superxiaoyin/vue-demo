<template>
    <div class="account-card">
        <div class="card-item" :class="`card-item${cardData.cardType}`" @click="cardClick">
            <div class="card-info">
                <div class="info-left">
                    <i class="bank-icon"></i>
                    <span class="bank-name">{{cardData.bankName}}</span> 
                </div>
                <em class="info-right" v-if="showFlag" :class="`info-right${cardData.cardType}`">{{getAccountName(cardData.cardType)}}</em>
            </div>
            <div class="card-number"><span>****</span><span>****</span><span>****</span><span class="number">{{cardData.cardNumber.substr(-4)}}</span></div>
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
        cardData:{
            type:Object,
            default:{}
        },
        showFlag:{
            type:Boolean,
            default:true
        }
    },
    methods:{
        //获取账户名称
        getAccountName(flag){
            let name = '';
            if(flag === 10){
                name = '一类户'
            }else if(flag === 11){
                name =  'Ⅱ类户'
            }else if(flag === 12){
                name =  '三类户'
            }
            return name
        },
        cardClick(){
            let _this = this;
            _this.$emit("cardClick");
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .account-card{
        margin-bottom: .3rem;
        .card-item10{
            background: url('../../../resource/img/mycard/icon_bankcard_1.png') no-repeat center;
        }
        .card-item11,.card-item12{
            background: url('../../../resource/img/mycard/icon_bankcard_2.png') no-repeat center;
        }
        .card-item{
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            height: 3.5rem;
            background-size: cover;
            border-radius: .1rem;
            color: @color-white;
            padding: 0 .4rem;
            .card-info{
                display: inline-flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                .info-left{
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    .bank-icon{
                        display: inline-block;
                        height: .7rem;
                        width: .7rem;
                        background: url('../../../resource/img/mycard/icon_bank.png') no-repeat center;
                        background-size: .7rem .7rem;
                    }
                    .bank-name{
                        padding-left: .2rem;
                        font-size: .34rem;
                        font-weight: bold;
                    }
                }
                .info-right{
                    padding: .1rem .2rem;
                    background: @color-white;
                    border-radius: .1rem;
                    font-size: @fs-mob-smaller;
                }
                .info-right10{
                    color: @color-blue;
                }
                .info-right11,.info-right12{
                    color: #3891FF;
                }
            }
            .card-number{
                font-size: @fs-mob-big;
                padding-top: .5rem;
                display: inline-flex;
                width: 100%;
                justify-content: space-between;
                .number{
                    font-weight: bold;
                }
            }
        } 
    }
</style>
