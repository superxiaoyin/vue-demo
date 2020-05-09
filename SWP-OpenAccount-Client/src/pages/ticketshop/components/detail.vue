<template>
    <div class="detail-warp">
        <Banner :bannerItem="bannerItem" :slidesPerView="slidesPerView" :bannerStyle="bannerStyle"  swiperPagination="fraction" :spaceBetween="spaceBetween"></Banner>
        <div class="coentent">
            <h2>{{dataInfo.ticketName}}</h2>
            <div class="flex-box price-warp">
                <div class="price">
                    <span class="discount">¥{{dataInfo.marketPrice}}</span>
                    <span class="original">原价<del>¥{{dataInfo.marketPrice}}</del></span>
                </div>
                <div class="stock"><span class="box">库存{{dataInfo.stores}}</span></div>
            </div>
            <div class="info">
                <h3>门票介绍</h3>
                <p v-html="info.ticketDetail"></p>
            </div>
            <div class="info">
                <h3>预订须知</h3>
                <p v-html="info.orderDetail"></p>
            </div>
            <div class="info">
                <h3>退票说明</h3>
                <p v-html="info.returnDetail"></p>
            </div>

        </div>
        <div class="footer button-on">
            <div class="btns" @click="toBuy">立即购买</div>
        </div>
    </div>
</template>

<script>
import {openRouterByValue,backRouterByValue, getBusinessData,setBusinessData,getLocalData, getServerDataH5} from '../../handler/handler'
import { getUrlParams,throttle, showConfirm, showToast } from 'sslib/common/extend'
import Banner from './Banner'
var urlParams = getUrlParams();
var phone = urlParams.phone;
export default {
    name:'detail',
    components: {
        Banner
    },
    data() {
        return {
            bannerItem:[],
            slidesPerView:'1',
            bannerStyle:'border-radius: 0',
            spaceBetween:0,
            id:0,
            info:{},
            dataInfo:{}
        }
    },
    created() {
        console.log(window.location.host)
        let _this = this;
        if(!!_this.$route.query.ticketId){
            let id = decodeURIComponent(_this.$route.query.ticketId);
            _this.dataInfo = getLocalData(id)
            _this.bannerItem = getLocalData(id).imgList
            _this.id = id
        }
        _this.init();
    },
    methods: {
        init() {
            console.log(this.dataInfo)
            let _this = this;
            let parame = {
                ticketId:_this.id,
                phone:phone
            }
            getServerDataH5('/yqt/buyTicket/buyTicket.queryTicketDetail',parame,'POST').then(res => {
                console.log(res)
                if(res.result == 'OK'){
                    _this.info = res
                }
            })
        },
        toBuy(){
            let _this = this
            if(!!phone && !!getBusinessData(phone)){
                openRouterByValue('buyconfirm',{ticketId:encodeURIComponent(_this.id)},_this)
            }else{
                showToast('请先登录进行购票')
                let responseUrl = window.location.protocol+"//"+window.location.host;
                responseUrl += '/static/openAccount/pages/openaccount.html#/verifyCode?listType=2';
                setTimeout(()=>{
                    window.location.href=responseUrl;
                },1500)
            }
        }
    }
}
</script>

<style lang="less"> 
    @import (reference) "~components/style/common";
    @import '~vux/src/styles/1px.less';
    .detail-warp{
        padding-bottom: 54px;
    }
    .coentent{
        .flex-box{
            display: flex;
        }
        background-color:@color-white;
        position: relative;
        margin-top: -10px;
        border-radius: 12px 12px 0 0;
        z-index: 1;
        padding: .56rem .3rem;
        h2{
            font-size: .34rem;
            color: #333;
        }
        .price-warp{
            margin: .24rem 0 0.4rem 0;
            padding-bottom: 0.4rem;
            border-bottom: 1px solid #EAEAEA;
            .price{
                flex: 3;
                .discount{
                    .calcWidth(font-size,20);
                    color: #FF6A56FF;
                    .calcWidth(margin-right,11);
                }
                .original{
                    .calcWidth(font-size,13);
                    color: #999;
                    del{text-decoration: line-through;}
                }
            }
            .stock{
                flex: 1;
                padding-top: 6px;
                text-align: right;
                .box{
                    display: inline-block;
                    padding: .01rem .2rem;
                    border:1px solid rgb(212, 212, 212);
                    color: #999;
                    display: inline-block;
                    .calcWidth(font-size,10);
                    border-radius: 22px;
                }
            }
        }
        
        .info{
            margin-bottom: 0.4rem;
            h3{
                font-size:.3rem;
                margin-bottom: .08rem;
                color: #333;
                margin-bottom: 8px;
                font-weight: bold;
            }
            p{
                font-size: 0.28rem;
                color: #999;
                span{
                    display: block;
                    img{width: 100% !important;}
                }
            }
             
           
            
        }
    }
    .footer{
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 99;
        width: 100%;
        height:1.12rem;
        background:rgba(255,255,255,1);
        box-shadow:0px -2px 8px 0px rgba(0,0,0,0.06);
        padding: 7px .3rem 0;
        .btns{
            height:0.8rem;
            line-height: 0.8rem;
            background:linear-gradient(132deg,rgba(255,134,109,1) 0%,rgba(250,65,143,1) 100%);
            border-radius:40px;
            text-align: center;
            color: #fff;
            font-size: .32rem;
        }
    }

</style>
