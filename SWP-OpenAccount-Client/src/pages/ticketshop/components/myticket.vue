<template>
    <div class="buyconfirm-warp">
        <tab custom-bar-width="60px">
            <tab-item selected @on-item-click="tabs">全部</tab-item>
            <tab-item @on-item-click="tabs">待付款</tab-item>
            <tab-item @on-item-click="tabs">待取票</tab-item>
            <tab-item @on-item-click="tabs">已过期</tab-item>
        </tab>

        <div class="myticket" v-if="list.length !== 0">
            <div class="myticket-li" v-for="(item, idx) in list" :key="idx" v-if="item.orderStatus == '10' || item.orderStatus == '11' || item.orderStatus == '13' || item.orderStatus == '00' || item.orderStatus == '01'">
                <div class="header">
                    <div class="fl">订单编号:{{item.orderNo}}</div>
                    <div class="fr">{{item.orderStatus == '10' ? '待付款' : item.orderStatus == '11' ? '待取票' : item.orderStatus == '13' ? '已过期' : item.orderStatus == '00' ? '支付成功' : item.orderStatus == '01' ? '支付失败':'支付失败'}}</div>
                </div>
                <div class="prod">
                    <div class="fl">
                        <img :src="item.bannerItem" alt="">
                    </div>
                    <div class="fr">
                        <h2>{{item.orderName}}</h2>
                        <div class="pirce">
                            <h3>¥{{item.amount/100}}</h3>
                            <div class="num">
                                x{{item.ticketCount}}
                            </div>
                        </div>
                        <div class="buy" v-if="item.orderStatus == '13'" @click="topay(item.ticketId)">再次购买</div>
                        <div class="buy buy-pay" v-if="item.orderStatus == '10'" @click="toBuyPay(item.orderNo)">在线支付</div>
                        <div class="buy" v-if="item.orderStatus == '11'" @click="toPayCode(item.orderNo,item)">查看取票码</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="myticket order-no" v-else>
            <p>~暂无订单数据~</p>
        </div>

       <Tabbar></Tabbar>
    </div>
</template>

<script>
import { Tab, TabItem  } from 'vux'
import {openRouterByValue,backRouterByValue, getBusinessData,setBusinessData, getServerDataH5,getLocalData,deleteLocalData} from '../../handler/handler'
import {getUrlParams, throttle, showConfirm, showToast } from 'sslib/common/extend'
import Tabbar from './Tabbar'
var urlParams = getUrlParams();
var phone = urlParams.phone;
export default {
    name:'pay',
    components: {
        Tabbar,
        Tab,
        TabItem
    },
    data() {
        return {
           list:[],
           oldList:[],
           tabid:0,
           stats:false
        }
    },
    created() {
        let _this = this;
        let userinfo = getLocalData(phone)
        if(userinfo){
            setBusinessData(phone,userinfo)
            deleteLocalData(phone)
        }
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
                let dataList = res.ticketOrderList
                if(res.code == 0){
                    _this.list = dataList
                    _this.oldList = dataList
                }
                
            })
        },
        filterList(list,stat){
            let newList = []
            for(let i = 0;i<list.length;i++){
                if(list[i].orderStatus == stat){
                    newList.push(list[i])
                }
            }
            console.log(newList)
            return newList
        },
        tabs(index){
            let _this = this
            _this.tabid = index
            let oldList = _this.oldList
            let list = []
            if(index == 1){
                let datas =  _this.filterList(oldList,'10')
                list = datas
            }else if(index == 2){
                let datas =  _this.filterList(oldList,'11')
                list = datas
            }else if(index == 3){
                let datas =  _this.filterList(oldList,'13')
                list = datas
            }else{
                list = oldList
            }
            _this.list = list
        },
        topay(id){
            openRouterByValue('detail',{ticketId:encodeURIComponent(id)},this)
        },
        toBuyPay(orderNo){
            let _this = this
            let parame = {
                orderNo:orderNo,
                phone:phone
            }
            throttle(function () {
                let getuserinfo = getBusinessData(phone)
                getServerDataH5('/yqt/buyTicket/buyTicket.getPlainAndSign',parame,'POST').then(res => {
                    console.log(res)
                    if(res.code == 0){
                        let reg = /^(\d{4})\d+(\d{4})$/
                        res['accountX'] =  res.payerAccount.replace(reg, "$1**************$2")
                        res['account'] = res.payerAccount
                        res['orderNo'] = orderNo
                        console.log(res)
                        setBusinessData(getuserinfo.UAId,res)
                        openRouterByValue('pay',{uid:encodeURIComponent(getuserinfo.UAId)},_this)
                    }
                    
                })
            }.bind(_this));
        },
        toPayCode(orderNo,item){
            setBusinessData(orderNo,item)
            openRouterByValue('orderinfo',{orderNo:encodeURIComponent(orderNo)},this)
        }
    }
}

</script>

<style lang="less"> 
    @import (reference) "~components/style/common";
    @import '~vux/src/styles/1px.less';
    .vux-tab .vux-tab-item.vux-tab-selected{color: #000 !important;font-weight: 400;}
    .vux-tab-bar-inner{background-color: #F5266F}
    .myticket{
        padding-bottom: 54px
    }
    .prod{
        background-color: @color-white;
        display: flex;
        margin-top: 0.32rem;
        .fl{
            flex: 1;
            margin-right: 10px;
            img{
                width: 100%;
                border-radius: .03rem;
            }
        }
        .fr{
            flex: 3;
            h2{
                font-size: 0.32rem;
                .ov-text(1);
                margin-bottom: 0.16rem;
            }
            .pirce{
                display: flex;
                h3{
                    font-size: 0.4rem;
                    color: #FF6A56;
                    justify-content: flex-start;
                    flex: 1
                }
                .num{
                    flex: 1;
                    justify-content: flex-end;
                    margin-top: 5px;
                    text-align: right
                }

            }
            .buy{
                margin-top: 16px;
                float:right;
                width: 1.8rem;
                border: 1px solid rgb(219, 219, 219);
                text-align: center;
                border-radius: 20px;
                font-size:.2rem; 
                color: #888;
                height:0.6rem;
                line-height: 0.6rem;
            }
            .buy-pay{
                background:linear-gradient(132deg,rgba(255,134,109,1) 0%,rgba(250,65,143,1) 100%);
                color: #fff;border: 0;
                font-size: .2rem;
                height:0.6rem;
                line-height: 0.6rem;
            }

        }
    }
    .myticket-li{
        background-color: @color-white;
        padding: 0.24rem;
        margin: 0.2rem;
        border-radius: 8px;
        box-shadow:0px 2px 16px 0px rgba(0,0,0,0.06);
        .header{
            padding-bottom: 0.2rem;
            border-bottom: 1px solid rgb(245, 245, 245);
            display: flex;
            .fl{text-align: left;flex: 3;font-size: 0.26rem;color: #999}
            .fr{text-align: right;flex: 1;font-size: 0.26rem;color: #999}
        }
    }
    .order-no{
        text-align: center;
        font-size: .4rem;
        color: #999;
        padding-top: 1rem;
    }
</style>
