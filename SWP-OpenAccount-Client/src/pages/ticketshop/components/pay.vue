<template>
    <div class="buyconfirm-warp">
        <form :action='payInfo.payUrl' method="get" @submit="toPay">
            <div class="buyconfirm-header">
                <SnInput
                    title="银行卡号"
                    text-align="right"
                    v-model="payInfo.accountX"
                    placeholder="请输入银行卡号"
                ></SnInput>
                <SnInput
                    title="户名"
                    text-align="right"
                    v-model="payInfo.accountName"
                    placeholder="请输入户名"
                ></SnInput>
                <!-- <SnCell title="支付密码" value-align="left">
                    <span class="cursor" id="psdCursor"></span>
                    <input
                        class="form_line_input"
                        type="tel" 
                        style="-webkit-text-security:disc"
                        placeholder="请输入支付密码"
                        v-model="content.password"
                        maxlength="6"
                        ref="psd"
                        id="psd"
                    />
                </SnCell> -->
            
            </div>
            <!-- <div class="sn-text">
                <div class="agreement">
                    <i :class="agree?'agree_pre':'agree_nor'" @click="agree=!agree"></i>
                    <span class="agree-text">我已阅读并同意</span>
                    <a class="sn-pointer" @click="openProtocol">《缴费协议》</a>
                </div>
            </div>   -->
            <input type="hidden" name="Plain" :value="payInfo.plain" />
            <input type="hidden" name="Signature" :value="payInfo.sign" />
            <div class="footer footer-buy button-on">
                <input type="submit" class="btns" value="提交">
            </div>    
        </form>  
    </div>
</template>

<script>
import {openRouterByValue,backRouterByValue, getBusinessData,setBusinessData, getServerDataH5,getLocalData,setLocalData} from '../../handler/handler'
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
            content:{cardNum:'',names:''},
            agree: true,
            payInfo:{},
            url:''
        }
    },
    created() {
        let _this = this;
        if(!!_this.$route.query.uid){
            let uid = decodeURIComponent(_this.$route.query.uid);
            _this.payInfo = getBusinessData(uid)
            _this.content['cardNum'] = getBusinessData(uid).account
            _this.content['names'] = getBusinessData(uid).accountName
            _this.url = ''
        }
        _this.init();
    },
    methods: {
        init() {
            let _this = this;

        },
        toPay(){
            let _this = this
            throttle(function(){
                if (_this.validate()){
                    setLocalData(phone, getBusinessData(phone))
                    let parame = {
                        orderNo:_this.payInfo.orderNo
                    }
                    getServerDataH5('/yqt/buyTicket/buyTicket.queryOrderStat',parame,'POST').then(res => {
                        console.log(res)
                        if(res.code == 0){
                            return true
                        }
                    })

                   
                }
            }.bind(_this))
        },
        validate() {
            let _this = this;
            if (!_this.payInfo.account) {
                showToast('请输入银行卡号');
                return false;
            }
            if (!_this.payInfo.accountName) {
                showToast('请输入户名');
                return false;
            }
            return true;
        },
        openProtocol(){

        }
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
        }
    }
    .buyconfirm-header{
        border-top: 0.2rem solid #e5e5e5;
        background-color: @color-white;
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
