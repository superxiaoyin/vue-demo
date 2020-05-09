<template>
    <div class="finance-wrapper">
        <div class="account">
            <span class="balance-text">账户余额<i @click="moneyFlag = !moneyFlag" class="money-eye" :class="!moneyFlag?'money-closed':''"></i></span>
            <span class="balance-money" v-if="moneyFlag" @click="showAccount"><i class="money-tip">¥</i>{{totalBalance|moneyFrt(1)}}</span>
            <span class="balance-money" v-else>******</span>
        </div>
        <div class="templet-list">
            <div class="templet-item" v-for="item in appList" @click="openApp(item.appUrl)">
                <img class="icon" :src="item.comLogoUrl" alt="">
                <div>{{item.appName}}</div>
            </div>
        </div>
        <div class="finacing-list">
            <div class="financing-recommend">
                <div class="recommend-title">超值推荐</div>
                <div class="recommend-more" @click="showWealthMore">
                    <span>更多</span>
                    <i class="more-icon"></i>
                </div>
            </div>
            <div class="recommend-product" v-if="!!productList&&productList.length">
                <div class="product-item" v-for="product in productList">
                    <wealth-product :product="product" @click.native="showWealthDetail(product)"></wealth-product>   
                </div>
            </div>
            <SnEmpty v-if="noInfo" :isShow="true" icon="no-product" tip="暂无理财产品"></SnEmpty>
        </div>
        <loading-page v-if="showLoading"></loading-page>
    </div>
</template>
<script>
import { appList,getServerData,setBusinessData,getBusinessData,deleteBusinessData,formatProduct,openNativePage, openRouterByValue,getLocalData} from '../handler/handler'
import WealthProduct from '../wealth/components/wealthproduct'
import { SnLoading,SnEmpty } from 'components'
import { LoadingPage } from '../baseComponents'
import { registerHandler, notifyAppBackEvent, ReloadPageFunction, GetUserInfoFunction } from 'sslib/common/SnJsBridge'
import { throttle, openPage, showConfirm, showToast, getUrlParams, openLonginPage } from 'sslib/common/extend'
export default {
    data(){
        return{
            moneyFlag: true,
            totalBalance: 0,
            appList:appList,
            productList:[],
            noInfo:false,
            showLoading:false,
            uaId:'',
        }
    },
    components:{
        WealthProduct,SnLoading,SnEmpty,LoadingPage
    },
    created(){
        let _this = this;
        _this.init();
    },
    methods:{
        /**
         * 数据初始化
         */
        init(){
            let _this = this;
            GetUserInfoFunction().then(uaData=>{
                if(uaData){
                    _this.uaId = uaData.UAId;
                }
            })
            //回退刷新账户列表数据
            registerHandler('refreshPage', function (data) {
                throttle(function () {
                    _this.queryAccountList();
                })
            }.bind(this));
            //下拉刷新
            registerHandler("reloadData",function(data) {
                deleteBusinessData('productData');
                ReloadPageFunction().then(function(data1){});
            }.bind(this));

            if(!!getBusinessData('productData')){
                _this.productList = getBusinessData('productData');
            }else{
                _this.queryWealthList();
            }
            _this.queryAccountList();
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
                const result = await getServerData('wealth/wealthManage.queryProductList',data);
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
                _this.noInfo = true;
                console.log(error);
            }
        },
        /**
         * 查询账户列表
         */
        async queryAccountList(){
            let _this = this;
            const data = {
                cpyId: -1,
                businessType: 1
            }
            try {
                const result = await getServerData('accountmgr/accountMgr.queryAccountList',data);
                if(result.code === 0){
                    _this.totalBalance = result.totalBalance;
                    setBusinessData('accountData',result);
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * 显示账户详情
         */
        showAccount(){
            let _this = this;
            openPage('account.html');
        },
        /**
         * 打开小应用首页
         */
        async openApp(url){
            let _this = this;
            if(!!~url.indexOf('openaccount')){
                _this.checkOpenAccount(url);
            }else if(!!~url.indexOf('charge')){//水电气缴费要判断是否有缴费历史
                _this.checkChargeHistory(url);
            }else{
                openPage(url);
            }
        },
        /**
         * 检查Ⅱ类开户条件
         */
        async checkOpenAccount(url){
            let _this = this;
            try {
                //第一步查询认证系统工作时间
                const timeresult = await getServerData('certification/certification.queryCertificationWorkingTime');
                if(timeresult.code === 0){
                    if(timeresult.status === 1){//在工作时间内
                        //Ⅱ类开户要先判断是否认证
                        const result = await getServerData('user/user.queryCertificationInfo');
                        if(result.code === 0){
                            if(result.status === 1){//认证成功
                                //Ⅱ类户开通权限校验(开通的数量有限制)
                                _this.showLoading = true;
                                const checkdata = await getServerData('accountMgr/accountMgr.openAccountAuth',{account:"",type:1});
                                _this.showLoading = false;
                                if(checkdata.code === 0){
                                    if(checkdata.status === 1){
                                        openPage(`${url}identifystep3?identify=1&name=${result.name}`);
                                    }else if(checkdata.status === 2){
                                        showToast('已开通Ⅱ类户，无法重复开通','middle');
                                    }
                                }
                            }else if(result.status === 2){//未认证
                                showConfirm("开通Ⅱ类户需要实名认证，请认证后再开通",function(){
                                    openPage(`${url}identifystep1`);
                                },2,"先不认证","实名认证")  
                            }else if(result.status === 3){//认证中
                                showToast("审核中，请等待审核结果","middle");
                            }
                        }
                    }else if(timeresult.status === 2){//不在工作时间内
                        showToast(timeresult.certificationWorkingTime,"middle");
                    }
                }
            } catch (error) {
                _this.showLoading = false;
                console.log(error);
            } 
        },
        /**
         * 检查是否有缴费历史
         */
        checkChargeHistory(url){
            let _this = this;
            let chargeHistoryKey = "chargeHistory_"+_this.uaId;
            if(!!getLocalData(chargeHistoryKey)){
                const chargeType = url.charAt(url.length-1);
                if(!!getLocalData(chargeHistoryKey)[chargeType]){
                    const historyUrl = url.replace("?","#/history?");
                    openPage(historyUrl);
                }else{
                    openPage(url);
                }
            }else{
                openPage(url);
            }
        },
        /**
         * 查看更多财富产品
         */
        showWealthMore(){
            let _this = this;
            openPage('wealth.html#/wealthlist')
        },
        /**
         * 查看财富产品详情
         */
        showWealthDetail(product){
            let _this = this;
            openPage(`wealth.html#/wealthdetail?product=${encodeURIComponent(JSON.stringify(product))}`);
        },

    }
}
</script>
<style lang="less">
    @import '~components/style/common.less';
    .finance-wrapper{
        background: @color-white;
        padding-top: .1rem;
        .account{
            background-image: url(../../resource/img/accountlist/account_bg.png);
            background-size: 100% 100%;
            height: 3rem;
            display: flex;
            flex-direction: column;
            color: @color-white;
            padding: .4rem 0 0 .5rem;
            .balance-text{
                display: flex;
                align-items: center;
                .money-eye{
                    display: inline-block;
                    background: url('../../resource/img/accountlist/eye_open.png') no-repeat center;
                    width: 0.36rem;
                    height: 0.36rem;
                    background-size: 0.36rem 0.36rem;
                    cursor: pointer;
                    margin-left: .1rem;
                }
                .money-closed{
                    background: url('../../resource/img/accountlist/eye_close.png') no-repeat center;
                    background-size: 0.36rem 0.36rem;
                }
            }
            .balance-money{
                font-size: @fs-mob-biggest;
                font-weight: bolder;
                height: 1.2rem;
                line-height: 1.2rem;
                .money-tip{
                    font-size: @fs-mob-big;
                }
            }
        }
        .templet-list{
            display: flex;
            flex-wrap: wrap;
            border-bottom: .3rem solid @color-bg;
            padding: 0 .3rem;
            .templet-item{
                width: 25%;
                text-align: center;
                margin-bottom: .5rem;
                font-size: .28rem;
                .icon{
                    display: block;
                    height: .72rem;
                    width: .72rem;
                    margin-left: auto;
                    margin-right: auto;
                }
            }
        }
        .finacing-list{
            .financing-recommend{
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: .3rem .5rem;
                .recommend-title{
                    font-size: .32rem;
                }
                .recommend-more{
                    display: inline-flex;
                    align-items: center;
                    font-size: .27rem;
                    color: @fc-info;
                }
            }
            .recommend-product{
                padding: 0 .3rem .3rem .3rem;
                .product-item{
                    margin-bottom: .3rem;
                    &:last-child{
                        margin-bottom: 0;
                    }
                }
            }
            .empty-comp{
                bottom: 1.8rem;
                top: unset;
                .panel{
                    .emptyTips{
                        margin: 0;
                    }
                } 
            }
        }
        .more-icon{
            display: inline-block;
            width: .28rem;
            height: .28rem;
            margin-left: .1rem;
            background: url('../../resource/img/icon_more.png') no-repeat center;
            background-size: .28rem .28rem;
            cursor: pointer;
        }
    }
</style>
