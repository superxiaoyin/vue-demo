<template>
    <div class="prestore">
        <charge-card ref="prestore" :historyType="historyType" :chargeData="storeInfo" :chargeMoney="storeMoney" :chargeType="chargeType" chargeKey="charge" submitText="立即充值">
            <div class="store-info" slot="charge-info">
                <div class="info-list" v-for="item in storeList">
                    <sn-cell v-if="item.type=='money'" :title="item.title">{{item.value|moneyFrt}}</sn-cell>
                    <sn-cell v-else :title="item.title" :value="item.value"></sn-cell>
                </div>  
            </div>   
            <div class="store-input" slot="charge-input">
                <div class="store-label">充值金额</div>
                <sn-money class="store-money" placeholder="请输入充值金额" v-model="storeMoney" text-align="left"></sn-money>
            </div>         
        </charge-card>      
    </div>
</template>
<script>
import ChargeCard from './chargecard'
import {SnCell,SnButton} from 'components'
import { SnMoney } from 'biscomponents'
import {chargeData,openRouterByValue,backRouterByValue} from '../../handler/handler'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import {showToast,initTitleMenu,openPage,getUrlParams,throttle, goBackPage } from 'sslib/common/extend'
let urlParams = getUrlParams();
let chargeType = Number(urlParams.chargeType || 0);
export default {
    data(){
        return{
            storeMoney: '',
            storeList:[],
            storeInfo:'',
            chargeType: chargeType,
            subTitle: '',
            historyType: 0,
        }
    },
    components:{
        SnCell,SnMoney,SnButton,ChargeCard
    },
    created(){
        let _this = this;
        _this.subTitle=chargeData[_this.chargeType].title+'缴纳';
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
                _this.storeInfo = JSON.parse(decodeURIComponent(_this.$route.query.feeInfo));
            }
            if(!!_this.$route.query.historyType){
                _this.historyType = Number(_this.$route.query.historyType);
            }
            // if(_this.chargeType === 2){//电费不显示余额和欠费金额
            //     _this.storeList = [
            //         {title:'缴费单位',value:_this.storeInfo.institutionName},
            //         {title:'缴费户号',value:_this.storeInfo.account},
            //         {title:'户名',value:_this.storeInfo.name}
            //     ];
            // }else{
            _this.storeList = [
                {title:'缴费单位',value:_this.storeInfo.institutionName},
                {title:'缴费户号',value:_this.storeInfo.account},
                {title:'户名',value:_this.storeInfo.name},
                {title:'当前可用余额',value:_this.storeInfo.balance,type:'money'},
                {title:'当前欠费金额',value:_this.storeInfo.owe,type:'money'}
            ];
            // }
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
        /**
         * 刷新
         */
        refresh(){
            let _this = this;
            _this.init();
        }
    }
}
</script>
<style lang="less">
    @import '~components/style/common.less';
    .prestore{
        background: @color-bg;
        padding: .3rem;
        .sn-cell:before{
            border-bottom: none !important;
        } 
        .store-info{
            background: @color-white;
            padding-top: .15rem;
            border-top-left-radius: .1rem;
            border-top-right-radius: .1rem;
            .sn-cell{
                padding: 0 .3rem .24rem .3rem !important;
                .sn-cell-label{
                    width: 2.2rem !important;
                }
            }
            .info-list{
                 &:first-child{
                    padding-top: .24rem !important;
                }
            }
        }
        .store-input{
            background: @color-white;
            .sn-cell{
                padding: 0 .3rem .24rem .3rem !important;
                .sn-cell-label{
                    width: 2.5rem !important;
                }
            }
            .store-label{
                padding: .24rem .3rem 0 .3rem;
            }
            .store-money{
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
    }
</style>
