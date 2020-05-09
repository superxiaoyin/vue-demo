<template>
    <div class="index-warp">
        <div class="index-banner" v-if="bannerItem.length !== 0">
            <Banner :bannerItem="bannerItem" :slidesPerView="slidesPerView" swiperPagination="bullets"></Banner>
        </div>

        <div class="index-list">
            <div class="flex-box list vux-1px-b" v-for="(item,idx) in list" :key="idx" @click="showDetail(item)">
                <div class="fl">
                    <img :src="item.ticketFigureUrl">
                </div>
                <div class="fr">
                    <h2 class="sn-ov-text">{{item.ticketName}}</h2>
                    <div class="flex-box">
                        <div class="price-warp">
                            <div class="price">
                                <span class="discount">¥{{item.marketPrice}}</span>
                                <span class="original">原价<del>¥{{item.marketPrice}}</del></span>
                            </div>
                            <div class="stock">库存{{item.stores}}</div>
                        </div>
                        <div class="buyTicket">购票</div>
                    </div>
                </div>

            </div>
        </div>
        <Tabbar></Tabbar>
    </div>
</template>

<script>

import {openRouterByValue,backRouterByValue, getBusinessData, setBusinessData,setLocalData, getServerDataH5} from '../../handler/handler'
import {getUrlParams, throttle, showConfirm, showToast } from 'sslib/common/extend'
import Banner from './Banner'
import Tabbar from './Tabbar'
var urlParams = getUrlParams();
var phone = urlParams.phone;

export default {
    name:'index',
    components: {
        Banner,
        Tabbar
    },
    data() {
        return {
            bannerItem:[],
            slidesPerView:'0',
            list:[]
        }
    },
    created() {
        let _this = this;
        
        _this.init();
    },
    methods: {
        init() {
            let _this = this;
            getServerDataH5('/yqt/buyTicket/buyTicket.queryProdId',{phone:phone},'POST').then(result => {
                if(result.code == 0){
                   _this.getList(result.productId)
                }
            })
        },
        getList(id){
            let _this = this
            let param ={scenicId:id,pageSize:10,phone:phone}
            getServerDataH5('/yqt/buyTicket/buyTicket.queryTicketList',param,'POST').then(result => {
                if(result.result == 'OK'){
                    let dataList = result.ticketList
                    for(let i=0; i<dataList.length; i++){
                        if(dataList[i].imgList.length != 0){
                            _this.bannerItem.push(dataList[i].imgList[0])
                        }
                        _this.getPirce(dataList[i])
                    }
                    
                }
            })
        },
        getPirce(obj){
            let _this = this;
            let objData = obj
            let myDate = new Date();
            let time = myDate.getFullYear()+'-'+myDate.getMonth()+'-'+myDate.getDate()
            let param ={
                ticketId:objData.ticketId,
                phone:phone,
                date:time
            }
            getServerDataH5('/yqt/buyTicket/buyTicket.queryTicketStoreList',param,'POST').then(res => {
                let result =  res.priceAndStoreList
                if( result == undefined ||  result == null ||  result == ''){
                    objData['marketPrice'] = 0
                    objData['stores'] = 0
                }else{
                    let datas = result[0]
                    objData['marketPrice'] = datas.marketPrice
                    objData['stores'] = datas.store
                }
                _this.list.push(objData)
            })
            console.log(_this.list)
        },
        showDetail(item){
            let _this = this
            if(item.store == 0){
                showToast('该票已售空!')
            }else{
                setLocalData(item.ticketId,item)
                openRouterByValue('detail',{ticketId:encodeURIComponent(JSON.stringify(item.ticketId))},_this)
            }
        }
    }
}
</script>

<style lang="less" scoped> 
    @import (reference) "~components/style/common";
    @import '~vux/src/styles/1px.less';
    .index-warp{padding-bottom: 40px;}
    .index-banner{
        background-color: @color-white;
        .calcWidth(padding-top,12.5);
        .calcWidth(padding-bottom,20)
    }
    .index-list{
        background-color: @color-white;
        .flex-box{
            display: flex;
        };
        .list:first-child{
            .calcWidth(padding,12.5);
        }
        .list{
            padding: 0 .25rem .25rem;
            .calcWidth(margin-bottom,12.5);
        }
        .calcWidth(margin-top,12.5);
        .sn-ov-text{
            .ov-text(1);
        };
        .fl{
            flex: 1;
            img{
                .calcWidth(width,76);
                .calcWidth(height,76);
                .calcWidth(border-radius,12);
            }
        }
        .fr{
            flex: 3;
            h2{
                .calcWidth(font-size,16);
                .calcWidth(margin-bottom,7);
                color: #333;
            }
            .price-warp{
                flex: 3;
                .price{
                    .calcWidth(padding-bottom,5);
                }
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
                .stock{
                    padding: .01rem .2rem;
                    border:1px solid rgb(212, 212, 212);
                    color: #999;
                    display: inline-block;
                    .calcWidth(font-size,10);
                    border-radius: 22px;
                }
            }
            .buyTicket{
                flex: 1;
                text-align: center;
                color: @color-white;
                background: linear-gradient(132deg,rgba(255,134,109,1) 0%,rgba(250,65,143,1) 100%);
                box-shadow: 0px 12px 24px 0px rgba(255,201,208,1);
                border-radius: 48px;
                .calcWidth(height,32);
                .calcWidth(line-height,32);
                margin-top: 10px;
            }
        }
    }
    .vux-1px-b::after{
        border-bottom: 1px solid #f1f1f1;
    }
</style>
