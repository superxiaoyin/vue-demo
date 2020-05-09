<template>
    <div class="buyconfirm-warp">
        <div class="list-warp" v-if="list.length !== 0">
            <div class="order-list" v-for="(item,idx) in list" :key="idx">
                <div class="fl">
                    <h2>{{item.orderName}}</h2>
                    <p>{{item.validTime}}</p>
                </div>
                <div class="fr">
                    <div class="price">-¥{{item.amount/100}}</div>
                    <p>{{item.orderStatus == '10' ? '待付款' : item.orderStatus == '11' ? '待取票':item.orderStatus == '12' ? '出票成功':item.orderStatus == '13' ? '订单失效':item.orderStatus == '14' ? '支付中':item.orderStatus == '15' ? '出票失败': item.orderStatus == '00' ? '支付成功' : item.orderStatus == '01' ? '支付失败': item.orderStatus == '02' ? '撤消成功': item.orderStatus == '03' ? '部分退货' : item.orderStatus == '04' ? '全部退货': item.orderStatus == '05' ? '预授权确认成功':item.orderStatus == '06' ? '预授权撤销成功':item.orderStatus == '99' ? '交易超时' : '支付失败'}}</p>
                </div>
            </div>
        </div>
        <div class="list-warp  order-no" v-else>
             <p>~暂无订单数据~</p>
        </div>
    
       <Tabbar></Tabbar>
    </div>
</template>

<script>
import {openRouterByValue,backRouterByValue, getBusinessData,setBusinessData, getServerDataH5} from '../../handler/handler'
import { getUrlParams, throttle, showConfirm, showToast } from 'sslib/common/extend'
import Tabbar from './Tabbar'
var urlParams = getUrlParams();
var phone = urlParams.phone;
export default {
    name:'orderlist',
    components: {
       Tabbar
    },
    data() {
        return {
           list:[]
        }
    },
    created() {
        let _this = this;
        // if(!!_this.$route.query.id){
        //     let id = decodeURIComponent(_this.$route.query.id);
        //     _this.list = getBusinessData(id)
        // }
        _this.init();
    },
    methods: {
        init() {
            let _this = this;
            let parame = {
                phone:phone
            }
            getServerDataH5('/yqt/buyTicket/buyTicket.queryOrderList',parame,'POST').then(res => {
                console.log(res)
                if(res.code == 0){
                    _this.list = res.ticketOrderList
                }
            })
        }
    }
}
</script>

<style lang="less" scoped> 
    @import (reference) "~components/style/common";
    .list-warp{
        margin-top: 0.16rem;
        padding-bottom: 56px;
    }
    .order-list{
        background-color: @color-white;
        padding: 0.24rem;
        border-bottom: 1px solid #EAEAEA;
        display: flex;
        .fl{
            flex: 3;
            h2{
                font-size: 0.3rem;
                margin-bottom: 8px;
                color: #333
            }
            p{
                font-size: 0.26rem;
                color: #999;
            }
        }
        .fr{
            flex: 1;
            text-align: right;
            .price{
                font-size: 0.3rem;
                margin-bottom: 8px;
                color: #333
            }
            p{
                font-size: 0.26rem;
                color: #FF6A56;
            }
        }
    }
    .order-no{
        text-align: center;
        font-size: .4rem;
        color: #999;
        padding-top: 1rem;
    }
    
</style>
