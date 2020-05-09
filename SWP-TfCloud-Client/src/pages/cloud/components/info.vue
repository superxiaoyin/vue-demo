<template>
    <div class="card-list">
        <SnLoading v-if="pageLoading"></SnLoading>

        <div v-else>
            <group>
                <cell title="账号" :value="cardNum" value-align='left'></cell>
                <cell title="存款类型" :value="cardInfo.depositType == 10 ? '储蓄活期' : cardInfo.depositType == 11 ? '整存整取' : cardInfo.depositType == 12 ? '定活两便' : cardInfo.depositType == 13 ? '存本取息' : cardInfo.depositType == 14 ? '零存整取' : cardInfo.depositType == 15 ? '通知存款' : cardInfo.depositType == 16 ? '教育储蓄' : cardInfo.depositType == 17 ? '整存零取' : cardInfo.depositType == 20 ? '对公活期': cardInfo.depositType == 21 ? '对公整存整取' : cardInfo.depositType == 22 ? '对公通知存款' : cardInfo.depositType == 30 ? '同业活期存款' : cardInfo.depositType == 31 ? '同业整存整取' : cardInfo.depositType == 32 ? '同业通知存款' : '' "  value-align='left'></cell>
                <cell title="账面余额" :value="cardInfo.balance / 100 || 0"  value-align='left'></cell>
                <cell title="可用余额" :value="cardInfo.availableBalance / 100 || 0"  value-align='left'></cell>
                <cell title="开户日期" :value="cardInfo.accountTime*1000 | time"  value-align='left'></cell>
                <cell title="账户状态" :value=" cardInfo.status == '1' ?  '正常': cardInfo.status == '2' ? '黑名单' : cardInfo.status == '3' ? '销户' :  cardInfo.status == '4' ? '冻结账户' : cardInfo.status == '5' ? '冻结取款' : cardInfo.status == '6' ? '账户止付' :  cardInfo.status == '7' ? '不动户' :  cardInfo.status == '9' ? '预销户': cardInfo.status == '10' ? '无效介质': cardInfo.status == '11' ? '六个月未动账': cardInfo.status == '12' ? '金额止付': cardInfo.status == '13' ? '金额冻结':''"  value-align='left'></cell>
                <cell title="账户类型" :value="cardInfo.baseAccountFlag == '10' ? '一类户': cardInfo.baseAccountFlag == '11' ? '二类户': cardInfo.baseAccountFlag == '12' ? '三类户':'' " value-align='left'></cell>
            </group>
        </div>
    </div>
</template>
<script>
import { Cell, Group } from 'vux'
import { SnLoading } from 'components'
import {getServerData,setBusinessData,getBusinessData,getServerDataH5,formatNumber} from '../../handler/handler'
import { throttle, showToast, getUrlParams } from 'sslib/common/extend'
var urlParams = getUrlParams();
export default {
    data(){
        return{
            card:{},
            cardNum:'',
            userinfo:{},
            cardInfo:{},
            stat:'',
            types:'',
            pageLoading:true
        }
    },
    created(){
        let _this = this;
        _this.card = this.$store.state.parms
        _this.userinfo = this.$store.state.userInfo
        _this.cardNum = formatNumber(_this.card.cardNumber,6,4)
        _this.init()
    },
    components:{
      Cell, Group,SnLoading
    },
    methods:{
        //数据初始化
        async init(){
            let _this = this;
   
            const data = {
                phone:_this.userinfo.userPhone,
                UAId:_this.userinfo.UAId,
                cpyId:-1,
                orderType: 1,
                account:_this.card.cardNumber
            }
            try {
                const result = await getServerDataH5('/yqt/accountmgr/accountMgr.queryAccountInfo',data,'POST',true);
                console.log(result)
                if(result.code == 0){
                    _this.cardInfo = result
                    _this.pageLoading = false

                }else{
                    showToast(result.rdesc)
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}
</script>
<style lang="less">
    // @import '~components/style/common.less';
    .weui-cell{padding: 15px 15px !important;
        .vux-label{font-size: 16px !important;width: 90px !important;}
        .weui-cell__ft{font-size: 16px;}
    }
</style>
