<template>
    <div class="buyconfirm-warp">
        <div class="buyconfirm-header">
            <group gutter="0">
                <h3>投保人信息：</h3>
                <SnInput
                    title="姓名"
                    text-align="right"
                    v-model="insureInfo.insureName"
                    placeholder="请输入姓名"
                ></SnInput>
                <SnInput
                    title="身份证"
                    type="tel"
                    text-align="right"
                    v-model="insureInfo.insureIdNo"
                    maxlength="18"
                    placeholder="请输入15-18位身份证号"
                ></SnInput>
                <SnInput
                    title="手机号码"
                    type="tel"
                    text-align="right"
                    v-model="insureInfo.phone"
                    maxlength="11"
                    placeholder="请输入手机号码"
                ></SnInput>
                <SnInput
                    title="地址"
                    text-align="right"
                    v-model="insureInfo.address"
                    placeholder="请输入详细地址"
                ></SnInput>
            </group>
        </div>
        <div class="buyconfirm-header">
            <group gutter="0">
                <h3>被保人信息：</h3>
                <x-switch title="被保人为本人" v-model="isInsure" @on-change="onClick"></x-switch>
                <div v-if="!isInsure">
                    <SnInput
                        title="姓名"
                        text-align="right"
                        v-model="beInsureInfo.backInsureName                   "
                        placeholder="请输入姓名"
                    ></SnInput>
                    <SnInput
                        title="身份证"
                        type="tel"
                        text-align="right"
                        v-model="beInsureInfo.backInsureIdNo"
                        maxlength="18"
                        placeholder="请输入15-18位身份证号"
                    ></SnInput>
                </div>
            </group>
        </div>
        
        <div class="agreement">
            <i class="fl" :class="agree?'agree_pre':'agree_nor'" @click="agree=!agree"></i>
            <div class=fr>
                <span class="agree-text">我确认投保人为注册用户本人信息，投保后将与账号绑定，且已同意</span>
                <a class="sn-pointer" @click="openProtocol(1)">《投保须知》</a>
                <a class="sn-pointer" @click="openProtocol(2)">《保险条款》</a><span class="agree-text">和</span>
                <a class="sn-pointer" @click="openProtocol(3)">《隐私政策》</a>
            </div>
        </div>

        <div class="footer footer-buy button-on">
            <div class="fl">
                <h3>金额:<span>¥{{dataInfo.prices}}</span></h3>
            </div>
            <div class="fr">
                <SnButton class="btns" :showLoading="loadingFlag" @SnButtonClick="toBuy">确认投保</SnButton>
            </div>
            
        </div>

    </div>
</template>

<script>
import {Calendar,Group,XSwitch,Icon} from "vux";
import {openRouterByValue,backRouterByValue, getBusinessData,setBusinessData, getServerDataH5,deleteLocalData} from '../../handler/handler'
import { getUrlParams, throttle, showConfirm, showToast } from 'sslib/common/extend'
import { SnButton,SnInput } from 'components'
var urlParams = getUrlParams();
var phone = urlParams.phone;
export default {
    name:'insure',
    components: {
        SnButton,
        SnInput,
        Calendar,
        Icon,
        Group,
        XSwitch
    },
    data() {
        return {
            isInsure:false, 
            loadingFlag:false,
            agree: false,
            id:0,
            insureInfo:{insureName:'',insureIdNo:'',phone:'',address:''},
            beInsureInfo:{},
        }
    },
    created() {
        let _this = this;
        if(!!_this.$route.query.id){
            let id = decodeURIComponent(_this.$route.query.id);
            _this.dataInfo = getBusinessData(id)
            _this.userinfo = getBusinessData(phone)
            _this.id = id
        }
    },
    methods: {
        openProtocol(id){
            openRouterByValue('protocol',{id:id},this)
        },
        toBuy(){
            let _this = this
            if (!_this.validate()) return
            setBusinessData('insureInfo',_this.insureInfo)
            setBusinessData('beInsureInfo',_this.beInsureInfo)
            openRouterByValue('bank',{id:encodeURIComponent(_this.id)},_this)
        },
        onClick(e){
            let _this = this
            if(e){
                _this.beInsureInfo['backInsureName'] = _this.insureInfo.insureName
                _this.beInsureInfo['backInsureIdNo'] = _this.insureInfo.insureIdNo
            }else{
                _this.beInsureInfo['backInsureName'] = ''
                _this.beInsureInfo['backInsureIdNo'] = ''
            }
        },
        validate() {
            let _this = this;
            let reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
            let regCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
            if (!_this.insureInfo.insureName) {
                showToast('请输入投保人的姓名');
                return false;
            }
            if (!_this.insureInfo.insureIdNo) {
                showToast('请输入投保人的身份证号');
                return false;
            }
            if (!regCard.test(_this.insureInfo.insureIdNo)) {
                showToast('请输入正确投保人的身份证号');
                return false;
            }
            if (!_this.insureInfo.address) {
                showToast('请输入投保人的地址');
                return false;
            }
            if (!_this.insureInfo.phone) {
                showToast('请输入投保人的手机号');
                return false;
            }
            if (!reg.test(_this.insureInfo.phone)) {
                showToast('请输入投保人的正确手机号');
                return false;
            }
            if (!_this.beInsureInfo.backInsureName) {
                showToast('请输入被保人的姓名');
                return false;
            }
            if (!regCard.test(_this.beInsureInfo.backInsureIdNo)) {
                showToast('请输入正确被保人的身份证号');
                return false;
            }
            if (!_this.beInsureInfo.backInsureIdNo) {
                showToast('请输入被保人的身份证号');
                return false;
            }
            if (!_this.agree) {
                showToast('请勾选并阅读相关协议');
                return false;
            }
            
            return true;
        },
    },
    watch: {
        "insureInfo.insureIdNo":{
            deep:true,
            handler(newVal,oldVal){
                let _this = this
                if(_this.isInsure){
                   _this.beInsureInfo.backInsureIdNo = newVal
                }
            }
        }
    }

}
</script>

<style lang="less" scoped> 
    @import (reference) "~components/style/common";
    @import '~vux/src/styles/1px.less';
    .account-btn{
        height:0.8rem;
        line-height: 0.8rem;
        background:linear-gradient(132deg,rgba(255,134,109,1) 0%,rgba(250,65,143,1) 100%);
        border-radius:40px;
        text-align: center;
        color: @color-white;
        font-size: .32rem;
        margin: 20px 20px 40px;
    }
    .footer{
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 99;
        width: 100%;
        height:1.12rem;
        background:rgba(255,255,255,1);
        box-shadow:0px -2px 8px 0px rgba(0,0,0,0.06);
        padding: 7px .3rem 0;
        .btns{
            height:0.8rem;
            line-height: 0.8rem;
            background:linear-gradient(132deg,rgba(255,134,109,1) 0%,rgba(250,65,143,1) 100%);
            border-radius:40px;
            text-align: center;
            color: @color-white;
            font-size: .32rem;
        }
    }
    .buyconfirm-header{
        background-color: @color-white;
        h3{
            color: #333;
            font-size: .3rem;
            padding: 10px;
            background-color: #e8e8e8;
        }
        .mt{
            margin-top: 10px;
        }
    }

    .prod{
        background-color: @color-white;
        display: flex;
        padding: .3rem;
        margin-top: 0.32rem;
        .fl{
            flex: 1;
            img{
                width: 100%;
                border-radius: .03rem;
            }
        }
        .fr{
            flex: 3;
            h2{
                font-size: 0.32rem;
                .ov-text(1);
                margin-bottom: 0.16rem;
            }
            .pirce{
                display: flex;
                h3{
                    font-size: 0.4rem;
                    color: #FF6A56;
                    justify-content: flex-start;
                    flex: 1;
                    height: 30px;
                    line-height: 30px;
                }
                .num{
                    flex: 3;
                    justify-content: flex-end;
                    margin-top: 5px;
                }

            }

        }
    }
    .footer-buy{
        .fl{
            height: 0.8rem;
            line-height: 0.8rem;
            h3{
                font-size:0.28rem;
                color: #999;
                span{
                    color: #FF6A56;
                    font-size: 0.4rem;
                    padding-left: 4px;
                }
            }
        }
        .fr{
            width: 2.04rem;
        }
    }
    .checklist{
        margin-top: 0.2rem;
        padding-bottom: 70px;
        .noms{margin-top: 0;}
        h2{
            font-size: .3rem;
            color: #333;
            padding: 0.2rem
        }
        .li{
            display: flex;
            .fl{
                flex: 3;
            }
            .fr{
                flex: 1;
                text-align: right;
                margin-top: 10px;

            }
            background-color: @color-white;
            padding: 0.2rem;
            border-bottom: 1px solid #f1f1f1;
            .h2{
                margin-bottom: .2rem;
                span{
                    font-size: .2rem;
                    color: #333;
                    background-color: #f1f1f1;
                    display: inline-block;
                    padding: .02rem .06rem;
                    border-radius: 50px;
                    border: 1px solid #d1d1d1
                }
                i{
                    font-size: .2rem;
                    display: inline-block;
                    padding: .02rem .08rem;
                    border-radius: 50px;
                    background-color: @color-luzhou;
                    color: #fff;
                }
            }
        }
    }
    .agreement {
        display: flex;
        align-items: center;
        margin: 0.3rem;
        font-size: @fs-mob-smaller;
        .fl{
            float: left;
            width: 10%;
        }
        .fr{
            margin-left: 3%;
            width: 87%;
        }

        .agree_pre{
            background: url('../../../resource/img/icon_agree_pre.png') no-repeat center;
        }
        .agree_nor{
            background: url('../../../resource/img/icon_agree_nor.png') no-repeat center;
        }
        .agree_pre,.agree_nor{
            display: inline-block;
            width: .24rem;
            height: .24rem;
            background-size: .24rem .24rem;
        }
        .agree-text{
            margin-left: 0.15rem;
            color: @fc-info;
        }
        a {
            color: #3891FF;
        }
    }
</style>
