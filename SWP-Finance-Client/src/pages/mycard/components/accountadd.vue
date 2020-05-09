<template>
    <div class="account-add">
        <div class="add-title">请选择要加挂的账户</div>
        <div class="account-list" v-if="superCardList.length">
            <div class="account-item" v-for="(item,index) in superCardList" @click="chooseAccount(index)" :key="index" :class="{'selected':chooseIndex === index}">
                <div class="card-info">
                    <i class="bank-icon"></i>
                    <span class="bank-name">{{item.bankName}}</span> 
                </div>
                <div class="card-number"><span>****</span><span>****</span><span>****</span><span class="number">{{item.cardNumber.substr(-4)}}</span></div>
            </div>
        </div>
        <div class="add" @click="addCard">
            <i class="add-icon"></i>
            <span>添加银行卡</span>
        </div>
        <SnButton @SnButtonClick="confirmAdd">确定</SnButton>  
    </div>
</template>
<script>
import { SnButton,SnLoading } from 'components'
import { openRouterByValue,backRouterByValue,getServerData,setBusinessData,getBusinessData,getNonSuperList } from '../../handler/handler'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { throttle, goBackPage, initTitleMenu, showToast } from 'sslib/common/extend'
export default {
    data(){
        return{
            chooseIndex: 0,
            cardData:{},
            superCardList: [],
        }
    },
    created(){
        let _this = this;
        initTitleMenu(['加挂账户']);
        _this.init();
    },
    components:{
        SnButton
    },
    methods:{
        /**
         * 数据初始化
         */
        init(){
            let _this = this;
            notifyAppBackEvent(); //调用app，通知返回事件
            registerHandler('notifyAppBack', function (data) {//点击app返回事件
                throttle(function () {
                    backRouterByValue('supercardlist',_this.$route.query,_this);
                }.bind(this));
            });
            if(!!_this.$route.query.cardData){
                _this.cardData = JSON.parse(decodeURIComponent(_this.$route.query.cardData));
            }
            if(!!_this.$route.query.addData){
                _this.cardData = JSON.parse(decodeURIComponent(_this.$route.query.addData)).cardData;
                _this.chooseIndex = JSON.parse(decodeURIComponent(_this.$route.query.addData)).chooseIndex;
            }
            if(!!getBusinessData("cardData")&&!!getBusinessData(`${_this.cardData.cardNumber}superAccountData`)){
                _this.superCardList = getNonSuperList(getBusinessData("cardData"),getBusinessData(`${_this.cardData.cardNumber}superAccountData`));
            }
        },
        /**
         * 新加银行卡
         */
        addCard(){
            let _this = this;
            openRouterByValue('cardadd',{cardData:decodeURIComponent(JSON.stringify(_this.cardData))},_this);
        },
        /**
         * 确认加挂
         */
        confirmAdd(){
            let _this = this;
            if(!!_this.superCardList[_this.chooseIndex]){
                const addData = {
                    cardData: _this.cardData,
                    superCardData: _this.superCardList[_this.chooseIndex],
                    chooseIndex: _this.chooseIndex
                }
                openRouterByValue('verifycode',{addData: encodeURIComponent(JSON.stringify(addData))},_this);
            }
            
        },
        /**
         * 选择账户
         */
        chooseAccount(index){
            let _this = this;
            _this.chooseIndex = index;
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .account-add{
        background: @color-bg;
        padding: .3rem;
        .add-title{
            color: @fc-info;
            font-size: @fs-mob-small;
            padding-bottom: .3rem;
        }
        .add,.account-item{
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: .1rem;
            background: @color-white;
            height: 2.4rem;
            padding: .48rem .4rem;
            margin-bottom: .3rem;
        }
        .account-item{
            flex-direction: column;
            .card-info{
                display: inline-flex;
                align-items: center;
                width: 100%;
                .bank-icon{
                    display: inline-block;
                    height: .54rem;
                    width: .54rem;
                    background: url('../../../resource/img/icon_bank.png') no-repeat center;
                    background-size: .54rem .54rem;
                }
                .bank-name{
                    padding-left: .2rem;
                    font-size: .34rem;
                    font-weight: bold;
                }
            }
            .card-number{
                font-size: @fs-mob-big;
                padding-top: .4rem;
                display: inline-flex;
                width: 100%;
                justify-content: space-between;
                .number{
                    font-weight: bold;
                }
            }
        } 
        .add{
            color: @color-blue;
            font-weight: bolder;
            .add-icon{
                display: inline-block;
                width: .4rem;
                height: .4rem;
                background: url('../../../resource/img/mycard/icon_add.png') no-repeat center;
                background-size: .4rem .4rem;
                margin-right: .2rem;
            }
        } 
        .selected{
            border: 2px solid @color-blue;
        }        
    }
</style>
