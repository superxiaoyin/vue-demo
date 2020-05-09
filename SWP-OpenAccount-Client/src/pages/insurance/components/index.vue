<template>
    <div class="index-warp">
        <!-- <div class="index-banner" v-if="bannerItem.length !== 0">
            <Banner :bannerItem="bannerItem" :slidesPerView="slidesPerView" swiperPagination="bullets"></Banner>
        </div> -->

        <div class="index-list">
            <div class="list" v-for="(item,idx) in list" :key="idx" @click="showDetail(item)">
                <div class="fl">
                    <img :src="item.thumb">
                </div>
                <div class="fr">
                    <h2 class="sn-ov-text">{{item.title}}</h2>
                    <div class="flex-box">
                        <div class="price-warp">
                            <div class="price">
                                <span class="original">{{item.desc}}</span>
                                <span class="discount">¥{{item.prices}} 元</span>
                            </div>
                            <!-- <div class="stock">库存{{item.stores}}</div> -->
                        </div>
                        <!-- <div class="buyTicket">购票</div> -->
                    </div>
                </div>

            </div>
        </div>
        <Tabbar></Tabbar>
    </div>
</template>

<script>

import {openRouterByValue,backRouterByValue, getBusinessData, setBusinessData, getServerDataH5} from '../../handler/handler'
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
            let param = {
                phone:phone
            }
            getServerDataH5('/yqt/buyTicket/insurance.getInsuranceInfo',param,'POST').then(result => {
                // console.log(result)
                if(result.code == 0){
                   _this.list = result.prodList
                }
            })
        },
      
      
        showDetail(item){
            let _this = this
            setBusinessData(item.id,item)
            openRouterByValue('detail',{id:encodeURIComponent(JSON.stringify(item.id))},_this)
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
        
        .flex-box{
            display: flex;
        };
        .list{
            background-color: @color-white;
            border-radius: 10px;
            padding:.25rem;
            .calcWidth(margin-bottom,12.5);
            margin: 10px;
        }
        .calcWidth(margin-top,12.5);
        .sn-ov-text{
            .ov-text(1);
        };
        .fl{
            float: none;
            width: 100%;
            img{
                width: 100%;
            }
        }
        .fr{
            margin-top: 10px;
            float: none;
            width: 100%;
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
                    display: block;
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
