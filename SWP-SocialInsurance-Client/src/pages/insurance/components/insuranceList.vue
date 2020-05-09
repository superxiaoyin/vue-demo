<template>
    <div class="query-main">
        <loading-page v-if="showLoading"></loading-page>
        <div v-else>
            <div class="base-info">
                <SnCell
                    class="sn-text"
                    title="姓名"
                    readonly
                    text-align="right"
                    :maxlength="30"
                    v-model="joinInfo.name"
                ></SnCell>
                <SnCell
                    class="sn-text"
                    title="证件类型"
                    readonly
                    text-align="right"
                    v-model="joinInfo.voucherName"
                ></SnCell>
                <SnCell
                    class="sn-text"
                    title="证件号码"
                    readonly
                    text-align="right"
                    v-model="joinInfo.idNum"
                ></SnCell>
                <SnCell
                    class="sn-text"
                    title="登记序号"
                    readonly
                    text-align="right"
                    v-model="joinInfo.num"
                ></SnCell>
            </div>
            <div class="joinList-title">
                <span>参保项目</span>
            </div>
            <div class="joinList-content">
                <div class="joinList-item" v-for="(itm,index) in joinInfo.joinInfoList" :key="index">
                    <div class="manager-name" @click="openDetail(itm)"><div class="manager-name-info">{{itm.managerName}}</div></div>
                    <div v-for="(item,idx) in itm.productInfoList" :key="idx">
                        <SnCell
                            class="sn-text"
                            title="征收项目名称"
                            readonly
                            text-align="right"
                            v-model="item.productName"
                        ></SnCell>
                        <SnCell
                            class="sn-text"
                            title="开始缴费年月"
                            readonly
                            text-align="right"
                            v-model="item.startDate"
                        ></SnCell>
                        <SnCell
                            class="sn-text"
                            title="终止缴费年月"
                            readonly
                            text-align="right"
                            v-model="item.endDate"
                        ></SnCell>
                        <div class="button-two" v-if="item.productType=='10210'">
                            <SnButton class="btn-left" @SnButtonClick="openPayBack(item,itm)">核定缴费</SnButton>
                            <SnButton class="btn-right" @SnButtonClick="openNormal(item,itm)">正常缴费</SnButton>
                        </div>
                        <div class="button-center" v-if="item.productType=='10212'">
                            <SnButton class="btn-center" @SnButtonClick="openPayBack(item,itm)">核定缴费</SnButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { throttle, showToast } from 'sslib/common/extend'
import { openRouterByValue, setBusinessData, getBusinessData, getServerDataH5,backRouterByValue,getuserName } from '../../handler/handler'
import { LoadingPage } from '../../baseComponents'
import { SnText, SnIDCard } from 'biscomponents'
import { SnButton, SnCell } from 'components'
export default {
    data(){
        return{
           param:{},
           showLoading:false,
           subTitle: ['社保缴纳'],
           joinInfo:{
            // num:'2109349348953458439',voucherType:'居民身份证',name:'李四',idNum:'45080431029844324',
            // joinInfoList:[{
            //     productType:'10210',
            //     productName:'城乡居民基本',
            //     productPType:'102313565',
            //     productPName:'城乡居民基本',
            //     productZType:'102313537',
            //     productZName:'城乡居民基本',
            //     startDate:'201906',
            //     endDate:'999912',
            //     managerNum:'15105210000',
            //     managerName:'国家税务总局泸州银行',
            //     handler:'15546151510001',
            //     userType:'城乡居民基本',
            //     userNum:'201908261300026',
            // }]
           },
        }
    },
    components:{
        SnButton,SnText,SnIDCard,LoadingPage,SnCell
    },
    computed:{
        cardType(){
            return  "身份证"
        }
    },
    created(){
        let _this = this;
        _this.init();
    },
    methods:{
        init(){
            let _this = this;
            if(!!_this.$route.query.joinInfo){
                
                // _this.joinInfo = JSON.parse(encodeURI(_this.$route.query.joinInfo));
           
                console.log(getBusinessData(_this.$route.query.joinInfo))
                _this.joinInfo = getBusinessData(decodeURI(_this.$route.query.joinInfo))
                // console.log(this.joinInfo)
            }
        },
        openDetail(item){
            let _this = this;
            item.name = _this.joinInfo.name;
            item.idNum = _this.joinInfo.idNum;
            item.voucherType = _this.joinInfo.voucherType;
            item.today = _this.joinInfo.today;
            item.userTypeName = getuserName(item.userType);
            
            // console.log(item)
            // setBusinessData(item.userNum,JSON.stringify(item))
            openRouterByValue("insuranceDetail",{joinInfo:encodeURIComponent(JSON.stringify(item))},_this);
        },
        openNormal(item,itm){
            // console.log(item)
            let _this = this;
            item.name = _this.joinInfo.name;
            item.idNum = _this.joinInfo.idNum;
            item.voucherType = _this.joinInfo.voucherType;
            item.payType = '1';
            item.handler = itm.handler
            item.userNum =  itm.userNum
            item.today = _this.joinInfo.today;
            item.userType = itm.userType
            item.userTypeName = getuserName(itm.userType);
            openRouterByValue("normalPay",{joinInfo:encodeURIComponent(JSON.stringify(item))},_this);
        },
        openPayBack(item,itm){
            let _this = this;
            // console.log(itm.productInfoList.length)
            item.len = itm.productInfoList.length;
            item.name = _this.joinInfo.name;
            item.idNum = _this.joinInfo.idNum;
            item.voucherType = _this.joinInfo.voucherType;
            item.payYear = "0000";
            item.payMoney = "0";
            item.payType = '2';
            item.userNum =  itm.userNum
            item.today = _this.joinInfo.today;
            item.userType = itm.userType
            item.userTypeName = getuserName(itm.userType);
            // console.log(item)
            openRouterByValue("normalPayDetail",{joinInfo:encodeURIComponent(JSON.stringify(item))},_this);
        }
    },
}
</script>
<style lang="less">
    @import '~components/style/common.less';
    .query-main{
        .base-info{
            background: @color-white;
            .sn-text{
                height: .9rem !important;
            }
            .sn-cell .sn-cell-label{
                width: 2.1rem !important;
                color: @fc-info !important;
            }
            .borderTip{
                height: .3rem;
                background: @color-bg;
            }
        }
        .joinList-title{
            margin: 0 .3rem;
            height: .9rem;
            line-height: .9rem;
        }
        .joinList-content{
            .manager-name{
                display: -webkit-box;
                padding: 0 .3rem;
                height: .9rem;
                line-height: .9rem;
                border-bottom: 1px solid @color-bg; 
                .manager-name-info{
                    width:95%;
                }
                &:after {
                    content: "";
                    width: .42rem;
                    height: .42rem;
                    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAQlBMVEUAAACAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIXJE8ckAAAAFnRSTlMA/r7y6KZ7bz4pHw8H38e1lYliV0wxns2HqAAAAGNJREFUOMvt00kSgCAQBEELFcR9/f9XDX5QER6lz3mAmZ6m5s/JYfQ4sHg9rXTZ60D3aD1vtIPXfdE6Pdxe73B5fcDpdYTkdYL4Hftn+A/60fml+HX7IvmK+vL7s/IHW1NT8gLVxQKJ1fadGgAAAABJRU5ErkJggg==) no-repeat 50%;
                    background-size: .42rem .42rem;
                    display: inline-block;
                    vertical-align: middle;
                    cursor: pointer;
                }
            }
            .joinList-item{
                background: @color-white;
                margin: 0 0 10px 0;
                .sn-text{
                    height: .9rem !important;
                }
                .borderTip{
                    height: .3rem;
                    background: @color-bg;
                }
                .sn-cell .sn-cell-label{
                    width: 2.1rem !important;
                    color: @fc-info !important;
                }
                .button-two{
                    display: flex;
                    height: 1.3rem;
                    .sn-button{
                        padding: 0.35rem 0;
                        cursor: pointer;
                        button{
                            color: #E8422E;
                            opacity: 1;
                            border: 0px solid rgba(214,61,43,1);
                            border-width: .02rem;
                            line-height: 0.54rem;
                            background: transparent;
                        }
                    }
                    .btn-left{
                        width: 1.92rem;
                        margin-left: 1.36rem;
                        margin-right: .6rem;
                    }
                    .btn-right{
                        width: 1.92rem;
                    }
                }
                .button-center{
                    display: flex;
                    height: 1.3rem;
                    .sn-button{
                        padding: 0.35rem 0;
                        cursor: pointer;
                        button{
                            color: #E8422E;
                            opacity: 1;
                            border: 0px solid rgba(214,61,43,1);
                            border-width: .02rem;
                            line-height: 0.54rem;
                            background: transparent;
                        }
                    }
                    .btn-center{
                        width: 1.92rem;
                        margin: auto;
                    }
                }
            }
        }
    }
</style>
