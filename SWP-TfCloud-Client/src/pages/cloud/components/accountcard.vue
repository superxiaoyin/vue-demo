<template>
    <div class="account-card">
        <div class="del"  @click="delClick(cardData.cardId)"><img src="../../../resource/img/dels.png"></div>
        <div class="card-item" :class="`card-item${cardData.cardType}`" @click="cardClick">
            <div class="card-info">
                <div class="info-left">
                    <i class="bank-icon"></i>
                    <span class="bank-name">{{cardData.bankName}}</span> 
                    <div v-if="!pwdStat" class="cobyOrderSn" :data-clipboard-text="cardData.cardNumber" @click="copyLink">复制卡号</div>
                </div>
                <em class="info-right" v-if="showFlag" :class="`info-right${cardData.cardType}`">{{getAccountName(cardData.cardType)}}</em>
            </div>
            <div class="card-number" v-if="pwdStat"><span>****</span><span>****</span><span>****</span><span class="number">{{cardData.cardNumber.substr(-4)}}</span></div>
            <div class="card-number" v-else><span class="number">{{cardData.cardNumber}}</span></div>
        </div>
    </div>
</template> 
<script>
import ClipboardJS from 'clipboard'
import { throttle, showToast } from 'sslib/common/extend'
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
        },
        pwdStat:{
            type:Boolean,
            default:true
        }
    },
    methods:{
        //获取账户名称
        getAccountName(flag){
            let name = '';
            if(flag === 10){
                name = 'Ⅰ类户'
            }else if(flag === 11){
                name =  'Ⅱ类户'
            }else if(flag === 12){
                name =  'Ⅲ类户'
            }
            return name
        },
        cardClick(){
            let _this = this;
            _this.$emit("cardClick");
        },
        delClick(id){
            this.$emit("delClick",id);
        },
        copyLink() {
            let _this = this;
            var copy = ClipboardJS.isSupported()
            console.log("点击复制", copy);
            let clipboard = new ClipboardJS('.cobyOrderSn');
            clipboard.on('success', function (e) {
                console.log(e);
                showToast('复制成功')
                // 释放内存
                clipboard.destroy()
            });
            clipboard.on('error', function (e) {
                console.log(e);
            });
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .cobyOrderSn{
        margin-left: 10px;
        border:1px solid #fff;
        border-radius: 30px;
        padding: 0 .2rem;
        font-size: 0.28rem;
        margin-top: 5px;
    }
    .account-card{
        margin-bottom: .3rem;
        position: relative;
        .del{
            position: absolute; right: 10px;top: 10px;
            img{width: 16px;}
        }
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
            height: 4rem;
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
