<template>
    <div class="charge-card">
        <div class="charge-title">
            <div class="title-wrapper">
                <i :class="'title-icon'+chargeType"></i>
                <span>{{chargeInfo.title}}</span>                
            </div>
            <span class="charge-add"  v-if="historyType === 1" @click="addCharge">新增</span>
        </div>
        <slot name="charge-info"></slot>
        <div class="ball">
            <div class="ball-line"></div>
        </div>
        <slot name="charge-input"></slot>
        <div class="wave"></div>
        <div v-if="chargeKey=='charge'">
            <sn-button @SnButtonClick="submitMoney" :showLoading="loadingFlag">{{submitText}}</sn-button>
            <!-- <div class="charge-record">
                <span @click="showRecord">缴费记录</span>
            </div> -->
            <div v-transfer-dom>
                <popup
                    ref="popup"
                    v-model="showPopup"
                    :descriptionText="descriptionText"
                    :closeOnClickingMask="false"
                    :showCancel="true"
                    :selectFlag="selectFlag"
                    @on-click-cancel="cancelFun">
                    <div class="confirm-money">
                        <span>¥<span class="money">{{chargeMoney|moneyFrt}}</span></span>
                    </div>
                    <div class="confirm-info">
                        <sn-cell title="订单信息" value="转账"></sn-cell>
                        <picker ref="picker" @changeTitle="setConfirmTitle" :selectFlag="selectFlag" title="付款方式" text-align="right" :dataList="selectList"></picker>
                    </div>
                    <div class="confirm-btn">
                        <sn-button @SnButtonClick="confirm" :showLoading="payLoading">{{payText}}</sn-button>
                    </div>
                </popup>
            </div>
        </div>
    </div>
</template>
<script>
import {Popup,Picker} from '../../baseComponents'
import {ChargePayModel} from '../../handler/model'
import {chargeData,openNativePage,openRouterByValue,backRouterByValue,setBusinessData,getBusinessData,formatSelectList,getSignData,getServerData,getLocalData,setLocalData} from '../../handler/handler'
import {SnButton,SnCell} from 'components'
import {SignDataFunction,GetUserInfoFunction} from 'sslib/common/SnJsBridge'
import { showToast } from 'sslib/common/extend'
export default {
    data(){
        return{
            chargeInfo: {},
            showPopup: false,
            loadingFlag: false,
            payLoading: false,
            descriptionText:'确认付款',
            selectFlag:{'show':false},//是否显示选择控件 默认为false
            selectList:[],
            payText: '立即付款',
            uaId:'',
        }
    },
    components:{
        SnButton,Popup,SnCell,Picker
    },
    created(){
        let _this = this;
        _this.chargeInfo = chargeData[_this.chargeType];
        GetUserInfoFunction().then(uaData=>{
            if(uaData){
                _this.uaId = uaData.UAId;
            }
        })
    },
    props:{
        chargeType:{
            type: Number,
            default: 0
        },
        chargeKey:{
            type:String,
            default:''
        },
        submitText:{
            type:String,
            default:''
        },
        chargeMoney:{
            type:Number,
        },
        chargeData:{
            type:Object,
            default:{}
        },
        historyType:{
            type:Number,
            default:0
        }
    },
    methods:{
        /**
         * 提交订单
         */
        submitMoney(){
            let _this = this;
            if(!!getBusinessData('selectListData')){
                _this.formatData(getBusinessData('selectListData'));
            }else{
                _this.queryCardList();
            }
        },
        /**
         * 取消弹框
         */
        cancelFun(){
            let _this = this;
            _this.$refs.picker.popupShowFlag = false;
            _this.selectFlag.show = false;
        },
        /**
         * 设置弹框title
         */
        setConfirmTitle(title){
            this.$refs.popup.titleText = title;
        },
        /**
         * 查询账户列表
         */
        async queryCardList(){
            let _this = this;
            const data = {
                cpyId:-1,
                validityCheck: 1
            }
            try {
                _this.loadingFlag = true;
                const result = await getServerData('salaryCard/salaryCard.queryCardList',data);
                _this.loadingFlag = false;
                if(result.code === 0){
                    if(result.cardList.length){
                        _this.formatData(result.cardList);
                    }else{
                        showToast(`暂无可用账户,无法进行${_this.chargeInfo.title}缴纳`,"middle");
                    }
                }
            } catch (error) {
                _this.loadingFlag = false;
                console.log(error);
            } 
        },
        /**
         * 新增缴费
         */
        addCharge(){
            let _this = this;
            openRouterByValue("search","",_this);
        },
        /**
         * 格式化账户数据
         */
        formatData(list){
            let _this = this;
            if(!getBusinessData('selectListData')){
                _this.selectList = formatSelectList(list);
                setBusinessData('selectListData',_this.selectList);
            }else{
                _this.selectList = list;
            }
            _this.showPopup = true;
        },
        /**
         * 数据校验
         */
        validate(){
            let _this = this;
            if(!_this.selectList.length){
                showToast(`暂无可用账户,无法进行${_this.chargeInfo.title}缴纳`,"middle");
                return false;
            }else if(!_this.chargeMoney){
                showToast('请输入充值金额','middle');
                return false;
            }else if(Number(_this.chargeMoney)===0){
                showToast("缴费金额必须大于0","middle");
                return false;
            }
            return true;
        },
        /**
         * 立即付款
         */
        async confirm(){
            let _this = this;
            if(!_this.validate()){
                return;
            }
            let timeStamp = new Date().getTime()+"";
            let payData = new ChargePayModel(_this.chargeData.name,
                                _this.chargeData.account,
                                _this.$refs.picker.accountData.account,
                                _this.chargeMoney,
                                _this.chargeType,
                                _this.$refs.picker.accountData.bankName,timeStamp);
            if(_this.chargeType === 3){//气费的缴费编号
                payData.payFeeNum = _this.chargeData.payFeeNum;
            }else{
                payData.optType = _this.chargeData.optType;//水电的操作类型
                if(_this.chargeType === 1 && _this.chargeData.optType === 1){//水费月结 月份字段
                    payData.month = _this.chargeData.month;
                }
            }
            //1.获取签名 2.调安全键盘获取支付密码 3.调支付接口去缴费
            try {
                const data = {
                    account: _this.$refs.picker.accountData.account,
                    money: Number(_this.chargeMoney),
                    name: _this.chargeData.name,
                    timeStamp:timeStamp
                }
                const result = await getSignData(data);
                if(!!result.data.signData){
                    payData.extraInfo.signData.sign = result.data.signData;
                    const pwdData = await openNativePage('IntentAction_PayPasswordActivity', [{ key: "isEncrypted", value: 1, type: "int" }],[{key: "result_key",value: "",type: "string"}]);
                    if(!!pwdData[0].value){
                        payData.pwd = pwdData[0].value;
                    }
                    _this.payLoading = true;
                    _this.payText = "正在付款...";
                    const payResult = await getServerData('charging/charging.pay',payData,false);
                    _this.payLoading = false;
                    _this.payText = "立即付款";
                    let data = {};
                    if(payResult.code === 0 && payResult.status === 1){//支付成功
                        data.status = 1;
                        data.text = '支付成功';
                        data.amount = payData.money;
                        data.infoList = [
                            {title:'付款方式',value:_this.$refs.picker.accountData.title},
                            {title:'收款方',value:_this.chargeData.institutionName}
                        ];
                        _this.saveChargeHistory();
                    }else{
                        data.status = 0;
                        data.text = '支付失败';
                        data.desc = payResult.desc;
                    }
                    openRouterByValue("result",{result:encodeURIComponent(JSON.stringify(data))},_this);
                }
            } catch (error) {
                console.log(error);
                _this.payText = "立即付款";
                _this.payLoading = false;
            }
        },
        /**
         * 保存缴费历史数据
         */
        saveChargeHistory(){
            let _this = this;
            let chargeHistoryKey = "chargeHistory_"+_this.uaId;
            let history = getLocalData(chargeHistoryKey);
            const userData = {
                name: _this.chargeData.name,
                userNo: _this.chargeData.account,
                addr:'泸州',
                institutionName: _this.chargeData.institutionName,
                feeType: _this.chargeType
            };
            if(!history){
                history = {};
                history[_this.chargeType] = {};
                history[_this.chargeType][_this.chargeData.account] = userData;
                setLocalData(chargeHistoryKey,history);
            }else{
                if(!history[_this.chargeType]){
                    history[_this.chargeType] = {};
                    history[_this.chargeType][_this.chargeData.account] = userData;
                    setLocalData(chargeHistoryKey,history);
                }else{
                    if(!history[_this.chargeType][_this.chargeData.account]){
                        history[_this.chargeType][_this.chargeData.account] = userData;
                        setLocalData(chargeHistoryKey,history);
                    }
                }
            }
        },
        /**
         * 查看缴费记录
         */
        showRecord(){
            let _this = this;
            showToast(`此功能暂未开放`,"middle");
            // openRouterByValue('record',{optType: _this.chargeData.optType || 2,feeInfo: encodeURIComponent(JSON.stringify(_this.chargeData)),userNo: _this.chargeData.account,historyType: _this.historyType},_this);
        },
    },
    watch:{
        "selectFlag.show"(newVal, oldVal) {
            if (!this.selectFlag.show) {
                //父组件隐藏子组件
                this.$refs.picker.popupShowFlag = false;
            }
        }
    }
}
</script>
<style lang="less">
    @import '~components/style/common.less';
    .charge-card{
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
        .ball{
            display: flex;
            align-items: center;
            height: .55rem;
            background: url('../../../resource/img/charge/icon_ball.png') no-repeat center;
            background-size: 100% .55rem;
            .ball-line{
                display: block;
                width: 100%;
                height: 1px;
                border-top: 1px dashed @color-bg;
            }
        }
        .wave{
            height: .3rem;
            background: url('../../../resource/img/charge/icon_wave.png') no-repeat center;
            background-size: 100% .3rem;
        }
        .charge-record{
            text-align: center;
            padding-top: 1rem;
            color: #3891FF;
        }
        .confirm-money{
            padding: 0 .3rem;
            font-weight: bold;
            text-align: center;
            height: 1.5rem;
            line-height: 1.5rem;
            span{
                font-size: .54rem;
            }
            .money{
                padding-left: .1rem;
            }
        }
        .confirm-info{
            padding: 0 .3rem;
            .sn-cell{
                padding: .24rem 0 !important;
                border-bottom: 1px solid @color-bg;
            }
            .picker{
                .weui-cell{
                    padding: .24rem 0 !important;
                    border-bottom: 1px solid  @color-bg;
                }                     
            }
        }
        .confirm-btn{
            padding: 0 .3rem;
        }
    }
</style>
