<template>
    <div class="super-card">
        <SnLoading v-if="pageLoading"></SnLoading>
        <div v-if="!pageLoading">
            <account-card class="top-card" :cardData="cardData" :showFlag="false"></account-card>
            <div class="card-list" v-if="superCardList.length">
                <div class="card-title">绑定账户</div>
                <div class="card-item" v-for="card in superCardList" @click="unbind(card)">
                    <div class="card-info">
                        <label>一类户</label>
                        <span class="card-num">{{card.accountNo}}</span>
                    </div>
                    <span class="unbind">解绑</span>
                </div>
            </div>
            <SnButton @SnButtonClick="addAccount">加挂账户</SnButton>            
        </div>
    </div>
</template>
<script>
import AccountCard from './accountcard'
import { SnButton,SnLoading } from 'components'
import { openRouterByValue,backRouterByValue,getServerData,setBusinessData,getBusinessData } from '../../handler/handler'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { throttle, goBackPage, initTitleMenu, showToast } from 'sslib/common/extend'
export default {
    data(){
        return{
            cardData: {},
            superCardList: [],
            pageLoading: false,
        }
    },
    created(){
        let _this = this;
        initTitleMenu(['Ⅱ类户']);
        _this.init();
    },
    components:{
        AccountCard,SnButton,SnLoading
    },
    methods:{
        /**
         * 数据初始化
         */
        init(){
            let _this = this;
            if(!!_this.$route.query.cardData){
                _this.cardData = JSON.parse(decodeURIComponent(_this.$route.query.cardData));
            }
            if(!!_this.$route.query.unbindData){
                _this.cardData = JSON.parse(decodeURIComponent(_this.$route.query.unbindData)).cardData;
            }
            if(!!_this.$route.query.addData){
                _this.cardData = JSON.parse(decodeURIComponent(_this.$route.query.addData)).cardData;
            }
            notifyAppBackEvent(); //调用app，通知返回事件
            registerHandler('notifyAppBack', function (data) {//点击app返回事件
                throttle(function () {
                    backRouterByValue('cardlist','',_this);
                }.bind(this));
            });
            if(!!_this.$route.query.back){//加挂解绑后返回，需要更新列表
                _this.cardData = JSON.parse(decodeURIComponent(_this.$route.query.back)).backData;
                _this.querysuperAccount();
            }else{
                if(!!getBusinessData(`${_this.cardData.cardNumber}superAccountData`)){
                    _this.superCardList = getBusinessData(`${_this.cardData.cardNumber}superAccountData`);
                }else{
                    _this.querysuperAccount();
                }                
            }

        },
        /**
         * 查询Ⅱ类户对应的一类户列表
         */
        async querysuperAccount(){
            let _this = this;
            const data = {
                account: _this.cardData.cardNumber,
            }
            try {
                _this.pageLoading = true;
                const superData = await getServerData('accountMgr/accountMgr.querysuperAccount',data);
                _this.pageLoading = false;
                if(superData.code === 0 &&!!superData.accountList){
                    _this.superCardList = superData.accountList;
                    setBusinessData(`${_this.cardData.cardNumber}superAccountData`, _this.superCardList);
                }else{
                    setBusinessData(`${_this.cardData.cardNumber}superAccountData`, _this.superCardList);
                }
            } catch (error) {
                _this.pageLoading = false;
                console.log(error);
            }
        },
        /**
         * 解绑
         */
        unbind(card){
            let _this = this;
            const unbindData = {
                cardData: _this.cardData,
                superCardData: card,
            }
            openRouterByValue('verifycode',{unbindData: encodeURIComponent(JSON.stringify(unbindData))},_this);
        },
        /**
         * 加挂账户
         */
        addAccount(){
            let _this = this;
            openRouterByValue('accountadd',{cardData: decodeURIComponent(JSON.stringify(_this.cardData))},_this);
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .super-card{
        padding: 0 .3rem .3rem .3rem;
        background: @color-bg;
        .top-card{
            padding-top: .3rem;
        }
        .card-list{
            .card-title{
                font-weight: bold;
                padding-bottom: .15rem;
            }
            .card-item{
                background: @color-white;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-radius: .1rem;
                margin-bottom: .3rem;
                padding: .3rem;
                .card-info{
                    display: inline-flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: center;
                    .card-num{
                        padding-top: .2rem;
                        color: @fc-info;
                    }
                }
                .unbind{
                    font-size: @fs-mob-small;
                    color: @color-blue;
                }
            }
        }
    }
</style>
