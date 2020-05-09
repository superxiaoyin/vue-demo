<template>
    <div class="query-main">
        <div class="insurance-detail-info">
            <SnCell
                class="sn-text"
                title="主管税务机关名称"
                readonly
                text-align="right"
                v-model="joinInfo.managerName"
            ></SnCell>
            <SnCell
                class="sn-text"
                title="主管税务机关代码"
                readonly
                text-align="right"
                v-model="joinInfo.managerNum"
            ></SnCell>
            <SnCell
                class="sn-text"
                title="人员编号"
                readonly
                text-align="right"
                v-model="joinInfo.userNum"
            ></SnCell>
            <SnCell
                class="sn-text"
                title="社保经办机构代码"
                readonly
                text-align="right"
                v-model="joinInfo.handler"
            ></SnCell>
        </div>
         <div class="insurance-detail-info list" v-for="(item,index) in joinInfo.productInfoList" :key="index">
                <SnCell
                    class="sn-text"
                    title="缴费人类型"
                    readonly
                    text-align="right"
                    v-model="joinInfo.userType == 0 ? '城乡居民' : joinInfo.userType == 1 ? '灵活就业' : ''"
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
                <SnCell
                    class="sn-text"
                    title="征收项目代码"
                    readonly
                    text-align="right"
                    v-model="item.productType"
                ></SnCell>
                <SnCell
                    class="sn-text"
                    title="征收项目名称"
                    readonly
                    text-align="right"
                    v-model="item.productName"
                ></SnCell>
                <SnCell
                    class="sn-text"
                    title="征收品目代码"
                    readonly
                    text-align="right"
                    v-model="item.productPType"
                ></SnCell>
                <SnCell
                    class="sn-text"
                    title="征收品目名称"
                    readonly
                    text-align="right"
                    v-model="item.productPName"
                ></SnCell>
                <SnCell
                    class="sn-text"
                    title="征收子目代码"
                    readonly
                    text-align="right"
                    v-model="item.productZType"
                ></SnCell>
                <SnCell
                    class="sn-text"
                    title="征收子目名称"
                    readonly
                    text-align="right"
                    v-model="item.productZName"
                ></SnCell>
                <div class="button-two" v-if="item.productType=='10210'">
                    <SnButton class="btn-left" @SnButtonClick="openPayBack(item)">核定缴费</SnButton>
                    <SnButton class="btn-right" @SnButtonClick="openNormal(item)">正常缴费</SnButton>
                </div>
                <div class="button-center" v-if="item.productType=='10212'">
                    <SnButton class="btn-center" @SnButtonClick="openPayBack(item)">核定缴费</SnButton>
                </div>
            </div>
    </div>
</template>
<script>
import { throttle, showToast } from 'sslib/common/extend'
import { openRouterByValue, setBusinessData,getBusinessData,getServerDataH5 } from '../../handler/handler'
import { SnText, SnIDCard } from 'biscomponents'
import { SnButton, SnCell } from 'components'
export default {
    data(){
        return{
           joinInfo:{},
           subTitle: ['项目详情'],
        }
    },
    components:{
        SnButton,SnText,SnIDCard,SnCell
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
                _this.joinInfo = JSON.parse(decodeURIComponent(_this.$route.query.joinInfo));
            }
        },
        openNormal(item){
            let _this = this;
            _this.joinInfo.payType = '1';
            _this.joinInfo.productZType = item.productZType
            _this.joinInfo.productPType = item.productPType
            _this.joinInfo.productType = item.productType
            openRouterByValue("normalPay",{joinInfo:encodeURIComponent(JSON.stringify(_this.joinInfo))},_this);
        },
        openPayBack(item){
            let _this = this;
            _this.joinInfo.payYear = "0000";
            _this.joinInfo.payMoney = "0";
            _this.joinInfo.payType = '2';

            _this.joinInfo.productZType = item.productZType
            _this.joinInfo.productPType = item.productPType
            _this.joinInfo.productType = item.productType

            _this.joinInfo.productZName = item.productZName
            _this.joinInfo.productPName = item.productPName
            _this.joinInfo.productName = item.productName

            // console.log(_this.joinInfo)
            openRouterByValue("normalPayDetail",{joinInfo:encodeURIComponent(JSON.stringify(_this.joinInfo))},_this);
        }
    },
}
</script>
<style lang="less">
    @import '~components/style/common.less';
    .insurance-detail-info{
        background: @color-white;
        .sn-text{
            height: .9rem !important;
        }
        .weui-cell{
            padding: .24rem 0 !important;
            border-bottom: 1px solid @color-bg; 
            .weui-label{
                width: 2rem !important;
            }
            .vux-cell-bd{
                .vux-label{
                    width: 2rem !important;
                }
            }
        }
        .borderTip{
            height: .3rem;
            background: @color-bg;
        }
        .sn-cell .sn-cell-label{
            width: 2.6rem !important;
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
    .list{
        margin: 10px 0;
    }
</style>
