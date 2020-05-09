<template>
    <div class="wealth-detail">
        <div class="wealth-info">
            <div class="info-rate">
                <span class="rate-num">{{product.rate|percentFrt}}</span>
                <span class="info-text">年利率</span>
            </div>
            <div class="info-date">
                <span class="date-num">{{product.dueTime}}年</span>
                <span class="info-text">产品期限</span>
            </div>
        </div>
        <div class="wealth-tip">
            <span>{{interestDesc}}</span>
            <span class="save-date">存期{{num2Chinese(product.dueTime)}}年</span>
            <span>{{product.startAmount}}元起存</span>
        </div>
        <div class="wealth-desc">
            <div class="desc-item" v-for="desc in descList">
                 <img class="desc-icon" :src="desc.iconUrl" alt="">
                 <div class="desc-text">
                     <label>{{desc.title}}</label>
                     <span>{{desc.value}}</span>
                 </div>
            </div>
        </div>
        <sn-button @SnButtonClick="confirmStore">立即存入</sn-button>
    </div>
</template>
<script>
import {openRouterByValue,wealthMap,num2Cn, backRouterByValue, getBusinessData} from '../../handler/handler'
import {SnCell,SnButton} from 'components'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { throttle, goBackPage, initTitleMenu, showToast } from 'sslib/common/extend'
export default {
    data(){
        return{
            product:{},
            descList:[],
            pFamily:this.$route.query.p_family,
            phone:'',
            loginData:{},
        }
    },
    components:{
        SnCell,SnButton
    },
    computed:{
        interestDesc(){
            if(!!~this.product.pName.indexOf('月月红')){
                return '月月取息'
            }else{
                return '零存整取'
            }
        }
    },
    created(){
        let _this = this;
        _this.init();
    },
    methods:{
        /**
         * 数据初始化，注册返回事件
         */
        init(){
            let _this = this;
            if(!!_this.$route.query.product){
                _this.product = JSON.parse(decodeURIComponent(_this.$route.query.product));
            }
            if(!!_this.$route.query.phone){
                _this.phone = _this.$route.query.phone;
                _this.loginData = getBusinessData(_this.$route.query.phone);
            }
            // _this.setTittleMenu(_this.product.pTitle+'详情');
            _this.descList = wealthMap[_this.product.pTitle] || wealthMap['快乐金'];

            // notifyAppBackEvent(); //调用app，通知返回事件
            // registerHandler('notifyAppBack', function (data) {//点击app返回事件
            //     throttle(function () {
            //         if(!!_this.$route.query.listFlag){
            //             backRouterByValue('wealthlist',{p_family:_this.pFamily},_this);
            //         }else{
            //             goBackPage('sswbv_close_browser');
            //         }
            //     }.bind(this));
            // })
        },
        /**
         * 确定存入
         */
        confirmStore(){
            let _this = this;
            if(!!_this.loginData&&!!_this.loginData.UAId){
                openRouterByValue('wealthbuy',_this.$route.query,_this);
            }else{
                showToast("请先登录");
                window.location.href = 'openaccount.html#/verifyCode?listType=1&phone='+_this.phone;
            }
        },
        num2Chinese(num){
            return num2Cn(num);
        },
        // setTittleMenu: function (title) {
        //     var _this = this;
        //     var memuList = [title];
        //     memuList.push({
        //         name: '分享好友', menuId: 'but_1_8', type: 2, func: function () {
        //             let param = {
        //                 shareType:0,
        //                 shareTitle:'分享'+(_this.pFamily==1?'快乐金':'月月红'),
        //                 ShareDescription:_this.pFamily==1?'积累财富，快乐成长，每月用闲散资金在不经意间积累充足的财富':'月月红不负你的期待，1万起存，一次存入，每月领息',
        //                 shareUrl:'/static/wealthFinance/pages/wealth.html#/wealthshare?flag='+_this.pFamily,
        //                 isNeedPortAndHost:'1'
        //             }
        //             ShareWeixinFunction(param);
        //         }
        //     });
        //     memuList.push({
        //         name: '朋友圈', menuId: 'but_1_9', type: 2, func: function () {
        //             let param = {
        //                 shareType:1,
        //                 shareTitle:'分享'+(_this.pFamily==1?'快乐金':'月月红'),
        //                 ShareDescription:_this.pFamily==1?'积累财富，快乐成长，每月用闲散资金在不经意间积累充足的财富':'月月红不负你的期待，1万起存，一次存入，每月领息',
        //                 shareUrl:'/static/wealthFinance/pages/wealth.html#/wealthshare?flag='+_this.pFamily,
        //                 isNeedPortAndHost:'1'
        //             }
        //             ShareWeixinFunction(param);
        //         }
        //     });
        //     //泸州银行去掉权限查询menu
        //     // if (_this.authUrl) {
        //     //     memuList.push({
        //     //         name: '权限查询', menuId: 'but_1_7', type: 2, func: function () {
        //     //             openPage(_this.authUrl+'&appletUAId=4385430044688&TGC=12345&ProdId=5634&isFromApproval=true');//权限查询回退至申请页
        //     //         }
        //     //     });
        //     // }
        //     initTitleMenu(memuList);//设置title及按钮
        // },
    }
}
</script>
<style lang="less">
    @import '~components/style/common.less';
    .wealth-detail{
        background: @color-white;
        .wealth-info{
            display: flex;
            text-align: center;
            border-bottom: 1px solid @color-bg;
            .info-rate,.info-date{
                flex: 1;
                display: inline-flex;
                flex-direction: column;
                justify-content: center;
                margin: .8rem 0;
            }
            .info-rate{
                border-right: 1px solid @color-bg;
                .rate-num{
                    color: @color-blue;
                    font-size: .48rem;
                    font-weight: bolder;
                }
            }
            .info-date{
                .date-num{
                    font-size: .48rem;
                    font-weight: bolder;
                }
            }
        }
        .wealth-tip{
            display: flex;
            text-align: center;
            align-items: center;
            border-bottom: .3rem solid @color-bg;
            padding: .4rem 0;
            span{
                flex: 1;
            }
            .save-date{
                border-right: 1px solid #ccc;
                border-left: 1px solid #ccc;
            }
        }
        .wealth-desc{
            padding: 0 .3rem;
            .desc-item{
                display: flex;
                padding-top: .4rem;
                align-items: center;
                .desc-icon{
                    height: .72rem;
                    width: .72rem;
                }
                .desc-text{
                    flex: 1;
                    display: inline-flex;
                    flex-direction: column;
                    padding-left: .2rem;
                }
                &:last-child{
                    span{
                        color: @color-blue;
                    }                    
                }
            }        
        }
        .info-text{
            color:@fc-info;
        }
    }
</style>
