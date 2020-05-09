<template>
   <div class="cloud">
        <Logo></Logo>
        <div class="form">
            <group>
                <x-input title='签约账号' type="number" placeholder='请输入签约账号' v-model="form.cardList.cardNumber" :max="19"></x-input>
                <x-input title="证件类型" v-model="cardType" disabled></x-input>
                <x-input title="证件号码" v-model="cardNum" disabled></x-input>
                
                <div class="contentLine vux-1px-t">
                    <SnTel
                        title="签约手机"
                        :maxlength="11"
                        text-align="left"
                        v-model="form.cardList.telphone"
                        placeholder="请输入签约手机号"
                    ></SnTel>
                    <SnVerifyCode
                        title="验证码"
                        :maxlength="6"
                        text-align="left"
                        :phone-num="form.cardList.telphone"
                        @getending="getendingfun"
                        v-model="form.cardList.vCode"
                        placeholder="请输入验证码"
                    ></SnVerifyCode>
                </div>
            </group>
        </div>
        <div class="agreement">
            <i :class="agree?'agree_pre':'agree_nor'" class="fl" @click="agree=!agree"></i><div class="fr"><span class="agree-text">我已阅读并同意以下协议</span><a class="sn-pointer" @click="openProtocol">《泸州银行“天府市民云”金融服务协议》</a></div>
        </div>
        <SnButton @SnButtonClick="nextStep" :showLoading='showLoading'>确定</SnButton>

   </div>
</template>
<script>
import Vue from 'vue';
import { XInput, Group,ConfirmPlugin } from 'vux'
import { SnTel, SnVerifyCode } from 'biscomponents'
import { SnButton } from 'components'
import { throttle, showToast,getUrlParams } from 'sslib/common/extend'
import { openRouterByValue, backRouterByValue, setBusinessData, getBusinessData, getServerDataH5,formatNumber } from '../../handler/handler'
import Logo from './logo.vue'
Vue.use(ConfirmPlugin)
var urlParams = getUrlParams();
var phone = urlParams.phone;

export default {
    data(){
        return{
            cardType:'身份证',
            agree: false,
            verifyCodeFlag:false,
            showLoading:false,
            cardNum:'',
            vtype:113,
            begin:6,
            end:4,
            form:{
                UAId:'',
                phone:'',
                cardList:{
                    name:'',
                    telphone:'',
                    cardNumber:'',
                    bankMemberId:'313657092617',
                    vCode:'',
                    UAId:'',
                }
            }
        }
    },
    components:{
      Logo,XInput, Group,SnTel, SnVerifyCode ,SnButton
    },
   
    created(){
        let _this = this
        if(getBusinessData('form')){
            let form = getBusinessData('form')
            _this.form.cardList.cardNumber = form.cardNumber
            _this.form.cardList.telphone = form.phone
            _this.form.cardList.vCode = form.vcode
        }

        let userInfo = this.$store.state.userInfo
        _this.form.phone = userInfo.userPhone
        _this.form.uaId = userInfo.UAId
        _this.form.cardList.UAId = userInfo.UAId
        _this.form.cardList.name = userInfo.name
        _this.cardNum = formatNumber(userInfo.idNo,_this.begin,_this.end)
        
        
        
    },
    methods:{
        nextStep(){
            let _this = this;
            if (!_this.validate()) {
                return;
            }

            _this.loadingFlag = true
            _this.showLoading = true
            let data = {
                UAId:_this.form.UAId,
                phone:_this.form.phone,
                cardList:[
                    {
                        name:_this.form.cardList.name,
                        telphone:_this.form.cardList.telphone,
                        cardNumber:_this.form.cardList.cardNumber,
                        bankMemberId:_this.form.cardList.bankMemberId,
                        vCode:_this.form.cardList.vCode,
                        UAId:_this.form.cardList.UAId
                    }
                ]
            }
            getServerDataH5('/yqt/salaryCard/salaryCard.addVisitorCard',data,'POST',true).then(res=>{
                _this.loadingFlag = false
                _this.showLoading = false
                if(res.code == '0'){
                    let accountInfo = res.accountInfo
                    let cardData = {
                        bankCode:'',
                        bankMemberId: '',
                        bankName: '',
                        cardId:'',
                        cardName:'', 
                        cardNumber:accountInfo.acctNo, 
                        cardType: '',
                        phone: '',
                        status:'',
                    }
                    if(!!accountInfo){
                        _this.showconfirm("绑定成功",null,function(){
                            sessionStorage.removeItem('form')
                            _this.$store.dispatch({
                                type:'getNewParms',
                                obj:cardData
                            })
                            openRouterByValue('info',{},_this);
                        },"","确定",false);

                    }else if(!!res.failList&&res.failList.length){
                        const errorInfo = cardError[res.failList[0].status];
                        openRouterByValue('result',{result:encodeURIComponent(JSON.stringify({status:2,text:'添加失败',desc: errorInfo})),phone:_this.phone},_this);
                    }                    
                }else{
                    console.log(res)
                    showToast(res.rdesc);
                }
            },rej=>{
                console.log(res)
                _this.loadingFlag = false
                _this.showLoading = false
            })

        },
        validate() {
            let _this = this;
            let num = new RegExp("[0-9]+");
            if (!_this.form.cardList.cardNumber) {
                showToast('请输入签约账号');
                return false;
            }
            if (!num.test(_this.form.cardList.cardNumber)) {
                showToast('请输入正确的签约账号');
                return false;
            }
            if (_this.form.cardList.cardNumber.length !== 16 && _this.form.cardList.cardNumber.length !== 19) {
                showToast('请输入正确签约账号');
                return false;
            }
            if (!_this.form.cardList.telphone) {
                showToast('请输入签约手机号');
                return false;
            }
            if (!_this.verifyCodeFlag) {
                showToast('请获取验证码');
                return false;
            }
            if (!_this.form.cardList.vCode&&_this.form.cardList.vCode.length !== 6) {
                showToast('请输入正确的验证码');
                return false;
            }
            if (!_this.agree) {
                showToast('请阅读并同意银行卡使用协议');
                return false;
            }
            return true;
        },
        getendingfun(data) {
            let _this = this;
            if (data) {
                getServerDataH5(textUrl + '/SSP-HTTP/user.getVerifyCode',{userPhone :_this.form.cardList.telphone,vType:_this.vtype}).then(res => {
                    if (res.code ===0) {
                        _this.verifyCodeFlag = true;
                    }else{
                        showToast(res.desc);
                    }
                })
            }
        },
        openProtocol(){
            let data = {cardNumber:this.form.cardList.cardNumber,phone:this.form.cardList.telphone,vcode:this.form.cardList.vCode}
            setBusinessData('form',data)
            openRouterByValue("protocol",{},this);
        },
        onFocus(val, $event){
            console.log('on focus', val, $event)
        },
        showconfirm(content,leftFunction,rightFunction,strLeftBtn,strRightBtn,isCancel,title){
            Vue.$vux.confirm.show({ //显示confirm弹窗   暂时屏蔽H5方法
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
    },
}
</script>
<style lang="less">
   .weui-cell{padding: 15px !important;}
   .weui-label,.vux-label {
        width: 90px !important;
        padding-right: 0.3rem;
        color:#333;font-size:16px
    }

    .vux-x-input.disabled .weui-input{
        text-fill-color: #333;
        -webkit-text-fill-color: #333;
        opacity: 1;
    }
    .vux-1px-t:before{
        left: 15px;
    }

    .snVerifyCode .button-detail{
        background: none !important;
        border-radius: 5rem !important;
        border: 1px solid #E8422E;
        color:#E8422E !important;
        width: 3rem !important;
        height: 30px !important;
        line-height: 30px !important;
        margin-top:-15px !important;
    }
    .agreement {
        margin: 20px 15px;
        font-size:14px;
        display: flex;
        .fl{
            width: 20px;
            height: 20px;
        }
        .fr{
            flex: auto;
        }
        .agree_pre{
            background: url('../../../resource/img/icon_agree_pre.png') no-repeat center;
        }
        .agree_nor{
            background: url('../../../resource/img/icon_agree_nor.png') no-repeat center;
        }
        .agree_pre,.agree_nor{
            display: inline-block;
            width: 20px;
            height: 20px;
            float: left;
            background-size: contain;
        }
        .agree-text{
            margin-left: 0.15rem;
            color: #999;
            float: left;
        }
        a {
            color: #3891FF;
        }
    }

    .sn-button button{
        margin: 10px;
        height: 44px;
        line-height: 44px;
        font-size: 16px !important;
    }
    .vux-cell-align-left {
        input{
            font-size: 18px;
        }
    }


</style>
