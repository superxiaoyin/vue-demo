<template>
    <div class="card-list">
        <SnLoading v-if="pageLoading"></SnLoading>
        <div class="list" v-if="!pageLoading&&cardList.length">
            <account-card :cardData="item" :showFlag="showFlag" :key="idx" v-for="(item,idx) in cardList" @cardClick="showSuperCard(item)"></account-card>
        </div>
        <div class="add" :class="{'top': !pageLoading&&!cardList.length}" @click="addCard">
            <!-- <div class="inner"> -->
                <div class="inner-div">
                    <i class="add-icon"></i>
                </div>
                <div class="inner-div">
                    <span>请点"+"号进行绑定</span>
                </div>
            <!-- </div> -->

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
var code = urlParams.code || 1;
export default {
    data(){
        return{
            cardList: [],
            pageLoading:false,
            noInfo: false,
            subTitle:['我的卡包'],
            loginData:{},
            sessionKey:'cardData',
            uaId:'',
            showFlag:false
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
            if(!!_this.$route.query.uaId){
                _this.loginData = getBusinessData('userData'+_this.$route.query.uaId);
                _this.uaId = _this.loginData.UAId;
                _this.sessionKey = 'cardData'+_this.loginData.UAId;
                _this.queryCardList();
            }else{
                _this.userLogin();
            }
        },
        /**
         * 获取用户登录信息
         */
        async userLogin(){
          let _this = this;
          alert(code);
          const data = {
              applicationId:'TianFuCloud',
              code:code
          }  
          try {
                _this.pageLoading = true;
                const result = await getServerDataH5(textUrl+'/yqt/sso/oauthThird.login',data);
                    alert(result.code);
                if(result.code === 0){
                    let tmpData = {
                        UAId:result.UAId,
                        lgParam:result.lgParam,
                        idNo:result.idNo,
                        userPhone:result.userPhone,
                        userName:result.userName,
                        name:result.name
                    }
                    _this.uaId = result.UAId;
                    setBusinessData('userData'+result.UAId,tmpData);
                    _this.queryCardList();
                }else{
                    showToast(result.desc);
                }
            } catch (error) {
                _this.pageLoading = false;
                console.log(error);
            }
        },
         /**
         * 查询卡列表
         */
        async queryCardList(){
            let _this = this;
            const data = {
                UAId:_this.uaId,
                cpyId:-1,
                validityCheck: 1,
            }
            try {
                _this.pageLoading = true;
                const result = await getServerDataH5(textUrl+'/yqt/salaryCard/salaryCard.queryCardList',data,'POST',true);
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
         * 绑定签约账号
         */
        async addCard(){
            let _this = this;
            openRouterByValue('bindCard',{uaId:_this.uaId},_this);
            
        },
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
            display: block;
            background: @color-white;
            border-radius: .1rem;
            padding-top: 1.3rem;
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
            .inner-div{
                text-align: center;
            }
        }
        .top{
            margin-top: .3rem;
        }
    }
</style>
