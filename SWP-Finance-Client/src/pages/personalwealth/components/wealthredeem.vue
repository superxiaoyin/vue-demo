<template>
    <div class="wealth-redeem">
        <div class="redeem-title">
            <i class="redeem-icon"></i>
            <span class="wealth-title">{{finance.pTitle}}</span>
        </div>
        <div class="redeem-info">
            <sn-cell title="赎回金额" value-align="left">{{finance.amount|moneyFrt(1)}}</sn-cell>
            <sn-cell title="收款账户" value-align="left">泸州银行({{finance.account.substr(-4)}})</sn-cell>
        </div>
        <div class="redeem-btn">
            <sn-button :showLoading="loadingFlag" @SnButtonClick="confirmRedeem">{{redeemText}}</sn-button> 
        </div>
    </div>
</template>
<script>
import { openRouterByValue,backRouterByValue,getSignData,openNativePage,getServerData } from '../../handler/handler'
import { WealthRedeemModel } from '../../handler/model'
import { SnCell,SnButton } from 'components'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { throttle, initTitleMenu, showToast, moneyStringFixTwo } from 'sslib/common/extend'
export default {
    data(){
        return{
            finance:{},
            loadingFlag: false,
            redeemText: "确定赎回",
            subTitle:["赎回"]
        }
    },
    components:{
        SnCell,SnButton
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
                    backRouterByValue("redeemdetail",_this.$route.query,_this);
                }.bind(this));
            })
            if(!!_this.$route.query.finance){
                _this.finance = JSON.parse(decodeURIComponent(_this.$route.query.finance));
            }
        },
        /**
         * 确定赎回
         */
        async confirmRedeem(){
            let _this = this;
            let timeStamp = new Date().getTime()+"";
            const redeemData = new WealthRedeemModel(_this.finance.bankFinanceNo,
                                        _this.finance.amount,
                                        _this.finance.account,
                                        _this.finance.pName,
                                        _this.finance.pCode,
                                        {
                                            currency:Number(_this.finance.currency),
                                            period: _this.finance.period,
                                            rate: _this.finance.rate,
                                            openAccDate: _this.finance.openAccDate,
                                            endTime: _this.finance.endTime,
                                            startAmount: _this.finance.startAmount
                                        },
                                        timeStamp);
            //1.获取签名 2.安全键盘获取交易密码 3.调赎回接口
            const data = {
                amount: Number(_this.finance.amount),
                payeeAccount: _this.finance.account,
                timeStamp:timeStamp
            }
            try {
                const result = await getSignData(data);
                if(!!result.data.signData){
                    redeemData.extraInfo.signData.sign = result.data.signData;
                    const pwdData = await openNativePage('IntentAction_PayPasswordActivity', [{ key: "isEncrypted", value: 1, type: "int" }],[{key: "result_key",value: "",type: "string"}]);
                    if(!!pwdData[0].value){
                        redeemData.pwd = pwdData[0].value;
                    }
                    _this.redeemText = "正在赎回...";
                    _this.loadingFlag = true;
                    const redeemResult = await getServerData('wealth/wealthManage.redeemFinancialProduct',redeemData,false);
                    _this.loadingFlag = false;
                    _this.redeemText = "确定赎回";
                    let data={};
                    if(redeemResult.code === 0&&!!redeemResult.voucherNo){
                        data.status = 1;
                        data.text = '赎回成功';
                        data.amount = redeemResult.principal+redeemResult.interest;
                        data.info = `本金: ${moneyStringFixTwo(redeemResult.principal)}      利息: ${moneyStringFixTwo(redeemResult.interest)}`;
                        data.infoList = [
                            {title:'收款账户',value: `泸州银行(${_this.finance.account.substr(-4)})`},
                            {title:'产品',value:_this.finance.pTitle}
                        ];
                    }else{
                        data.status = 0;
                        data.text = '赎回失败';
                        data.desc = redeemResult.desc;
                    }
                    openRouterByValue("result",{result:encodeURIComponent(JSON.stringify(data))},_this);
                }
            }catch(error){
                _this.loadingFlag = false;
                _this.redeemText = "确定赎回";
                console.log(error);
            }
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .wealth-redeem{
        background: @color-bg;
        .redeem-title{
            padding: .3rem .3rem .1rem .3rem;
            display: flex;
            align-items: center;
            .wealth-title{
                padding-left: .1rem;
                font-weight: bolder;
            }
            .redeem-icon{
                display: inline-block;
                width: .44rem;
                height: .44rem;
                background: url('../../../resource/img/wealth/icon_redeem.png') no-repeat center;
                background-size: .44rem .44rem;
            }
        }
        .redeem-info{
            background: @color-white;
            .sn-cell:before{
                border-bottom: none !important;
            }
            .sn-cell{
                margin: 0 .3rem;
                padding: .24rem 0;
                border-bottom: 1px solid @color-bg;
            } 
        }
        .redeem-btn{
            padding: 0 .3rem;
        }
    }
</style>
