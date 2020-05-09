<template>
    <div class="query-main">
         <div class="person-info">
            <cell class="sn-text" title="费款所属期起" :value="joinInfo.payStart||'--'"></cell>
            <cell class="sn-text" title="费款所属期止" :value="joinInfo.payEnd||'--'"></cell>
            <cell class="sn-text" title="征收项目代码" :value="joinInfo.productType||'--'"></cell>
            <cell class="sn-text" title="征收项目名称" :value="joinInfo.productName||'--'"></cell>
            <cell class="sn-text" title="征收品目代码" :value="joinInfo.productPType||'--'"></cell>
            <cell class="sn-text" title="征收品目名称" :value="joinInfo.productPName||'--'"></cell>
            <cell class="sn-text" title="征收子目代码" :value="joinInfo.productZType||'--'"></cell>
            <cell class="sn-text" title="征收子目名称" :value="joinInfo.productZName||'--'"></cell>
        </div>
        <div class="person-info">
            <cell class="sn-text" title="缴费总金额">
                <slot><div class="sn-price">{{joinInfo.payMoney||'--'}}</div></slot>
            </cell>
            <!-- <cell class="sn-text" title="缴费比例" :value="joinInfo.nomarl||'--'"></cell>
            <cell class="sn-text" title="缴费基数" :value="joinInfo.nomarl||'--'"></cell> -->
        </div>

        <div class="notes" v-if="joinInfo.len !=1">
            缴费：会一次性缴费该险种全部项目
        </div>

        <div class="next-btn" v-show="goto">
            <SnButton @SnButtonClick="nextStep">下一步</SnButton>
        </div>
    </div>
</template>
<script>
import {Cell} from 'vux'
import { throttle, showToast } from 'sslib/common/extend'
import { openRouterByValue, setBusinessData,getServerDataH5 } from '../../handler/handler'
import { SnText, SnIDCard } from 'biscomponents'
import { SnButton,SnCell } from 'components'
export default {
    data(){
        return{
            idNum:"",
            payMoney:'198.00',
            subTitle: ['缴费信息'],
            goto:true,
            joinInfo:{
                paymentStart:'201906',
                paymentEnd:'99912',
                CollectionItemCode:'99912',
                CollectionItemName:'城乡居民基本',
                CollectionOrderCode:'99912',
                CollectionOrderName:'城乡居民基本',
                CollectionSonCode:'99912',
                CollectionSonName:'城乡居民基本',
                nomarl:'--',
            }
        }
    },
    components:{
        SnButton,SnCell,Cell
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
            console.log(_this.joinInfo)
            getServerDataH5(textUrl+'/SSP-HTTP/socialSecurity.queryIndividualPay',_this.joinInfo,'POST').then(result => {
                if(result.code === 0){
                    // let traInfo = result.traInfo;
                    _this.$set(_this.joinInfo,'traNum',result.traNum);
                    _this.$set(_this.joinInfo,'payMoney',result.traInfo.payMoney);
                    _this.$set(_this.joinInfo,'payStart',result.traInfo.payStart);
                    _this.$set(_this.joinInfo,'payEnd',result.traInfo.payEnd);
                }else{
                    showToast(result.rdesc);       
                    _this.goto = false
                }

            })
        },
        nextStep(){
            let _this = this;
            if(_this.goto){
                openRouterByValue("paycardInfo",{joinInfo:encodeURIComponent(JSON.stringify(_this.joinInfo))},_this);
            }
        }
    },
}
</script>
<style lang="less">
    @import '~components/style/common.less';
    .vux-label{width: 4rem !important}
    .notes{margin:10px 10px 0;font-size: 15px;color: #f78900;}
</style>
