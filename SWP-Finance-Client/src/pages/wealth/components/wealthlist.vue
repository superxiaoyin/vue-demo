<template>
    <div class="wealth-list">
        <SnLoading v-if="pageLoading"></SnLoading>
        <div v-if="!pageLoading&&productList.length">
            <div class="product-item" v-for="product in productList">
                <wealth-product :product="product" @click.native="showWealthDetail(product)"></wealth-product>
            </div>
        </div>
        <SnEmpty v-if="noInfo" :isShow="true" icon="no-product" tip="暂无理财产品"></SnEmpty>
    </div>
</template>
<script>
import WealthProduct from './wealthproduct'
import { getServerData,openRouterByValue,formatProduct,setBusinessData,getBusinessData } from '../../handler/handler'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { throttle, goBackPage, initTitleMenu,getUrlParams } from 'sslib/common/extend'
import { SnLoading,SnEmpty } from 'components'
export default {
    data(){
        return{
            productList:[],
            pageLoading: false,
            subTitle:['全部产品'],
            noInfo:false,
        }
    },
    components:{
        WealthProduct,SnLoading,SnEmpty
    },
    created(){
        let _this = this;
        initTitleMenu(_this.subTitle);
        _this.init();
    },
    methods:{
        /**
         * 数据初始化
         */
        init(){
            let _this = this;
            notifyAppBackEvent(); //调用app，通知返回事件
            registerHandler('notifyAppBack', function (data) {//点击app返回事件
                throttle(function () {
                    goBackPage('sswbv_close_browser');
                }.bind(this));
            })
            if(!!getBusinessData('productData')){
                _this.productList = getBusinessData('productData');
            }else{
                _this.queryWealthList();
            }
        },
        /**
         * 查看财富产品详情
         */
        showWealthDetail(product){
            let _this = this;
            openRouterByValue('wealthdetail',{product:encodeURIComponent(JSON.stringify(product)),listFlag:1},_this);
        },
         /**
         * 查询财富产品列表
         */
        async queryWealthList(){
            let _this = this;
            const data = {
                cpyId: -1,
                businessType: 1,
                pType: 1
            }
            try {
                _this.pageLoading = true;
                const result = await getServerData('wealth/wealthManage.queryProductList',data);
                _this.pageLoading = false;
                if(result.code === 0){
                    if(!!result.productList&&result.productList.length){
                        _this.productList = result.productList.map(product => {
                            return formatProduct(product)
                        });
                        setBusinessData('productData',_this.productList);
                    }else{
                        _this.noInfo = true;
                    }
                }else{
                    _this.noInfo = true;
                }
            } catch (error) {
                _this.pageLoading = false;
                _this.noInfo = false;
                console.log(error);
            }
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .wealth-list{
        background: @color-bg;
        padding: 0 .3rem;
        .product-item{
            margin-bottom: .3rem;
            &:first-child{
                margin-top: .3rem;
            }
        }
    }
</style>
