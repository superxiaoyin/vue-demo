<template>
    <div class="accountlist-wrapper">
        <SnLoading v-if="pageLoading"></SnLoading>
        <div v-if="!pageLoading"> 
            <div class="balance-card" :class="{'card-center': noInfo}">
                <span class="total-text">总资产<i @click="moneyFlag = !moneyFlag" class="money-eye" :class="!moneyFlag?'money-closed':''"></i></span>
                <span class="total-money" v-if="moneyFlag"><i class="money-tip">¥</i>{{totalBalance|moneyFrt(1)}}</span>
                <span class="total-money" v-else>******</span>
                <span class="bind-num">所有绑定账号</span>
            </div>
            <div v-if="!noInfo" class="accountlist">
                <div class="title">
                    <span class="title-text">账户资产</span>
                    <span class="title-unit">余额/元</span>
                </div>
                <div class="list">
                    <div class="list-item" v-for="(item,index) in accountList" :key="index" @click="showDetail(item)">
                        <div class="account-title">
                            <span class="title-text" :class="{'title-text2':item.baseAccountFlag === 11 || item.baseAccountFlag === 12}">{{getAccountName(item.baseAccountFlag)}}</span>
                            <span class="account-money" v-if="moneyFlag">{{item.accountBalance|moneyFrt(1)}}</span>
                            <span class="account-money" v-else>******</span>
                        </div>
                        <div class="account-info">
                            <span class="account-number">**** **** **** {{item.account.substr(-4)}}</span>
                            <span v-if="item.openMark == '01'">
                                <i v-if="item.baseAccountFlag === 11 || item.baseAccountFlag === 12" class="account-more"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <SnEmpty v-if="noInfo" :isShow="true" icon="no-card" tip="您还没有绑定银行卡哦~"></SnEmpty>
        </div>
    </div>
</template>
<script>
import {openRouterByValue,getBusinessData,getServerData,setBusinessData,getServerDataH5} from '../../handler/handler'
import { SnButton,SnEmpty,SnLoading } from 'components'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { throttle, goBackPage, initTitleMenu, openPage, showConfirm, showToast, getUrlParams } from 'sslib/common/extend'
var urlParams = getUrlParams();
var phone = urlParams.phone;
export default {
    data(){
        return{
            moneyFlag:true,
            totalBalance: 0,
            subTitle:['账户余额'],
            pageLoading: false,
            noInfo: false,
            accountList:[],
            loginData:{},
            sessionKey:'accountData',
       }
    },
    components:{
        SnButton,SnEmpty,SnLoading
    },
    created(){
        let _this = this;
        _this.init();
    },
    methods:{
        /**
         * 数据初始化
         */
        init(){
            let _this = this;
            if(!!_this.$route.query.phone){
                _this.loginData = getBusinessData(_this.$route.query.phone);
                phone = _this.$route.query.phone;
            }else if(!!phone){
                _this.loginData = getBusinessData(phone);
                _this.sessionKey = 'accountData'+_this.loginData.UAId;
            }
            //查询账户列表
            _this.queryAccountList();
        },
        /**
         * 获取户名
         */
        getAccountName(flag){
            let name = '';
            if(flag === 10){
                name = 'Ⅰ类户'
            }else if(flag === 11){
                name =  'Ⅱ类户'
            }else if(flag === 12){
                name =  'Ⅲ类户'
            }
            return name
        },
        /**
         * 查询账户列表
         */
        async queryAccountList(){
            let _this = this;
            const data = {
                cpyId:-1,
                businessType: 1,
                phone:phone
            }
            try {
                _this.pageLoading = true;
                const result = await getServerDataH5(textUrl+'/yqt/accountMgr/accountMgr.queryAccountList',data);
                console.log(result)
                _this.pageLoading = false;
                if(result.code === 0){
                    _this.totalBalance = result.totalBalance;
                    if(!!result.accountList&&!!result.accountList.length){
                        _this.accountList = result.accountList;
                        setBusinessData(_this.sessionKey,{accountList:result.accountList,totalBalance: result.totalBalance});
                    }else{
                        _this.noInfo = true;
                    }
                }else{
                    _this.noInfo = true;
                }
            } catch (error) {
                _this.pageLoading = false;
                _this.noInfo = true;
                console.log(error);
            }
        },
        /**
         * 查看II类户详情
         */
        showDetail(item){
            let _this = this;
            // if(item.openMark == '01'){
                if(item.baseAccountFlag === 11 || item.baseAccountFlag === 12){
                    openRouterByValue('accountdetail', {phone:phone,accountData:encodeURIComponent(JSON.stringify(item))}, _this);
                }
            // }
           
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .accountlist-wrapper{
        background: @color-bg;
		.balance-card{
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: @fs-mob-small;
            padding: .6rem;
            background: url('../../../resource/img/accountlist/balance_bg.png') no-repeat center;
            height: 4rem;
            background-size: cover;
            color: @color-white;
            .total-text{
                display: flex;
                align-items: center;
                .money-eye{
                    display: inline-block;
                    background: url('../../../resource/img/accountlist/eye_open.png') no-repeat center;
                    width: 0.36rem;
                    height: 0.36rem;
                    background-size: 0.36rem 0.36rem;
                    cursor: pointer;
                    margin-left: .1rem;
                }
                .money-closed{
                    background: url('../../../resource/img/accountlist/eye_close.png') no-repeat center;
                    background-size: 0.36rem 0.36rem;
                }
            }
            .total-money{
                font-size: @fs-mob-bigger;
                font-weight: bolder;
                height: 1.2rem;
                line-height: 1.2rem;
                .money-tip{
                    font-size: @fs-mob-big;
                    padding-right: .1rem;
                }
            }
        }
        .card-center{
            padding: 0;
            justify-content: center;
        }
        .accountlist{
            margin: -.8rem .3rem 0 .3rem;
            background: @color-white;
            border-radius: .1rem;
            padding: .4rem .3rem .0 .3rem;
            .title{
                display: flex;
                justify-content: space-between;
                .title-text{
                    font-weight: bolder;
                }
                .title-unit{
                    font-size: @fs-mob-small;
                    color: @fc-info;
                }
            }
            .list-item{
                display: flex;
                flex-direction: column;
                text-align: center;
                padding: .3rem 0;
                border-bottom: 1px solid @color-bg;
                .account-title{
                    display: inline-flex;
                    justify-content: space-between;
                    align-items: center;
                    .title-text{
                        color: @color-white;
                        background: @color-blue;
                        border-radius: .1rem;
                        padding: .1rem .2rem;
                        font-size: @fs-mob-smaller;
                    }
                    .title-text2{
                        background: #5E87DC;
                    }
                   .account-money{
                       font-weight: bolder;
                       font-size: .36rem;
                   }
                }
                .account-info{
                    display: inline-flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: .1rem;
                    .account-more{
                        display: inline-block;
                        width: .45rem;
                        height: .45rem;
                        background: url('../../../resource/img/icon_narrow_right.png') no-repeat center;
                        background-size: .45rem .45rem;
                        cursor: pointer;
                    }
                }
                &:last-child{
                    border-bottom: none;
                }
            }
        }
        .empty-comp{
            position: relative;
            padding-top: 2rem;
        }
    }
</style>
