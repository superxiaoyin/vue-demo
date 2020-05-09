<template>
    <div class="search">
        <charge-card :chargeType="chargeType" chargeKey="search">
            <div class="search-info" slot="charge-info">
                <SnText
                    title="缴费地区"
                    class="right"
                    text-align="right"
                    readonly
                    :maxlength="30"
                    ref="paymentRegion"
                    fieldKey="paymentRegion"
                    :value="content.addr"
                ></SnText>
                <SnText
                    title="缴费单位"
                    class="right non-top"
                    text-align="right"
                    readonly
                    :maxlength="30"
                    ref="paymentUnit"
                    fieldKey="paymentUnit"
                    :value="content.institutionName"
                ></SnText>
            </div>
            <div class="search-input" slot="charge-input">
                <div class="user-num">
                    <div class="user-label">用户编号</div>
                    <SnNumber
                        v-model="content.userNo"
                        placeholder="请输入用户编号"
                        :minlength="1"
                        :maxlength="10"
                    ></SnNumber>    
                </div>                       
            </div>
        </charge-card>
        <div class="agreement">
            <i :class="agree?'agree_pre':'agree_nor'" @click="agree=!agree"></i>
            <span class="agree-text">我已阅读并同意</span>
            <a class="sn-pointer" @click="openProtocol">《自助缴费协议》</a>
        </div>
        <SnButton :showLoading="loadingFlag" @SnButtonClick="submitSearch">查询</SnButton>
    </div>
</template>
<script>
import ChargeCard from './chargecard'
import {SnText,SnNumber} from 'biscomponents'
import { SnButton } from 'components'
import {chargeData,openRouterByValue,getServerData} from '../../handler/handler'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import {showToast,initTitleMenu,openPage,getUrlParams,throttle, goBackPage } from 'sslib/common/extend'
let urlParams = getUrlParams();
let chargeType = Number(urlParams.chargeType || 0);
export default {
    data(){
        return{
            selectFlag:{'show':false},//是否显示选择控件 默认为false
            subTitle:'',
            popupShowFlag:false,
            chargeType: chargeType,
            chargeInfo: '',
            content: {addr:'泸州'},
            checkBox:true,
            loadingFlag:false,
            agree: true,
        }
    },
    components:{
        SnText,SnNumber,SnButton,ChargeCard
    },
    created(){
        let _this = this;
        if(!!_this.$route.query.chargeType){
            _this.chargeType = Number(_this.$route.query.chargeType);
        }
        _this.init();
    },
    methods:{
        init(){
            let _this = this;
            if(!!_this.$route.query.userNo){
                _this.content.userNo = _this.$route.query.userNo;
            }
            _this.chargeInfo = chargeData[_this.chargeType] || {};
            _this.subTitle = ['新增缴费'];
            _this.content.institutionName = _this.chargeInfo.institutionName;
            initTitleMenu(_this.subTitle);
            notifyAppBackEvent(); //调用app，通知返回事件
            registerHandler('notifyAppBack', function (data) {//点击app返回事件
                throttle(function () {
                    goBackPage('sswbv_close_browser');
                }.bind(this));
            })
        },
        /**
         * 提交查询
         */
        async submitSearch(){
            let _this = this;
            if(!_this.validate()){
                return;
            }
            let data = {
                userNo: _this.content.userNo,
                addr: _this.content.addr,
                institutionName: _this.content.institutionName,
                feeType: _this.chargeType,
            }
            _this.loadingFlag = true;
            try {
                const result = await getServerData('charging/charging.queryPayInfo',data);
                _this.loadingFlag = false;
                if(result.code===0){
                    if(result.feeInfo.optType === 1){//月结
                        openRouterByValue('settlemonth',{feeInfo: encodeURIComponent(JSON.stringify(result.feeInfo)),userNo:_this.content.userNo},_this);
                    }else{//预存
                        openRouterByValue('prestore',{feeInfo: encodeURIComponent(JSON.stringify(result.feeInfo)),userNo:_this.content.userNo},_this);
                    }
                }
            } catch (error) {
                _this.loadingFlag = false;
                console.log(error);
            }            
        },
        /**
         * 数据校验
         */
        validate(){
            let _this = this;
            if(!_this.content.userNo){
                showToast('请输入用户编号','middle');
                return false;
            }else if(10 !== _this.content.userNo.length){
                showToast('请输入有效用户编号','middle')
                return false;
            }else if(!_this.agree){
                showToast('请阅读并同意自助缴费协议','middle');
                return false;
            }
            return true;
        },
        /**
         * 打开协议
         */
        openProtocol(){
            let _this = this;
            openRouterByValue('protocol',{userNo:_this.content.userNo},_this);
        }
    }
}
</script>
<style lang="less">
    @import '~components/style/common.less';
    .search{
        background: @color-bg;
        padding: .3rem;
        .search-info{
            background: @color-white;
            padding-top: .15rem;
            border-top-left-radius: .1rem;
            border-top-right-radius: .1rem;
        }
        
        .search-input{
            background: @color-white;
            .user-num{
                .weui-cell{
                    .weui-cell__ft{
                        input{
                            font-size: @fs-mob-big;
                            font-weight: bold;
                        }
                        ::-webkit-input-placeholder {
                            font-weight: normal;
                        }
                    }
                }
            }
        }
        .right{
            textarea{
                text-align: right !important;
            }
        }
        
        .non-top{
            padding-top: 0 !important;
        }
        .snPopupRight{
            border-bottom: 1px solid @color-bg;
            .weui-cell__ft{
                padding: 0 !important;
            }
        } 
        // .weui-cell{
        //     border-bottom: 1px solid @color-bg;
        // }
        .weui-cell:before{
            border-top: none !important;
        }
        .user-label{
            padding: .24rem .3rem 0 .3rem;
        }
        .agreement {
            display: flex;
            align-items: center;
            font-size: @fs-mob-smaller;
            margin: 0.3rem;
            .agree_pre{
                background: url('../../../resource/img/icon_agree_pre.png') no-repeat center;
            }
            .agree_nor{
                background: url('../../../resource/img/icon_agree_nor.png') no-repeat center;
            }
            .agree_pre,.agree_nor{
                display: inline-block;
                width: .24rem;
                height: .24rem;
                background-size: .24rem .24rem;
            }
            .agree-text{
                margin-left: 0.15rem;
                color: @fc-info;
            }
            a {
                color: #3891FF;
            }
        }
    }
</style>
