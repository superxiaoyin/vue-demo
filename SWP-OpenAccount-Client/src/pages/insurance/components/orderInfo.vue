<template>
    <div class="buyconfirm-warp">
        <div class="buyconfirm-header">
            <group title="保险信息">
                <cell title="流水号" :value="info.transSeq"></cell>
                <cell title="价格" :value="info.insuranceAmount /100 + '元'"></cell>
                <cell title="保单状态" :value="info.orderStatus == '00' ? '支付成功' : info.orderStatus == '10' ? '待支付' : info.orderStatus == '13' ? '已过期' : info.orderStatus == '01' ? '支付失败' : info.orderStatus == '07' ? '支付关闭' : '支付中'"></cell>
                <cell title="保险名称" :value="info.orderName"></cell>
                <cell title="保险时间" :value="info.insurStartDate+'至'+info.insurDeadLine"></cell>
            </group>
            <group title="投保人信息">
                <cell title="姓名" :value="info.insureName"></cell>
                <cell title="电话" :value="info.phone"></cell>
                <cell title="身份证号" :value="info.insureIdNo"></cell>
                <cell title="地址" :value="info.address"></cell>
            </group>
            <group title="被保人信息">
                <cell title="姓名" :value="info.backInsureName"></cell>
                <cell title="身份证号" :value="info.backInsureIdNo"></cell>
            </group>
                        
        </div>
    </div>
</template>

<script>
import { Cell,Group,CellBox,Badge } from 'vux'
import {getBusinessData,setBusinessData} from '../../handler/handler'
import {getUrlParams} from 'sslib/common/extend'
var urlParams = getUrlParams();
var phone = urlParams.phone;
export default {
    name:'orderinfo',
    components: {
       Cell,Group,CellBox,Badge
    },
    data() {
        return {
            transseq:'',
            info:{}
        }
    },
    created() {
        let _this = this;
        if(!!_this.$route.query.transseq){
            let transseq = decodeURIComponent(_this.$route.query.transseq);
            _this.info = getBusinessData(transseq)
        }
        console.log(_this.info)
    },
    methods: {
    }
}

</script>

<style lang="less"> 
    @import (reference) "~components/style/common";
    @import '~vux/src/styles/1px.less';
</style>
