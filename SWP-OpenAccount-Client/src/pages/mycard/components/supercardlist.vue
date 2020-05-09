<template>
    <div class="super-card">
        <SnLoading v-if="pageLoading"></SnLoading>
        <div v-if="!pageLoading">
            <account-card class="top-card" :cardData="cardData" :showFlag="false" :pwdStat="pwdStat"></account-card>
            <div class="card-list" v-if="superCardList.length">
                <div class="card-title">绑定账户</div>
                <div class="card-item" v-for="card in superCardList" @click="unbind(card)">
                    <div class="card-info">
                        <label>Ⅰ类户</label>
                        <span class="card-num">**** **** **** {{card.accountNo.substr(-4)}}</span>
                    </div>
                    <span class="unbind">解绑</span>
                </div>
            </div>
            <!-- <div v-transfer-dom>
                <confirm v-model="showDiv"
                    show-input
                    ref="confirmDiv"
                    title="请输入验证码"
                    @on-confirm="onConfirm"
                    @on-show="onShow5"
                    @on-hide="onHide">
                </confirm>
            </div> -->
            <div class="password-input" v-show="inputpwd">
            <!-- <div class="password-input"> -->
                <SnCell title="银行卡密码" value-align="left" title-width="2.2rem">
                    <span class="cursor" id="pwdCursor"></span>
                    <input
                        class="form_line_input"
                        type="tel" 
                        style="-webkit-text-security:disc"
                        placeholder="请输入银行卡密码"
                        maxlength="6"
                        ref="pwd"
                        id="pwd"
                    />
                </SnCell>
            </div>
            <div class="footers">
                <SnButton @SnButtonClick="addAccount">加挂账户</SnButton>
                <SnButton @SnButtonClick="confirmOperate" :showLoading="payLoading">{{payText}}</SnButton>     
            </div>       
        </div>
    </div>
</template>
<script>
import AccountCard from './accountcard'
import { SnButton,SnLoading,SnCell } from 'components'
import { openRouterByValue,backRouterByValue,getServerData,setBusinessData,getBusinessData,getServerDataH5 } from '../../handler/handler'
import {initInput,numberKeyboard} from "sslib/common/cfcaKeyS.js"
import { getUrlParams,throttle, goBackPage, initTitleMenu, showToast } from 'sslib/common/extend'
import { Confirm, TransferDomDirective as TransferDom } from 'vux'

var urlParams = getUrlParams();
var phone = urlParams.phone
export default {
    directives: {
        TransferDom
    },
    data(){
        return{
            cardData: {},
            superCardList: [],
            pageLoading: false,
            phone:'',
            vType:114,
            inputpwd:false,
            showDiv:false,
            pwdStat:true,
            subTitle:'查看账户',
            payText:'查看账户',
            payLoading:false,
            random:'123'
        }
    },
    created(){
        let _this = this;
        initTitleMenu(['Ⅱ类户']);
        _this.init();
    },
    mounted () {
        let _this = this;
        let param = {
            phone:phone
        };
        getServerDataH5(textUrl+'/yqt/accountMgr/accountMgr.genServerRandom',param,'POST').then(result => {
            // console.log(result)
            if (result.code===0) {
                setTimeout(()=>{
                    initInput(result.serverRandom);
                },3000)
            }else{
                showToast(result.desc);
            }
        })
    },
    components:{
        AccountCard,SnButton,SnLoading,Confirm,SnCell
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
            if(!!_this.$route.query.phone){
                _this.phone = _this.$route.query.phone;
            }
            if(!!_this.$route.query.back){//加挂解绑后返回，需要更新列表
                _this.cardData = JSON.parse(decodeURIComponent(_this.$route.query.back)).backData;
                _this.querysuperAccount();
            }else{
                _this.querysuperAccount();              
            }

        },
        /**
         * 查询Ⅱ类户对应的Ⅰ类户列表
         */
        async querysuperAccount(){
            let _this = this;
            const data = {
                account: _this.cardData.cardNumber,
                phone:_this.phone
            }
            try {
                _this.pageLoading = true;
                const superData = await getServerDataH5(textUrl+'/yqt/accountMgr/accountMgr.querysuperAccount',data);
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
            openRouterByValue('verifycode',{unbindData: encodeURIComponent(JSON.stringify(unbindData)),phone:_this.phone},_this);
        },
        /**
         * 加挂账户
         */
        addAccount(){
            let _this = this;
            openRouterByValue('accountadd',{cardData: decodeURIComponent(JSON.stringify(_this.cardData)),phone:_this.phone},_this);
        },
        onConfirm(value){
            let _this = this;
            showToast(value);
        },
        /**
         * 确认支付
         */
        async confirmOperate(){
            let _this = this;
            if(_this.inputpwd){
                _this.payLoading = true;
                try {
        
                    //获取错误码，0表示成功
                    var errorCode = numberKeyboard.getErrorCode('pwd').toString(16);
                    console.log(errorCode)
                    if(errorCode ==0){
                        //获取密码输入框中加密后的数据
                        var encryptedInputValue = numberKeyboard.getEncryptedInputValue('pwd')
                        var randomValue = numberKeyboard.getEncryptedClientRandom('pwd')
                        console.log(encryptedInputValue)
                        if(!encryptedInputValue){
                            showToast('请输入正确的6位数密码!');
                            _this.payLoading = false;
                            return;
                        }

                        let param = {
                            phone:phone,
                            uaId:getBusinessData(phone).UAId,
                            account:_this.cardData.cardNumber,
                            pwd:encryptedInputValue,
                            encryptedRc:randomValue,
                        }
                        // console.log('submit',param)
                        let result = await getServerDataH5('/yqt/accountMgr/accountMgr.verifyPwdByCfca', param,'POST')
                        // console.log('result',result)
                        if(result.code === 0){
                            if(result.status == 0){
                                _this.pwdStat = false
                                _this.payLoading = false
                                encryptedInputValue =''
                                numberKeyboard.clearInputValue ('pwd')
                            }
                        }else{
                            showToast(result.rdesc);
                            _this.payLoading = false;
                        }
                    }else{
                        showToast('请输入正确的6位数密码!');
                        _this.payLoading = false;
                    }
                }catch (error) {
                    _this.payLoading = false;
                    console.log(error);
                }
            }else{
                _this.inputpwd = true
            }
        }
    }
}
</script>
<style lang="less">
.sn-button{padding: .2rem !important;}
</style>
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
    .footers{
        position: fixed;
        bottom: 20px;
        left: 0;
        right: 0;
    }
    .password-input{
        background: @color-white;
    }
    .textTips {
        padding-left: 0.3rem;
        font-size: 0.28rem;
        background: @color-bg;
        color: @fc-info;
        height: 0.6rem;
        line-height: 0.6rem;
    }
    .sn-cell{
        border-bottom: 1px solid @color-bg;
        padding: .24rem .3rem !important;
    }
    .sn-cell:before{
        border: none !important;
    }
    .form_line_input {
        display: inline-block;
        text-align: left;
        border: none;
        background: none;
        .flex(1);
    }
    .cursor {
        position: absolute;
        margin-top: -3px;
        margin-left: 0px;
        width: 2px;
        height: 24px;
        display: none;
        z-index: 1000;
    }
</style>
