<template>
    <div class="settle-month">
        <charge-card ref="settlemonth" :chargeData="settleInfo" :historyType="historyType" :chargeMoney="settleMoney" :chargeType="chargeType" chargeKey="charge" submitText="立即缴费">
            <div class="settle-info" slot="charge-info">
                <div v-for="item in settleList">
                    <sn-cell class="settle-money" readonly v-if="item.type=='money'" :title="item.title" text-align="right">{{item.value|moneyFrt}}</sn-cell>
                    <sn-cell v-else :title="item.title" :value="item.value"></sn-cell>
                </div>
            </div>
            <div class="settle-input" slot="charge-input">
                <div class="pay-label">缴费金额</div>
                <sn-cell class="pay-money" readonly value-align="left">{{settleMoney|moneyFrt}}</sn-cell>
            </div>
        </charge-card>
    </div>
</template>
<script>
import ChargeCard from './chargecard'
import {SnCell,SnButton} from 'components'
import { SnMoney } from 'biscomponents'
import {chargeData,openRouterByValue,backRouterByValue,getSignData} from '../../handler/handler'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import {showToast,initTitleMenu,openPage,getUrlParams,throttle, goBackPage } from 'sslib/common/extend'
let urlParams = getUrlParams();
let chargeType = Number(urlParams.chargeType || 0);
export default {
    data(){
        return{
            settleMoney: '',
            settleList:[],
            chargeType: chargeType,
            subTitle: '',
            historyType: '',
            settleInfo:{}
        }
    },
    components:{
        SnCell,SnMoney,SnButton,ChargeCard
    },
    created(){
        let _this = this;
        _this.subTitle= chargeData[_this.chargeType].title+'缴纳';
        initTitleMenu([_this.subTitle,{name:'刷新',menuId:'but_2_0',type: 2,func:function(){_this.refresh();}}]);
        _this.init();
    },
    methods:{
        /**
         * 数据初始化
         */
        init(){
            let _this = this;
            if(!!_this.$route.query.feeInfo){
                _this.settleInfo = JSON.parse(decodeURIComponent(_this.$route.query.feeInfo));
            }
            if(!!_this.$route.query.historyType){
                _this.historyType = Number(_this.$route.query.historyType);
            }
            _this.settleList = [
                {title:'应缴金额',value:_this.settleInfo.owe,type:'money'},
                {title:'缴费单位',value:_this.settleInfo.institutionName},
                {title:'缴费户号',value:_this.settleInfo.account},
                {title:'户名',value:_this.settleInfo.name},
            ];
            _this.settleMoney = _this.settleInfo.owe;
            notifyAppBackEvent(); //调用app，通知返回事件
            registerHandler('notifyAppBack', function (data) {//点击app返回事件
                throttle(function () {
                    if(_this.historyType === 1){
                        backRouterByValue('history','',_this);
                    }else{
                        backRouterByValue('search',{userNo:_this.$route.query.userNo},_this);
                    }
                }.bind(this));
            })
        },
        refresh(){
            let _this = this;
            _this.init();
        }
    }
}
</script>
<style lang="less">
    @import '~components/style/common.less';
    .settle-month{
        background: @color-bg;
        padding: .3rem;
        .sn-cell:before{
            border-bottom: none !important;
        } 
        .settle-info{
            background: @color-white;
            padding-top: .15rem;
            border-top-left-radius: .1rem;
            border-top-right-radius: .1rem;
            .sn-cell{
                padding: 0 .3rem .24rem .3rem !important;
                .sn-cell-label{
                    width: 2.5rem !important;
                }
            }
            .settle-money{
                padding-top: .24rem !important;
                .sn-cell__ft{
                    font-weight: bold;
                    color: @color-blue !important;
                }
            }
        }
        .settle-input{
            background: @color-white;
            .sn-cell{
                padding: 0 .3rem .24rem .3rem !important;
                .sn-cell-label{
                    width: 2.5rem !important;
                }
            }
            .pay-label{
                padding: .24rem .3rem 0 .3rem;
            }
            .pay-money{
                padding-top: .24rem !important;
                .sn-cell__ft{
                    font-size: @fs-mob-big !important;
                    font-weight: bold;
                }
            }
        }
        .charge-record{
            text-align: center;
            padding-top: 1rem;
            color: #3891FF;
        } 
    }
</style>
