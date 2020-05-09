<template>
    <div class="card-list">
        <SnLoading v-if="pageLoading"></SnLoading>
        <div class="list" v-if="!pageLoading&&cardList.length">
            <account-card :cardData="item" :key="idx" v-for="(item,idx) in cardList" @cardClick="showSuperCard(item)"></account-card>
        </div>
        <div class="add" :class="{'top': !pageLoading&&!cardList.length}" @click="addCard">
            <i class="add-icon"></i>
            <span>添加银行卡</span>
        </div>
    </div>
</template>
<script>
import { SnLoading } from 'components'
import AccountCard from './accountcard'
import {openRouterByValue,backRouterByValue,getServerData,setBusinessData,getBusinessData,getServerDataH5} from '../../handler/handler'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { throttle, goBackPage, initTitleMenu, showToast, getUrlParams } from 'sslib/common/extend'
var urlParams = getUrlParams();
var phone = urlParams.phone;
export default {
    data(){
        return{
            cardList: [],
            pageLoading:false,
            noInfo: false,
            subTitle:['我的卡包'],
            loginData:{},
            sessionKey:'cardData',
        }
    },
    created(){
        let _this = this;
        initTitleMenu(_this.subTitle);
        _this.init();
    },
    components:{
        SnLoading,AccountCard
    },
    methods:{
        //数据初始化
        init(){
            let _this = this;
            if(!!_this.$route.query.phone){
                _this.loginData = getBusinessData(_this.$route.query.phone);
                phone = _this.$route.query.phone;
                _this.sessionKey = 'cardData'+_this.loginData.UAId;
            }else if(!!phone){
                _this.loginData = getBusinessData(phone);
                _this.sessionKey = 'cardData'+_this.loginData.UAId;
            }
            _this.queryCardList();
        },
         /**
         * 查询卡列表
         */
        async queryCardList(){
            let _this = this;
            const data = {
                cpyId:-1,
                validityCheck: 1,
                phone:phone
            }
            try {
                _this.pageLoading = true;
                const result = await getServerDataH5(textUrl+'/yqt/salaryCard/salaryCard.queryCardList',data);
                _this.pageLoading = false;
                if(result.code === 0){
                    _this.cardList = result.cardList;
                    setBusinessData(_this.sessionKey,_this.cardList);
                }else{
                    showToast(result.desc);
                }
            } catch (error) {
                _this.pageLoading = false;
                console.log(error);
            }
        },
        /**
         * 添加银行卡
         */
        async addCard(){
            let _this = this;
            let param = {
                phone:phone
            }
            try {
                const result = await getServerDataH5(textUrl+'/yqt/user/user.queryCertificationInfo',param,'POST');
                if(result.status === 1){//认证成功
                    openRouterByValue('cardadd',{name:result.name,phone:phone},_this);
                }else{
                    showToast("未认证，请先进行实名认证");
                }
            } catch (error) {
                console.log(error);
            } 
            
        },
        /**
         * 查看Ⅱ类户绑定的Ⅰ类户列表
         */
        showSuperCard(card){
            let _this = this;
            if(card.cardType === 11 || card.cardType === 12){
                openRouterByValue('supercardlist',{cardData: decodeURIComponent(JSON.stringify(card)),phone:phone},_this);
            }
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .card-list{
        background: @color-bg;
        padding: 0 .3rem .3rem .3rem;
        .list{
            padding-top: .3rem;
        }
        .add{
            display: flex;
            background: @color-white;
            border-radius: .1rem;
            height: 3.5rem;
            align-items: center;
            justify-content: center;
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
        .top{
            margin-top: .3rem;
        }
    }
</style>
