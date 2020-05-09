<template>
    <div class="buyconfirm-warp">
        <div class="myticket-li">
            <div class="header">
                <div class="fl">订单编号:{{info.orderNo}}</div>
                <div class="fr">{{info.orderStatus == '10' ? '待付款' : info.orderStatus == '11' ? '待取票' : info.orderStatus == '13' ? '已过期' : '' }}</div>
            </div>
            <div class="prod">
                <div class="fl">
                    <img :src="info.bannerItem" alt="">
                </div>
                <div class="fr">
                    <h2>{{info.orderName}}</h2>
                    <div class="pirce">
                        <h3>¥{{info.amount/100}}</h3>
                        <div class="num">
                            x{{info.ticketCount}}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <qrcode :value="info.payCode" type="img" v-if="info.payCode"></qrcode>
        <h3 v-if="info.payCode">取票码：{{info.payCode}}</h3>
    </div>
</template>

<script>
import { Qrcode } from 'vux'
import {openRouterByValue,backRouterByValue, getBusinessData,setBusinessData, getServerDataH5} from '../../handler/handler'
import { getUrlParams, throttle, showConfirm, showToast } from 'sslib/common/extend'
var urlParams = getUrlParams();
var phone = urlParams.phone;
export default {
    name:'orderinfo',
    components: {
       Qrcode
    },
    data() {
        return {
           info:{}
        }
    },
    created() {
        let _this = this;
        if(!!_this.$route.query.orderNo){
            let orderNo = _this.$route.query.orderNo
           _this.info =  getBusinessData(orderNo)
        }
        _this.init();
    },
    methods: {
        init() {
        }
    }
}
</script>

<style lang="less" scoped> 
    @import (reference) "~components/style/common";
    .buyconfirm-warp{
        text-align: center;
        padding-top: 20px;
        background-color: #fff;
        h3{
            margin-top: 10px;
        }
    }
      .prod{
        background-color: @color-white;
        display: flex;
        margin-top: 0.32rem;
        border-bottom: 1px solid #f5f5f5;
        padding-bottom: 10px;
        margin-bottom: 80px;
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
        background-color:transparent;
        padding: 0;
        margin:10px;
        border-radius: 0px;
        box-shadow:0px 0px 0px 0px rgba(255,255,255,0);
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
