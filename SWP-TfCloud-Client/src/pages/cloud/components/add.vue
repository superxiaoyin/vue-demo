<template>
    <div class="card-list">
        <Logo></Logo>
        <SnLoading v-if="pageLoading"></SnLoading>
        <div class="list" v-if="!pageLoading&&cardList.length">
            <AccountCard :cardData="item" :showFlag="showFlag" :key="idx" v-for="(item,idx) in cardList" @cardClick="showSuperCard(item)" @delClick="delCard"></AccountCard>
        </div>
        <div class="cloud">
            <div class="add" :class="{'top': !pageLoading&&!cardList.length}" @click="addCard">
                <img src="~resource/img/tfcloud/icon_common_add@3x.png">
                <p>点击“+”号进行绑定！</p>
            </div>
            <div class="notes">温馨提示：<br> 您可以查询指定账户的币种、余额、开户日期、账户状态等信息。</div>
        </div>
    </div>
</template>
<script>
import { SnLoading } from 'components'
import Logo from './logo.vue'
import AccountCard from './accountcard.vue'
import {openRouterByValue,backRouterByValue,getServerData,setBusinessData,getBusinessData,getServerDataH5} from '../../handler/handler'
import { throttle, goBackPage, showToast,showConfirm, getUrlParams } from 'sslib/common/extend'
var urlParams = getUrlParams();
var code = urlParams.code || 1;
export default {
    data(){
        return{
            cardList: [],
            pageLoading:false,
            noInfo: false,
            loginData:{},
            sessionKey:'cardData',
            uaId:'',
            userinfo:{},
            showFlag:false
        }
    },
    created(){
        let _this = this;
        _this.init();
    },
    components:{
        SnLoading,AccountCard,Logo
    },
    methods:{
        //数据初始化
        init(){
            let _this = this
            let userinfo = _this.$store.state.userInfo
            if(userinfo.userPhone  == undefined){
                _this.userLogin()
            }else{
                _this.queryCardList()
            }
        },
        /**
         * 获取用户登录信息
         */
        async userLogin(){
          let _this = this;
          const data = {
            applicationId:'TianFuCloud',
            // code:'8ggYVe'
            code:code
          }  
          try {
                _this.pageLoading = true;
                const result = await getServerDataH5('/yqt/sso/oauthThird.login',data,'POST',true);
                console.log(result)
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
                    _this.userinfo = result;
                    this.$store.dispatch('getNewUserInfo',result)
                    setBusinessData(result.userPhone,tmpData);
                    _this.queryCardList();
                }else{
                    showToast(result.rdesc);
                }
            } catch (error) {
                _this.pageLoading = false;
                console.log(error);
            }
        },
         /**
         * 使用vux弹框组件
         */
        showconfirm(content,leftFunction,rightFunction,strLeftBtn,strRightBtn,isCancel,title){
            this.$vux.confirm.show({ //显示confirm弹窗   暂时屏蔽H5方法
                title: title || '',
                content: content,
                confirmText:strRightBtn || '确认',
                cancelText:strLeftBtn || '取消',
                showCancelButton:isCancel,
                onShow() {
                    console.log('show')
                },
                onHide() {
                    console.log('hide')
                },
                onCancel() {
                    leftFunction();
                },
                onConfirm() {
                    rightFunction();
                }
            });
        },
         /**
         * 查询卡列表
         */
        async queryCardList(){
            let _this = this;
            let userinfo = _this.$store.state.userInfo

            const data = {
                UAId:userinfo.UAId,
                phone:userinfo.userPhone,
                cpyId:-1,
                validityCheck: 1,
            }
            try {
                _this.pageLoading = true;
                const result = await getServerDataH5('/yqt/salaryCard/salaryCard.queryCardList',data,'POST',true);
                console.log(result)
                _this.pageLoading = false;
                if(result.code === 0){
                    _this.cardList = result.cardList;
                    setBusinessData(`${_this.sessionKey}${_this.uaId}`,_this.cardList);
                }else{
                    showToast(result.rdesc);
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
            openRouterByValue('addInfo',{phone:this.userinfo.userPhone},this);
        },
        showSuperCard(item){
            setBusinessData(item.cardNumber,item);
            this.$store.dispatch({
                type:'getNewParms',
                obj:item
            })
            openRouterByValue('info',{},this);
            // console.log(item)
        },
        delCard(id){
            let _this = this

            _this.showconfirm("确认是否要解除银行卡绑定",function(){
     
            },function(){
                let userinfo = _this.$store.state.userInfo
                let data = {
                    phone:userinfo.userPhone,
                    cardId:id
                }
                getServerDataH5('/yqt/salaryCard/salaryCard.delete',data,'POST',true).then(res=>{
                    console.log(res)
                    if(res.code == 0){
                        _this.queryCardList()
                    }
                }).catch(err=>{
                    console.log(err)
                })

            },"取消","确定",true); 
           
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
        .top{
            margin-top: .3rem;
        }
    }
    .add{background-color: #fff;margin: 10px 0;border-radius:12px;text-align: center;padding: 40px 20px;
        img{width:40px;}
        p{font-size:15px;color: #bbb;margin-top: 20px;}
    }
    .notes{margin:16px;font-size: 12px;color: #999;}
</style>
