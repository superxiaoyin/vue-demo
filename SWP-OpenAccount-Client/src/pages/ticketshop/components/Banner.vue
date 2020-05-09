<template>
    <div class="public-banner">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" :class="[classStyle+1]" v-for="(item,index) in bannerItem" :key="index">
              <img :src="item" alt="" :style="bannerStyle">
            </div>
          </div>
        </div>
        <div :class="[classStyle]"></div>
    </div>
</template>

<script>
    import Swiper from "swiper"
    import 'swiper/dist/css/swiper.min.css'
import { type } from 'os'
    export default {
        props: {
            bannerItem:{
                type:Array,
                default:[]
            },
            slidesPerView:{
                type:String,
                default:'0'
            },
            bannerStyle:{
                type:String,
                default:''
            },
            swiperPagination:{
                type:String,
                default:''
            },
            spaceBetween:{
                type:Number,
                default:5
            }

        },
        data() {
            return {
                slidesPerViewNum:'auto',
                className:'',
                classStyle:''
            }
        },
        created () {
            let _this =this
            if(_this.swiperPagination == 'bullets'){
                _this.className = '.swiper-pagination-bullets'
                _this.classStyle = 'swiper-pagination-bullets'
            }else{
                _this.className = '.swiper-pagination-fraction'
                _this.classStyle = 'swiper-pagination-fraction'
            }
            if(_this.slidesPerView == 0){
                _this.slidesPerViewNum = 'auto'
            }else{
                _this.slidesPerViewNum = _this.slidesPerView*1
            }
        },
        mounted () {
            let that = this;
            let mySwiper = new Swiper('.swiper-container', {
                direction: 'horizontal', //滑动方向，可设置水平(horizontal)或垂直(vertical)。
                loop: true, // 设置为true 则开启loop模式
                autoplay: 3000, // 自动切换时间
                slidesPerView: that.slidesPerViewNum, // 设置slider容器能够同时显示的slides数量(carousel模式)。类型：number or auto
                centeredSlides: true, // 设定为true时，active slide会居中，而不是默认状态下的居左。
                spaceBetween: that.spaceBetween, // 在slide之间设置距离（单位px）。
                loopAdditionaSlider: 0,
                initialSlide:3,
                paginationType: that.swiperPagination,
                pagination: that.className,
            });
        },
        computed: {
            slidesPerViews() {
                
            }
        },
        
    }
</script>

<style lang="less">
.public-banner {
    .swiper-pagination-bullets{
        position: absolute;
        z-index: 1;
        bottom: 5px;
        width: 100%;
        text-align: center;
        span{
            width:5px;
            height:5px;
            background:rgba(255,255,255,1);
            border-radius:5px;
            opacity:0.6;
            margin: 0 2px
        }
        span.swiper-pagination-bullet-active{
            width: 10px;
            opacity: 1;
        }
    }
    .swiper-pagination-fraction{
        position: absolute;
        z-index: 1;
        bottom: 16px;
        width: 36px;
        height: 20px;
        left: 85%;
        line-height: 20px;
        text-align: center;
        font-size: 10px;
        border-radius: 10px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.5)
    }

}
</style>
<style lang="less" scoped>
.swiper-container {
    width: 100%;
    height: 100%;
}
.swiper-slide {
    display: flex;
    width: 80%;
    overflow:hidden;
    align-items: center;
    transition: 300ms;
    transform: scale(0.9);
}
.swiper-pagination-fraction1{
    transform: scale(1);
}
.swiper-slide-active,.swiper-slide-duplicate-active{
    transform: scale(1);
}
.swiper-slide img{width: 100%;border-radius: 16px;}
.public-banner{
    position: relative
}
</style>  