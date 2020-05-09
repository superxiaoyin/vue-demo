<template>
    <div class="account-detail">
        <div class="account-card">
            <span class="amount-label">余额<i @click="moneyFlag = !moneyFlag" class="money-eye" :class="!moneyFlag?'money-closed':''"></i></span>
            <span class="amount-money" v-if="moneyFlag"><i class="money-tip">¥</i>{{accountData.accountBalance|moneyFrt(1)}}</span>
            <span class="amount-money" v-else>******</span>
        </div>
        <div class="account-btn">
            <div class="btn-charge" @click="deposit">
                <span class="charge-wrapper"><i class="charge-icon"></i>充值</span>
                <i class="more-icon"></i>
            </div>
            <div class="btn-withdraw" @click="withdraw">
                <span class="withdraw-wrapper"><i class="withdraw-icon"></i>提现</span>
                <i class="more-icon"></i>
            </div>
        </div>
        <div class="nostis">
            <p>目前暂支持以下银行充值和提现：</p>
            <ul>
                <li>交通银行</li>
                <li>工商银行</li>
                <li>光大银行</li>
                <li>兴业银行</li>
                <li>浦东发展银行</li>
            </ul>
        </div>
    </div>
</template>
<script>
import { SnButton } from 'components'
import { openRouterByValue,backRouterByValue } from '../../handler/handler'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge.js'
import { throttle, goBackPage, initTitleMenu, openPage, showConfirm, showToast, getUrlParams } from 'sslib/common/extend.js'
export default {
    data(){
        return{
            accountData: {},
            moneyFlag:true,
            subTitle:['Ⅱ类户'],
            phone:'',
        }
    },
    created(){
        let _this = this;
        _this.init();
    },
    components:{
        SnButton
    },
    methods:{
        init(){
            let _this = this;
            if(!!_this.$route.query.accountData){
                _this.accountData = JSON.parse(decodeURIComponent(_this.$route.query.accountData));
                _this.phone = _this.$route.query.phone;
            }
        },
        /**
         * 提现
         */
        withdraw(){
            let _this = this;
            _this.$route.query.operateType = 2;
            openRouterByValue('operate',_this.$route.query,_this);
        },
        /**
         * 充值
         */
        deposit(){
            let _this = this;
            _this.$route.query.operateType = 1;
            openRouterByValue('operatepay',_this.$route.query,_this);
        },
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .account-detail{
        background: @color-bg;
        .account-card{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 4rem;
            background: url('../../../resource/img/accountlist/account-bg-2.png') no-repeat center;
            background-size: cover;
            border-radius: .1rem;
            color: @color-white;
            margin: 0.3rem;
            .amount-label{
                display: flex;
                align-items: center;
                font-size: @fs-mob-small;
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
            .amount-money{
                font-size: @fs-mob-bigger;
                font-weight: bolder;
                height: 1.2rem;
                line-height: 1.2rem;
                .money-tip{
                    font-size: @fs-mob-big;
                }
            }
        }
        .account-btn{
            background: @color-white;
            padding: 0 .3rem;
            .btn-charge,.btn-withdraw{
                display: flex;
                justify-content: space-between;
                padding: .2rem 0;
                .more-icon{
                    display: inline-block;
                    width: .45rem;
                    height: .45rem;
                    background: url('../../../resource/img/icon_narrow_right.png') no-repeat center;
                    background-size: .45rem .45rem;
                    cursor: pointer;
                }
            }
            .charge-wrapper,.withdraw-wrapper{
                display: inline-flex;
                align-items: center;
            }
            .charge-icon{
                background: url('../../../resource/img/accountlist/icon_charge.png') no-repeat center;
            }
            .withdraw-icon{
                background: url('../../../resource/img/accountlist/icon_withdraw.png') no-repeat center;
            }
            .charge-icon,.withdraw-icon{
                margin-right: .1rem;
                display: inline-block;
                height: .54rem;
                width: .54rem;
                background-size: .54rem .54rem;
            }  
            .btn-charge{
                border-bottom: 1px solid @color-bg;
            }
        }
        .nostis{
            margin: 10px;
            p{
                font-size: 0.28rem;
                color: #333;
                margin-bottom: 10px;
            }
            li{
                font-size: .3rem;margin: 8px 0;
                color: #333
            }
        }

    }
</style>
