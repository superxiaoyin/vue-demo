<template>
    <div class="buyconfirm-warp">
        <tab custom-bar-width="60px">
            <tab-item selected @on-item-click="tabs">全部</tab-item>
            <tab-item @on-item-click="tabs">支付成功</tab-item>
            <tab-item @on-item-click="tabs">待付款</tab-item>
            <tab-item @on-item-click="tabs">支付失败</tab-item>
            <tab-item @on-item-click="tabs">已过期</tab-item>
        </tab>

        <div class="myticket" v-if="list.length !== 0">
            <div class="li" v-for="(item,index) in list" :key="index">
                <div @click="toinfo(item.transSeq, item)">
                    <div class="orderstat">
                        {{item.orderStatus == '00' ? '支付成功' : item.orderStatus == '10' ? '待支付' : item.orderStatus == '13' ? '已过期' : item.orderStatus == '01' ? '支付失败' : item.orderStatus == '07' ? '支付关闭' : '支付中'}}
                    </div>
                    <h3>{{item.orderName}}</h3>
                    <p>编号：{{item.transSeq}}</p>
                    <p>价格：{{item.insuranceAmount / 100}}元</p>
                    <p>被保人：{{item.backInsureName}}</p>
                    <p>支付方式：{{item.payChannel == '02' ? '微信支付' : '酒城卡支付'}}</p>

                    <p>保险时间：{{item.insurStartDate}}至{{item.insurDeadLine}}</p>
                </div>
                <div class="buy-pay" v-if="item.orderStatus == 10" @click="toBuyPay(item)">去支付</div>
                <div class="buy-pay no" @click="topay(item.prodId)" v-if="item.orderStatus == '13' || item.orderStatus == '01'">去投保</div>
            </div>
        </div>
        <div class="myticket order-no" v-else>
            <p>~暂无保单数据~</p>
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
           stats:false,
           userinfo:{}
        }
    },
    created() {
        let _this = this;
        let userinfo = {}
        if(getLocalData(phone)){
            userinfo = getLocalData(phone)
        }else{
            userinfo = getBusinessData(phone)
        }
        _this.userinfo = userinfo
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
                phone:phone,
                uaId:_this.userinfo.UAId,
                lgParam:_this.userinfo.lgParam
            }
            getServerDataH5('/yqt/buyTicket/insurance.queryOrderList',parame,'POST').then(res => {
                console.log(res)
                let dataList = res.insuranceOrderList
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
                let datas =  _this.filterList(oldList,'00')
                list = datas
            }else if(index == 2){
                let datas =  _this.filterList(oldList,'10')
                list = datas
            }else if(index == 3){
                let datas =  _this.filterList(oldList,'01')
                list = datas
            }else if(index == 4){
                let datas =  _this.filterList(oldList,'13')
                list = datas
            }else{
                list = oldList
            }
            _this.list = list
        },
        topay(id){
            openRouterByValue('detail',{id:encodeURIComponent(id)},this)
        },
        toBuyPay(item){
            console.log(item)
            let _this = this
            let parame = {
                tranSeq:item.transSeq,
                phone:phone
            }
            throttle(function () {
                let getuserinfo = getBusinessData(phone)
                getServerDataH5('/yqt/buyTicket/insurance.getPlainAndSign',parame,'POST').then(res => {
                    let dataRes = res
                    dataRes.tranSeq = item.transSeq
                    if(res.code == 0){
                        setBusinessData('insureInfo',{
                            insureName: item.insureName,
                            insureIdNo: item.insureIdNo,
                            phone: item.phone,
                            address: item.address
                        })
                        setBusinessData('beInsureInfo',{
                            backInsureName: item.backInsureName,
                            backInsureIdNo: item.backInsureIdNo
                        })
                        setBusinessData(item.transSeq,dataRes)
                        openRouterByValue('pay',{transeq:encodeURIComponent(item.transSeq)},_this)
                    }
                    
                })
            }.bind(_this));
        },
        toinfo(transSeq,item){
            setBusinessData(transSeq,item)
            openRouterByValue('orderinfo',{transseq:encodeURIComponent(transSeq)},this)
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
        padding-bottom: 54px;
        .li{
            background-color: #fff;
            margin: 10px;
            border-radius: 10px;
            padding: 10px;
            position: relative;
            overflow: hidden;
            .orderstat{
                height: 20px;
                line-height: 20px;
                text-align: center;
                font-size: .06rem;
                color: #fff;width: auto;
                padding: 0 10px;
                background:linear-gradient(132deg,rgba(255,134,109,1) 0%,rgba(250,65,143,1) 100%);
                ;
                position: absolute;
                right: 10px;
                top: 10px;
                border-radius: 20px;
                z-index: 1;
                
            }
            h3{
                font-size: .3rem;
                color: #333;
                margin-bottom: 10px;
                width: 75%;
            }
            p{
                font-size: .2rem;
                color: #888;
                margin-bottom: 10px
            }
            .buy-pay{
                background:linear-gradient(132deg,rgba(255,134,109,1) 0%,rgba(250,65,143,1) 100%);
                color: #fff;border: 0;
                border-radius: 20px;
                font-size: .3rem;
                height:0.8rem;
                line-height: 0.8rem;
                text-align: center;
            }
            .no{
                border: 1px solid rgb(219, 219, 219);
                text-align: center;
                border-radius: 20px;
                color: #888;
                background: transparent;
            }
        }
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
