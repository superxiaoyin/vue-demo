<template>
    <div class="step4">
        <step-header class="step-header" :step="4"></step-header>
        <div class="password">
            <div class="password-input">
                <SnCell title="新密码" value-align="left">
                    <span class="cursor" id="psdCursor"></span>
                    <input
                        class="form_line_input"
                        type="tel" 
                        style="-webkit-text-security:disc"
                        placeholder="请输入新密码"
                        v-model="content.password"
                        maxlength="6"
                        ref="psd"
                        id="psd"
                    />
                </SnCell>
                <SnCell title="确认新密码" value-align="left">
                    <span class="cursor" id="repsdCursor"></span>
                    <input
                        class="form_line_input"
                        type="tel" 
                        style="-webkit-text-security:disc"
                        placeholder="请再次输入新密码"
                        v-model="content.newpassword"
                        maxlength="6"
                        ref="repsd"
                        id="repsd"
                    />
                </SnCell>
            </div>
            <SnButton :showLoading="loadingFlag" @SnButtonClick="submitFrom">提交</SnButton>
        </div>
    </div>
</template>
<script>
import { openRouterByValue, getBusinessData, getLocalData, getServerDataH5,deleteLocalData,setBusinessData } from '../../handler/handler'
import StepHeader from './stepheader'
import { SnButton,SnCell } from 'components'
import common from "sslib/common/common.js";
import {initInput,numberKeyboard} from "sslib/common/cfcaKey.js";
import { getUrlParams,goBackPage,throttle,initTitleMenu,openPage,showToast } from 'sslib/common/extend'
var urlParams = getUrlParams();
var orderNo = urlParams.orderNo;
var h5faceId = urlParams.h5faceId;
var newSignature = urlParams.newSignature;

export default {
    data(){
        return{
            content:{},
            loadingFlag: false,
            desc:'',
            random:'',
            status:'',
            cardData:{},
            idNo:{}
        }
    },
    created(){
        let _this = this;
        _this.cardData = getLocalData(orderNo);
        _this.idNo = getLocalData(_this.cardData.idcard)
        _this._inits();
    },
    components:{
        StepHeader,SnButton,SnCell
    },
    methods:{
        _inits(){
            let _this = this;
            let param = {
                UAId:_this.cardData.UAId,
                phone:_this.idNo.phone
            };
            getServerDataH5('/yqt/accountMgr/accountMgr.genServerRandom',param,'POST').then(result => {
                if (result.code===0) {
                    _this.random = result.serverRandom;
                    initInput(_this.random);
                }else{
                    showToast(result.desc);
                }
            })
        },
        /**
         * 数据初始化
         */
        async submitFrom(){
            let _this = this;
            _this.loadingFlag = true;
            try {
                if (!numberKeyboard.checkInputValueMatch('psd', 'repsd')) {
                    showToast('两次输入密码不一致!');
                    //清空密码框
                    numberKeyboard.clearInputValue('psd');
                    numberKeyboard.clearInputValue('repsd');
                    _this.loadingFlag = false;
                    return;
                }
                //获取错误码，0表示成功
                var errorCode = numberKeyboard.getErrorCode('psd').toString(16);
                if(errorCode ==0){
                    //获取密码输入框中加密后的数据
                    var encryptedInputValue = numberKeyboard.getEncryptedInputValue('psd');
                    var randomValue = numberKeyboard.getEncryptedClientRandom('psd');
                    if(!encryptedInputValue){
                        showToast('请输入正确的6位数密码!');
                        _this.loadingFlag = false;
                        return;
                    }

                    let param = {
                        UAId:_this.cardData.UAId,
                        orderNo:orderNo,
                        faceId:h5faceId,
                        ticket:'aass',

                        profession:_this.cardData.profession,
                        imageFontFileId:_this.cardData.imageFontFileId,
                        imageBackFileId:_this.cardData.imageBackFileId,

                        password:encryptedInputValue,
                        encryptedRc:randomValue,

                        cardMediaNo:_this.idNo.cardNum,
                        account:_this.idNo.account,
                        lxPhone:_this.idNo.phone,
                        idNo:_this.cardData.idcard,
                        gender:_this.cardData.sex,
                        birthDay:_this.cardData.birth,
                        userName:_this.cardData.name,
                        nation:_this.cardData.nation,
                        address:_this.cardData.address,
                        pushCardDate:_this.cardData.validDate,
                        inVaidDate:_this.cardData.inValidDate,
                        pushOrgin:_this.cardData.authority,
                        desc:_this.desc
                    }
                    console.log('submit',param)
                    let result = await getServerDataH5('/yqt/accountMgr/accountMgrForH5.changePassWord', param,'POST')
                    console.log('result',result)
                     if(result.code === 0){
                        setBusinessData('statuc',1)
                        openRouterByValue("result",'',_this);
                    }else{
                        showToast(result.rdesc);
                        _this.loadingFlag = false;
                    }
                }else{
                    showToast('请输入正确的6位数密码!');
                    _this.loadingFlag = false;
                }
            }catch (error) {
                _this.loadingFlag = false;
                console.log(error);
            }
            
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .step4{
        background: @color-bg;
        padding: .3rem 0;
        .step-header{
            margin: 0 .3rem .3rem .3rem;
        }
        .identify-result{
            background: @color-white;
            padding: .6rem 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .status1{
                background: url('../../../resource/img/icon_success_big.png') no-repeat center;
            }
            .status2{
                background: url('../../../resource/img/icon_failed_big.png') no-repeat center;
            }
            .status3{
                background: url('../../../resource/img/icon_wait_big.png') no-repeat center;
            }
            .status1,.status2,.status3{
                display: block;
                width: 1.04rem;
                height: 1.04rem;
                background-size: 1.04rem 1.04rem;
                margin-bottom: .15rem;
            }
            .status-desc{
                color: @fc-info;
            }
        }
        .sn-pointer{
            position: absolute;
            bottom: 20%;
            left: 26%;
            text-decoration: underline;
            color: #E8422E;
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
    }
</style>
