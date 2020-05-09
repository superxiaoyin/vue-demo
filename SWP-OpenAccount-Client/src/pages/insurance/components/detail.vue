<template>
    <div class="detail-warp">
        <Banner :bannerItem="bannerItem" :slidesPerView="slidesPerView" :bannerStyle="bannerStyle"  swiperPagination="fraction" :spaceBetween="spaceBetween"></Banner>
        <div class="coentent">
            <h2>{{dataInfo.title}}</h2>
            <div class="flex-box price-warp">
                <div class="price">
                    <span class="original">{{dataInfo.desc}}</span>
                    <span class="discount">¥{{dataInfo.prices}} 元</span>
                </div>
            </div>
        </div>
         <div class="coentent infos">
            <div class="info">
                <h3>保障详情</h3>
                <ul class="tags">
                    <li v-for="(item,index) in dataInfo.sku" :key="index" :class="item.active == 1 ? 'active' : ''" @click="toggle(index,item)">{{item.titlex}}</li>
                </ul>
                <div class="content-infos" v-for="(items,idx) in dataInfo.sku" v-show="items.active == 1 ? true : false">
                    {{items.info}}
                </div>
            </div>
        </div>
        <div class="coentent infos">
            <div class="info">
                <h3>保险特色</h3>
                <div v-html="dataInfo.content"></div>
            </div>
        </div>
        <div class="footer button-on">
            <div class="btns" @click="toBuy">立即投保</div>
        </div>
    </div>
</template>

<script>
import {openRouterByValue,backRouterByValue, getBusinessData,setBusinessData, getServerDataH5} from '../../handler/handler'
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
            active:true,
            dataInfo:{}
        }
    },
    created() {
        let _this = this;
        if(!!_this.$route.query.id){
            let id = decodeURIComponent(_this.$route.query.id);
            _this.dataInfo = getBusinessData(id)
            _this.bannerItem = getBusinessData(id).infoBanner
            _this.id = id
        }
    },
    methods: {
        toBuy(){
            let _this = this
            setBusinessData(_this.dataInfo.id,this.dataInfo)
            openRouterByValue('insure',{id:encodeURIComponent(_this.id)},_this)
            // if(!!phone && !!getBusinessData(phone)){
            //     openRouterByValue('buyconfirm',{ticketId:encodeURIComponent(_this.id)},_this)
            // }else{
            //     showToast('请先登录进行购票')
            //     let responseUrl = window.location.protocol+"//"+window.location.host;
            //     responseUrl += '/static/openAccount/pages/openaccount.html#/verifyCode?listType=2';
            //     setTimeout(()=>{
            //         window.location.href=responseUrl;
            //     },1500)
            // }
        },
        toggle(index,item){
            let list = this.dataInfo.sku
            for(let i =0;i<list.length;i++){
                list[i].active = 0
                if(i == index){
                    list[i].active = 1
                }
            }

            this.dataInfo.prices = item.price
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
        padding: .56rem .3rem .3rem;
        h2{
            font-size: .34rem;
            color: #333;
        }
        .price-warp{
            margin: .24rem 0 0 0;
            padding-bottom: 0.1rem;
            .price{
                flex: 3;
                .discount{
                    .calcWidth(font-size,20);
                    color: #FF6A56FF;
                    .calcWidth(margin-right,11);
                }
                .original{
                    .calcWidth(font-size,13);
                    display: block;
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
            img{width: 100%;}
        }
    }
    .infos{margin-top: 6px;border-radius: 0;
        .tags{display: flex;flex-wrap: wrap;}
        .tags>li{margin: 1.5%;flex: 0 0 30%;text-align: center;font-size: .3rem;height:38px;line-height: 38px;border: 1px solid #e4e4e4;border-radius: 4px;color: #888;}
        .tags>li.active{background-color: #FF6A56FF; color: #fff;border-color:#FF6A56FF;}
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
