<template>
    <div class="buyconfirm-warp">
        <div class="buyconfirm-header">
            
            <h3>银行卡信息：</h3>
            <SnInput
                title="姓名"
                readonly
                text-align="right"
                v-model="payInfo.accountName"
                placeholder="请输入姓名"
            ></SnInput>
            <SnInput
                title="卡号"
                readonly
                type="tel"
                text-align="right"
                v-model="payInfo.payerAccount"
                maxlength="18"
                placeholder="请输入银行卡号"
            ></SnInput>
        </div>
        <div class="buyconfirm-header">
            
            <h3>投保人信息：</h3>
            <SnInput
                title="姓名"
                readonly
                text-align="right"
                v-model="insureInfo.insureName"
                placeholder="请输入姓名"
            ></SnInput>
            <SnInput
                title="身份证"
                readonly
                type="tel"
                text-align="right"
                v-model="insureInfo.insureIdNo"
                maxlength="18"
                placeholder="请输入15-18位身份证号"
            ></SnInput>
            <SnInput
                title="手机号码"
                readonly
                type="tel"
                text-align="right"
                v-model="insureInfo.phone"
                maxlength="11"
                placeholder="请输入手机号码"
            ></SnInput>
            <SnInput
                title="地址"
                readonly
                text-align="right"
                v-model="insureInfo.address"
                placeholder="请输入详细地址"
            ></SnInput>
            
        </div>
        <div class="buyconfirm-header">

            <h3>被保人信息：</h3>
            
            <SnInput
                title="姓名"
                readonly
                text-align="right"
                v-model="beInsureInfo.backInsureName                   "
                placeholder="请输入姓名"
            ></SnInput>
            <SnInput
                title="身份证"
                readonly
                type="tel"
                text-align="right"
                v-model="beInsureInfo.backInsureIdNo"
                maxlength="18"
                placeholder="请输入15-18位身份证号"
            ></SnInput>
                
        </div>
        <div class="footer footer-buy button-on">
            <input type="submit" class="btns" @click="toPay" value="提交">
        </div> 
        <form :action='payInfo.payUrl' method="get" ref="form">
            <input type="hidden" name="Plain" :value="payInfo.plain" />
            <input type="hidden" name="Signature" :value="payInfo.sign" />   
        </form>  
    </div>
</template>

<script>
import {openRouterByValue,backRouterByValue, getBusinessData,setBusinessData, getServerDataH5} from '../../handler/handler'
import { getUrlParams, throttle, showConfirm, showToast } from 'sslib/common/extend'
import { SnButton,SnInput,SnCell } from 'components'
var urlParams = getUrlParams();
var phone = urlParams.phone;
export default {
    name:'pay',
    components: {
        SnButton,
        SnInput,
        SnCell
    },
    data() {
        return {
            transeq:'',
            payInfo:{},
            insureInfo:{},
            beInsureInfo:{},
            url:''
        }
    },
    created() {
        let _this = this;
        if(!!_this.$route.query.transeq){
            let transeq = decodeURIComponent(_this.$route.query.transeq);
            _this.transeq = transeq
            _this.payInfo = getBusinessData(transeq)
            _this.insureInfo = getBusinessData('insureInfo')
            _this.beInsureInfo = getBusinessData('beInsureInfo')
        }
    },
    methods: {
        toPay(){
            let _this = this
            throttle(function(){
                if (!_this.payInfo.payerAccount) {
                    showToast('请输入银行卡号');
                    return false;
                }
                if (!_this.payInfo.accountName) {
                    showToast('请输入户名');
                    return false;
                }
                let parame = {tranSeq:_this.transeq,phone:phone}
                getServerDataH5('/yqt/buyTicket/insurance.updateOrderStat',parame,'POST').then(res => {
                    if(res.code == 0){
                        console.log(res)
                        setBusinessData(phone, getBusinessData(phone))
                        // setBusinessData('insureInfo',{})
                        // setBusinessData('beInsureInfo',{})
                        // setBusinessData(_this.transeq,{})

                        _this.$nextTick(()=>{
                            _this.$refs.form.submit();
                        })
                    }
                })
                
            }.bind(_this))
        },
        validate() {
            let _this = this;
            if (!_this.payInfo.payerAccount) {
                showToast('请输入银行卡号');
                return false;
            }
            if (!_this.payInfo.accountName) {
                showToast('请输入户名');
                return false;
            }
            return true;
        },
    }
}
</script>

<style lang="less" scoped> 
    @import (reference) "~components/style/common";
    @import '~vux/src/styles/1px.less';
    .buyconfirm-warp{
        background-color: #fff;height: 100vh;
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
            display: block;
            width: 100%;
        }
    }
    .buyconfirm-header{
        border-top: 0.2rem solid #e5e5e5;
        background-color: @color-white;
        h3{
            color: #333;
            font-size: .3rem;
            padding: 10px;
            background-color: #e8e8e8;
        }
        .mt{margin-top: 10px;}
    }
    .footer-buy{
       position: relative;
       background-color: transparent;
       box-shadow: none;
       margin-top: 20px;
    }
    .agreement {
        display: flex;
        align-items: center;
        padding: .24rem !important;
        font-size: @fs-mob-smaller;
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
