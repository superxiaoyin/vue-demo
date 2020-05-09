<template>
    <div class="history">
        <div class="charge-title">
            <div class="title-wrapper">
                <i :class="'title-icon'+chargeType"></i>
                <span>{{chargeInfo.title}}</span>                
            </div>
            <span class="charge-add" @click="addCharge">新增</span>
        </div>
        <div class="history-info">
            <div v-for="(value,key) in historyData" class="info-item" @click="search(value)">
                <div class="user-info">
                    <label class="name">{{value.name}}</label>
                    <span class="userNo">{{key}}</span>
                </div>
                <i class="more-info"></i>
            </div>
        </div>
        <loading-page v-if="showLoading"></loading-page>
    </div>
</template>
<script>
import {LoadingPage} from '../../baseComponents'
import { registerHandler, notifyAppBackEvent, GetUserInfoFunction } from 'sslib/common/SnJsBridge'
import { chargeData,openRouterByValue,getServerData, getLocalData } from '../../handler/handler'
import { showToast,initTitleMenu,openPage,getUrlParams,throttle, goBackPage } from 'sslib/common/extend'
let urlParams = getUrlParams();
let chargeType = Number(urlParams.chargeType || 0);
export default {
    data(){
        return{
            chargeType: chargeType,
            chargeInfo: {},
            subTitle: '',
            historyData: {},
            showLoading: false
        }
    },
    components:{
        LoadingPage
    },
    created(){
        let _this = this;
        _this.init();
    },
    methods:{
        init(){
            let _this = this;
            if(!!_this.$route.query.chargeType){
                _this.chargeType = Number(_this.$route.query.chargeType);
            }
            _this.chargeInfo = chargeData[_this.chargeType] || {};
            _this.subTitle= _this.chargeInfo.title+'缴纳';
            initTitleMenu([_this.subTitle]);
            notifyAppBackEvent(); //调用app，通知返回事件
            registerHandler('notifyAppBack', function (data) {//点击app返回事件
                throttle(function () {
                    goBackPage('sswbv_close_browser');
                }.bind(this));
            })
            GetUserInfoFunction().then(uaData=>{
                let uaId = '';
                if(uaData){
                    uaId = uaData.UAId;
                }
                let chargeHistoryKey = "chargeHistory_"+uaId;
                if(!!getLocalData(chargeHistoryKey)&&!!getLocalData(chargeHistoryKey)[_this.chargeType]){
                    _this.historyData = getLocalData(chargeHistoryKey)[_this.chargeType];
                }
            })
        },
        /**
         * 新增缴费
         */
        addCharge(){
            let _this = this;
            openRouterByValue("search","",_this);
        },
        /**
         * 提交查询
         */
        async search(data){
            let _this = this;
            try {
                _this.showLoading = true;
                const result = await getServerData('charging/charging.queryPayInfo',data);
                _this.showLoading = false;
                if(result.code===0){
                    if(result.feeInfo.optType === 1){//月结
                        openRouterByValue('settlemonth',{feeInfo: encodeURIComponent(JSON.stringify(result.feeInfo)),historyType:1},_this);
                    }else{//预存
                        openRouterByValue('prestore',{feeInfo: encodeURIComponent(JSON.stringify(result.feeInfo)),historyType:1},_this);
                    }
                }
            } catch (error) {
                _this.showLoading = false;
                console.log(error);
            }  
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .history{
        padding: .3rem;
        background: @color-bg;
        .charge-title{
            display: flex;
            align-items: center;  
            justify-content: space-between;
            padding-bottom: .1rem;
            .title-wrapper{
                display: inline-flex;
                align-items: center; 
                .title-icon1{
                    background: url('../../../resource/img/charge/icon_water.png') no-repeat center;
                }
                .title-icon2{
                    background: url('../../../resource/img/charge/icon_electricity.png') no-repeat center;
                }
                .title-icon3{
                    background: url('../../../resource/img/charge/icon_gas.png') no-repeat center;
                }
                .title-icon1,.title-icon2,.title-icon3{
                    display: inline-block;
                    height: .58rem;
                    width: .58rem;
                    background-size: .58rem .58rem;
                }
            }
            .charge-add{
                color: @color-blue;
            }
        }
        .history-info{
            background: @color-white;
            border-radius: .1rem;
            padding: 0 .3rem;
            .info-item{
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: .45rem 0;
                border-bottom: 1px solid @color-bg;
                .user-info{
                    display: inline-flex;
                    flex-direction: column;
                    align-items: flex-start;
                    .name{
                        font-weight: bolder;
                        font-size: .34rem;
                    }
                    .userNo{
                        margin-top: .1rem;
                        color: @fc-info;
                    }
                }
                .more-info{
                    display: inline-block;
                    width: .45rem;
                    height: .45rem;
                    background: url('../../../resource/img/icon_narrow_right.png') no-repeat right;
                    background-size: .45rem .45rem;
                    cursor: pointer;
                }
                &:last-child{
                    border-bottom: none;
                }
            }
        }
    }
</style>
