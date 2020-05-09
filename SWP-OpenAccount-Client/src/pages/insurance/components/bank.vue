<template>
    <div class="checklist">
        <div class="li" @click="toactives('wxpay')">
            <div class="fl"><img src="../../../resource/img/icon_wx.png"><strong>微信支付</strong></div>
            <div class="fr" v-if="wxpay">
                <icon type="success"></icon>
            </div>
        </div>
        <div class="li" @click="toactives('lzpay')">
            <div class="fl"><img src="../../../resource/img/icon_bank.png"><strong>酒城卡支付</strong></div>
            <div class="fr" v-if="lzpay">
                <icon type="success"></icon>
            </div>
        </div>
        <div v-if="lzpay">
            <div v-if="loading">
                <div class="loading-toast">
                    <i class="icon-loading"></i>
                    <p class="loading-content">酒城卡数据获取中...</p>
                </div>
            </div>
            <div v-else>
                <div v-if="cardList.length != 0">
                    <div class="li items" v-for="(item,idx) in cardList" :key='idx' @click="toactives(idx,item)">
                        <div class="fl">
                            <div class="h2">姓名：{{item.name}}   <span>{{item.baseAccountFlag == 11 ? '二': '一'}}类卡</span></div>
                            <p>{{item.accountX}}</p>
                        </div>
                        <div class="fr" v-if="idx == ids">
                            <icon type="success"></icon>
                        </div>
                    </div>
                </div>
                <div class="li" @click="toactives('other')">
                    <div class="fl"><h2>其他酒城卡支付</h2></div>
                    <div class="fr" v-if="other">
                        <icon type="success"></icon>
                    </div>
                </div>
                <div class="buyconfirm-header noms" v-if="other">
                    <SnInput
                        title="户名"
                        type="text"
                        text-align="right"
                        v-model="card.name"
                        placeholder="请输入银行卡户名"
                    ></SnInput>
                    <SnInput
                        title="银行卡号"
                        type="number"
                        text-align="right"
                        v-model="card.nums"
                        :maxlength="maxlength"
                        placeholder="请输入银行卡号"
                    ></SnInput>
                </div>
            </div>
        </div>
       
        <div class="footer footer-buy button-on">
            <SnButton class="btns" :showLoading="loadingFlag" @SnButtonClick="toBuy">确认投保</SnButton>
        </div> 
        <!-- <form :action="wxpayinfo.payUrl" method="post" ref="form">
             <input type="hidden" name="merchantNo" :value="wxpayinfo.merchantNo"/>
            <input type="hidden" name="successUrl" :value="wxpayinfo.successUrl"/>
            <input type="hidden" name="storeNo" :value="wxpayinfo.storeNo"/>
            <input type="hidden" name="posNum" :value="wxpayinfo.posNum"/>
            <input type="hidden" name="userAgent" :value="wxpayinfo.userAgent"/>
            <input type="hidden" name="outTradeNo" :value="wxpayinfo.outTradeNo"/>
            <input type="hidden" name="totalAmount" :value="wxpayinfo.totalAmount"/>
            <input type="hidden" name="merchantNoticeUrl" :value="wxpayinfo.merchantNoticeUrl"/>
            </form> 
            -->
        <!-- <form action="http://118.122.48.19:19006/preService/payApi/getOAuthUrlGETUrl" method="get" ref="form">
            <input type="hidden" name="outTradeNo" :value="wxpayinfo.outTradeNo"/>
            <input type="hidden" name="merchantNo" :value="wxpayinfo.merchantNo"/>
            <input type="hidden" name="terminalId" :value="wxpayinfo.terminalId"/>
            <input type="hidden" name="totalAmount" value="0.01"/>
            <input type="hidden" name="storeId" :value="wxpayinfo.storeId"/>
            <input type="hidden" name="businessParams" :value="wxpayinfo.businessParams"/>
            <input type="hidden" name="goodsName" :value="wxpayinfo.goodsName"/>
            <input type="hidden" name="userAgent" :value="wxpayinfo.userAgent"/>
            <input type="hidden" name="merchantNoticeUrl" :value="wxpayinfo.merchantNoticeUrl"/>
        </form>  -->
    </div>
</template>
<script>
import {Icon } from "vux"
import axios from 'axios'
import {openRouterByValue,backRouterByValue, getBusinessData,setBusinessData, getServerDataH5,deleteLocalData} from '../../handler/handler'
import { getUrlParams, throttle, showConfirm, showToast } from 'sslib/common/extend'
import { SnButton,SnInput,SnCell } from 'components'
var urlParams = getUrlParams();
var phone = urlParams.phone;
export default {
    name:'bank',
    components: {
        SnButton,
        SnInput,
        SnCell,
        Icon
    },
    data() {
        return {
            ids:0,
            loading:true,
            loadingFlag:false,
            insureInfo:{},
            beInsureInfo:{},
            states:false,
            cardList:[],
            firstDisCount:{},
            lzpay:false,
            wxpay:false,
            other:false,
            card:{name:'',nums:''},
            dataInfo:{},
            userInfo:{},
            info:{},
            wxpayinfo:{}
        }
    },
    created() {
        let _this = this;
        if(!!_this.$route.query.id){
            let id = decodeURIComponent(_this.$route.query.id);
            _this.dataInfo = getBusinessData(id)
            _this.userInfo = getBusinessData(phone)
            _this.id = id           
        }
        _this.insureInfo = getBusinessData('insureInfo')
        _this.beInsureInfo = getBusinessData('beInsureInfo')
    },
    methods: {
        getCardList(){
            let _this = this;
            let parame = {cpyId:-1, businessType: 1,phone:phone}
            getServerDataH5('/yqt/accountMgr/accountMgr.queryAccountList',parame,'POST').then(res => {
                console.log(res)
                if(res.code == 0 && res.accountList.length !== 0){
                    _this.loading = false
                    let data = res.accountList
                    _this.card.name = data[0].name
                    _this.card.nums = data[0].account
                    let reg = /^(\d{4})\d+(\d{4})$/
                    let discountArr = []
                    for(let i=0;i<data.length;i++){
                        data[i].accountX =  data[i].account.replace(reg, "$1**************$2")
                        discountArr.push(data[i])
                    }
                    _this.cardList = discountArr
                }else{
                    _this.loading = false
                    console.log(res)
                }
            })
            
        },
        toactives(i,item){
            let _this = this
            if(i=='lzpay'){
                _this.lzpay = true
                _this.wxpay = false
                if( _this.cardList.length == 0){
                    _this.getCardList()
                }
            }else if(i=='wxpay'){
                _this.wxpay = true
                _this.lzpay = false
                _this.card.name = ''
                _this.card.nums = ''
            }else if(i=='other'){
                _this.card.name = ''
                _this.card.nums = ''
                _this.wxpay = false
                _this.lzpay = true
                _this.other = true
                _this.ids = null
            } else{
                if(item.openMark == '01'){
                    _this.lzpay = true
                    _this.wxpay = false
                    _this.other = false
                    this.ids=i
                    for(let j =0;j<_this.cardList.length;j++){
                        if(i==j){
                            _this.card.name = _this.cardList[j].name
                            _this.card.nums = _this.cardList[j].account
                        }
                    }
                }else{
                    showToast('该户暂未进行联网核查比对，暂时无法使用，请明日再试')
                }
            }
        },
        toBuy(){
            let _this = this
            if(!(_this.wxpay || _this.lzpay)){
                showToast('请选择支付方式');
                return false;
            }else if(_this.lzpay){
                _this.loadingFlag = false
                if (!_this.card.name) {
                    showToast('请输入户名');
                    return false;
                }
                if (!_this.card.nums) {
                    showToast('请输入银行卡');
                    return false;
                }
                _this.submits()
            }else{
                _this.submits()
            }
        },
        submits(){
            let _this =this
            let param = {
                prodName:_this.dataInfo.title,
                prodId:_this.dataInfo.id,
                insureName:_this.insureInfo.insureName,
                insureIdNo:_this.insureInfo.insureIdNo,
                backInsureName:_this.beInsureInfo.backInsureName,
                backInsureIdNo:_this.beInsureInfo.backInsureIdNo,
                phone:_this.insureInfo.phone,
                insuranceCount:1,
                insuranceAmount:_this.dataInfo.prices*100,
                accountNo:_this.card.nums,
                accountName:_this.card.name,
                address:_this.insureInfo.address,
                uaId:_this.userInfo.UAId,
                lgParam:_this.userInfo.lgParam,
                phone:phone,
                payChannel:_this.wxpay ? '02' : '01'
            }
            _this.loadingFlag = true;
            getServerDataH5('/yqt/buyTicket/insurance.createOrder',param,'POST').then(result => {
                if(result.code == 0){
                    if(result.userAgent == 'WeiXIN'){
                        _this.wxpayinfo = result
                        setBusinessData(phone, getBusinessData(phone))
                        _this.OrderUpdata(result.outTradeNo).then(res=>{
                            if(res.code == 0){
                                _this.wxPayFn()
                            }
                        })
                    }else{
                        result.accountName = _this.card.name
                        setBusinessData(result.tranSeq,result)
                        openRouterByValue('pay',{transeq:encodeURIComponent(result.tranSeq)},_this)
                    }
                }else{
                    _this.loadingFlag = false
                    showToast(result.rdesc)
                }
            })
        },
        async OrderUpdata(tranSeq){
            let parame = {tranSeq:tranSeq, phone:phone}
            let data = await getServerDataH5('/yqt/buyTicket/insurance.updateOrderStat',parame,'POST')
            return data
        },
        wxPayFn(){
            let _this = this
            let res = _this.wxpayinfo
            // let url = '/wxpay/preService/payApi/getOAuthUrlPostURL';
            let url = res.payUrl
            // console.log(res)
            let data = {
                outTradeNo:res.outTradeNo,
                merchantNo:res.merchantNo,
                terminalId:res.terminalId,
                totalAmount:res.totalAmount,
                storeId:res.storeId,
                businessParams:res.businessParams,
                goodsName:res.goodsName,
                userAgent:res.userAgent,
                merchantFrontNoticeUrl:res.merchantFrontNoticeUrl
            }

            axios.post(url,data)
            .then(function (response) {
                console.log(response);
                window.location.href=response.data
            })
            .catch(function (error) {
                console.log(error);
            });

        }



    }
}
</script>

<style lang="less" scoped> 
    @import (reference) "~components/style/common";
    @import '~vux/src/styles/1px.less';
    .checklist{
        margin-top: 0.2rem;
        padding-bottom: 70px;
        .noms{margin-top: 0;}
        h2{
            font-size: .4rem;
            color: #333;
            font-weight: 400;
            // padding: 0.2rem
        }
        .li{
            display: flex;
            .fl{
                flex: 3;
                display: flex;
                margin-top: 3px;
                img{
                    width: 20px;
                    height: 20px;
                    vertical-align:middle;
                    margin-right: 5px;
                }
            }
            .fr{
                flex: 1;
                text-align: right;
                // margin-top: 10px;

            }
            background-color: @color-white;
            padding: 0.3rem 0.2rem;
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
        .items{
            padding: 0.2rem;
            .fl{display: block;}
            .fr{
                i{
                    margin-top: 10px;
                }
            }
        }
    }
    .buyconfirm-header{
        margin-top: 0.32rem;
        background-color: @color-white;
    }
    .noms{margin-top: 0;}
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
    #toastLoaderFullScreen {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0px;
        bottom: 0px;
        z-index: 99999;
        overflow: hidden;
        word-break: break-all;
        background-color: transparent;
    }
    /* 遮罩 */
    #toastLoader_content {
        text-align: center;
        border-radius: 10px;
        position: fixed;
        top: 40%;
        left: 50%;
        margin-left: -4rem;
        z-index: 99999;
        background: rgba(0, 0, 0, 0.7);
    }
    
    #toastLoaderText {
        margin: 20px;
        word-wrap: break-word; /*自动换行*/
        text-align: center;
        font-size: 16px;
        color: #fff;
        /* background-color: red; */
    }
     .loading-toast{
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px 0;
        .icon-loading{
            width: 24px;
            height: 24px;
            background: url('../../../resource/img/loading.gif') no-repeat center;
            background-size: cover;
        }
        p{
            font-size: 16px;color: #999;line-height:24px;
            margin-left: 10px;;
        }
    }
</style>
