<template>
    <div class="buyconfirm-warp">
        <div class="buyconfirm-header">
            <SnInput
                title="姓名"
                text-align="right"
                v-model="content.name"
                placeholder="请输入姓名"
            ></SnInput>
            <SnInput
                title="手机号码"
                type="tel"
                text-align="right"
                v-model="content.tel"
                maxlength="11"
                placeholder="请输入手机号码"
            ></SnInput>
            <group gutter="0">
                <!-- <SnInput
                    title="订票日期"
                    type="tel"
                    text-align="right"
                    v-model="content.time"
                    maxlength="11"
                    placeholder="请选择订票日期"
                ></SnInput> -->
                <Calendar 
                    :readonly="readonly" 
                    v-model="content.time" 
                    title="订票日期" 
                    disable-past 
                    placeholder="请选择订票日期" 
                    @on-change="changes"
                   >
                </Calendar>
            </group>
        </div>
        <div class="prod">
            <div class="fl">
                <img :src="bannerItem">
            </div>
            <div class="fr">
                <h2>{{dataInfo.ticketName}}</h2>
                <div class="pirce">
                    <h3>¥{{dataInfo.marketPrice}}</h3>
                    <div class="num">
                        <inline-x-number v-if="numStat" width="50px" :min="1" button-style="round" @on-change="changeNumber" v-model="content.nums"></inline-x-number>
                    </div>
                </div>
            </div>
        </div>
        <div class="checklist">
            <h2>请选择支付卡号</h2>
            <div v-if="cardList.length != 0">

                <div class="li" v-for="(item,idx) in cardList" :key='idx' @click="toactives(idx)">
                    <div class="fl">
                            <div class="h2">姓名：{{item.name}}   <span>{{item.baseAccountFlag == 11 ? '二': '一'}}类卡</span>  <i>{{item.DisCount*10}}折</i></div>
                            <p>{{item.accountX}}</p>
                    </div>
                    <div class="fr" v-if="idx == ids">
                        <icon type="success"></icon>
                    </div>
                </div>

                <div v-if="firstDisCount.cardStat">
                    <SnButton v-if="numStat" class="account-btn" :showLoading="showLoading" @SnButtonClick="toAccount(1)">开通二类户获取购票{{firstDisCount.secondDisCount * 10}}折</SnButton>
                </div>

            </div>
            <div v-else>
                 <SnButton v-if="numStat" class="account-btn" :showLoading="showLoadings" @SnButtonClick="toAccount(2)">开通二类户获取购票{{firstDisCount.secondDisCount * 10}}折</SnButton>
            </div>
            <div class="li" @click="toactives('other')">
               <div class="fl">
                    <div class="h2">其他泸州银行卡支付</div>
               </div>
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

        <div class="footer footer-buy button-on">
            <div class="fl">
                <h3>总金额:<span>¥{{buyAmount}}</span></h3>
            </div>
            <div class="fr">
                <SnButton class="btns" :showLoading="loadingFlag" @SnButtonClick="toBuy">提交订单</SnButton>
            </div>
            
        </div>

    </div>
</template>

<script>
import {Calendar,Group,InlineXNumber,Icon} from "vux";
import {openRouterByValue,backRouterByValue, getBusinessData,setBusinessData, getServerDataH5,getLocalData,setLocalData,deleteLocalData} from '../../handler/handler'
import { getUrlParams, throttle, showConfirm, showToast } from 'sslib/common/extend'
import { SnButton,SnInput } from 'components'
var urlParams = getUrlParams();
var phone = urlParams.phone;
export default {
    name:'buyconfirm',
    components: {
        SnButton,
        SnInput,
        Calendar,
        Icon,
        Group,
        InlineXNumber,
        payInfo:{plain:'',sign:''}
    },
    data() {
        return {
            readonly:false, 
            loadingFlag:false,
            maxlength:'11',
            discount:[],
            id:0,
            ids:0,
            bannerItem:'',
            dataInfo:{},
            numStat:false,
            showLoading:false,
            showLoadings:false,
            content:{name:'',tel:'',time:'',nums:1},
            cardList:[],
            card:{name:'',nums:''},
            other:false,
            states:false,
            firstDisCount:{}
        }
    },
    computed: {
        buyAmount() {
            let _this = this
            if(_this.states){
                let n = null
                if(_this.other){
                    n = (_this.dataInfo.marketPrice * _this.content.nums) * _this.firstDisCount.firstDisCount
                }else{
                    n = (_this.dataInfo.marketPrice * _this.content.nums) * _this.cardList[_this.ids].DisCount
                }
                return n.toFixed(2)
            }
            
        }
    },
    created() {
        let _this = this;
        if(!!_this.$route.query.ticketId){
            let id = decodeURIComponent(_this.$route.query.ticketId);
            _this.dataInfo = getLocalData(id)
            _this.bannerItem = getLocalData(id).ticketFigureUrl
            _this.userinfo = getBusinessData(phone)
            _this.id = id
        }
        // let times = _this.getDateStr(1)
        // console.log(times)

        _this.init();
    },
    methods: {
        init() {
            let _this = this;
            let parame = {
                phone:phone
            }
            getServerDataH5('/yqt/buyTicket/buyTicket.queryDisCount',parame,'POST').then(res => {
                console.log(res)
                if(res.code ==0){
                    _this.getCardList(res)
                    _this.firstDisCount = res
                }
            })
        },
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
        toAccount(stat){
            let _this = this;
            if(stat == 1){
                setLocalData('ticket',1)
                setLocalData('ticketid',_this.id)
                _this.checkOpenAccount('openaccount.html#/')
            }else{
                _this.showLoadings = true;
                getServerDataH5(textUrl+'/yqt/user/user.queryCertificationByPhone',{phone:phone},'GET').then(result => {
                    if(result.code===0){
                        let data = result;
                        if(data.status==1){
                            setLocalData('ticket',1)
                            setLocalData('ticketid',_this.id)
                            _this.checkOpenAccount('openaccount.html#/')
                        }else if(data.status==2){
                            _this.showLoadings = false;
                            _this.showconfirm("请先进行实名认证", function(){
                                window.close(); 
                            },function(){
                                setLocalData('ticket',1)
                                setLocalData('ticketid',_this.id)
                                setLocalData(phone,getBusinessData(phone))
                                window.location.href = 'openaccount.html#/identifystep1?phone='+phone;
                            },"先不认证","实名认证",true); 

                        }
                    }else{
                        _this.showLoadings = false;
                        showToast(result.desc);
                    }
                },rej=>{
                    _this.showLoadings = false;
                    _this.loadingFlag = false;
                })
            }

        },
        async checkOpenAccount(url){
            let _this = this;
            let param = {
                phone:phone
            }
            try {
                    //Ⅱ类开户要先判断是否认证
                    const result = await getServerDataH5(textUrl+'/yqt/user/user.queryCertificationInfo',param,'POST');
                    if(result.code === 0){
                        if(result.status === 1){//认证成功
                            //Ⅱ类户开通权限校验(开通的数量有限制)
                            _this.showLoading = true;
                            const checkdata = await getServerDataH5(textUrl+'/yqt/accountMgr/accountMgr.openAccountAuthForH5',param,'POST');
                            if(checkdata.code === 0){
                                if(checkdata.status === 1){
                                    const newResult = await getServerDataH5(textUrl+'/yqt/accountMgr/accountMgr.uploadInfoAndSign', param,'POST');
                                    if(newResult.code === 0){
                                        let data = newResult;
                                        if(!!data.orderNo){
                                            data['UAId'] = getBusinessData(phone).UAId;
                                            data['phone'] = phone;
                                            data['name'] = result.name;
                                            setBusinessData(data.orderNo,data);

                                            // openRouterByValue("identifystep3",{identify:1,name:result.name,orderNo:encodeURIComponent(data.orderNo)},_this);
                                             window.location.href = `${url}identifystep3?identify=1&name=${result.name}&orderNo=`+data.orderNo
                                            // window.open();
                                        }
                                    }else{
                                        _this.showLoading = false;
                                        showToast(newResult.desc);
                                    }
                                    // openPage(`${url}identifystep3?identify=1&name=${result.name}`);
                                }else if(checkdata.status === 2){
                                    _this.showconfirm("已开通Ⅱ类户，无法重复开通",null,function(){
                                        // window.close(); 
                                    },"","确定",false);
                                }
                            }else{
                                _this.showLoading = false;
                                showToast(checkdata.desc);
                            }
                        }else if(result.status === 2){//未认证
                            _this.showconfirm("开通Ⅱ类户需要实名认证，请认证后再开通",function(){
                                // window.close(); 
                            },function(){
                                // openRouterByValue("identifystep1",{phone:phone},_this);
                                setLocalData(phone,getBusinessData(phone))
                                window.location.href = `${url}identifystep1?&phone=`+phone
                                // window.open();
                            },"先不认证","实名认证",true); 
                        }else if(result.status === 3){//认证中
                            _this.showconfirm("审核中，请等待审核结果",null,function(){
                                // window.close(); 
                            },"","确定",false);
                        }
                    }else{
                        _this.showconfirm("开通Ⅱ类户需要实名认证，请认证后再开通",function(){
                            // window.close(); 
                        },function(){
                            // openRouterByValue("identifystep1",{phone:phone},_this);
                            setLocalData(phone,getBusinessData(phone))
                            window.location.href = `${url}identifystep1?phone=`+phone
                            // window.open();
                        },"先不认证","实名认证",true); 
                    }
                }
                //第一步查询认证系统工作时间
                // let seq = Common.newSeq();
                // param.lgParam.seq = seq;
                // getServerDataH5(textUrl+'/yqt/certification/certification.queryCertificationWorkingTime',param,'POST').then(result => {
                // // Common.AjaxFun('POST',textUrl+'/yqt/certification/certification.queryCertificationWorkingTime', param, function (result) {
                //     if(!!result.success){
                //         let timeresult = result.result;
                //         if(timeresult.status === 1){//在工作时间内
                //             //2类开户要先判断是否认证
                //             seq = Common.newSeq();
                //             param.lgParam.seq = seq;
                //             Common.AjaxFun('POST',textUrl+'/yqt/user/user.queryCertificationInfo', param, function (response) {
                //                 if(!!response.success){
                //                     let result = response.result;
                //                     if(result.status === 1){//认证成功
                //                         //2类户开通权限校验(开通的数量有限制)
                //                         _this.showLoading = true;
                //                         seq = Common.newSeq();
                //                         param.lgParam.seq = seq;
                //                         Common.AjaxFun('POST',textUrl+'/yqt/accountMgr/accountMgr.openAccountAuth', param, function (returnData) {
                //                             _this.showLoading = false;
                //                             if(!!returnData.success){
                //                                 let checkdata = returnData.result;
                //                                 if(checkdata.status === 1){
                //                                     seq = Common.newSeq();
                //                                     param.lgParam.seq = seq;
                //                                     Common.AjaxFun('POST',textUrl+'/yqt/accountMgr/accountMgr.uploadInfoAndSign', param, function (newResult) {
                //                                         if(!!newResult.success){
                //                                             let data = newResult.result;
                //                                             if(!!data.orderNo){
                //                                                 data['UAId'] = _this.loginData.UAId;
                //                                                 setLocalData(data.orderNo,data);
                //                                                 openRouterByValue("identifystep3",{identify:result.name,orderNo:encodeURIComponent(data.orderNo)},_this);
                //                                                 // window.open(`${url}identifystep3?identify=1&name=${result.name}&orderNo=`+data.orderNo);
                //                                             }
                //                                         }else{
                //                                             showToast('出错了，请重新操作。','middle');
                //                                         }
                //                                     })
                //                                 }else if(checkdata.status === 2){
                //                                     _this.showconfirm("已开通Ⅱ类户，无法重复开通",null,function(){
                //                                         window.close(); 
                //                                     },"","确定",false);
                //                                 }
                //                             }
                //                         })
                //                     }else if(result.status === 2){//未认证
                //                         _this.showconfirm("开通Ⅱ类户需要实名认证，请认证后再开通",function(){
                //                             window.close(); 
                //                         },function(){
                //                             openRouterByValue("identifystep1",{phone:phone},_this);
                //                             // window.open(`${url}identifystep1?phone=`+phone);
                //                         },"先不认证","实名认证");
                //                     }else if(result.status === 3){//认证中
                //                         _this.showconfirm("审核中，请等待审核结果",null,function(){
                //                             window.close(); 
                //                         },"","确定",false);
                //                     }
                //                 }
                //             })
                //         }else if(timeresult.status === 2){//不在工作时间内
                //             _this.showconfirm(timeresult.certificationWorkingTime,null,function(){
                //                 window.close(); 
                //             },"","确定",false);
                //         }
                //     }
                // })
             catch (error) {
                _this.showLoading = false;
                console.log(error);
            } 
        },
        getCardList(obj){
            let _this = this;
            let item = obj
            let parame = {cpyId:-1, businessType: 1,phone:phone}
            getServerDataH5('/yqt/accountMgr/accountMgr.queryAccountList',parame,'POST').then(res => {
                console.log(res)
                let data = res.accountList
                if(data.length !== 0){
                    let reg = /^(\d{4})\d+(\d{4})$/
                    let discountArr = []
                    for(let i=0;i<data.length;i++){
                        for(let j=0;j<item.acctList.length;j++){
                            if(data[i].account == item.acctList[i].account){
                                data[i].totalNum = item.acctList[i].totalNum
                                data[i].accountX =  data[i].account.replace(reg, "$1**************$2")
                                if(data[i].baseAccountFlag == 11){
                                    if(item.acctList[i].totalNum < item.bucketLimit*1){
                                        data[i].DisCount = item.secondDisCount
                                    }else{
                                        data[i].DisCount = item.firstDisCount
                                    }
                                }else{
                                    data[i].DisCount = item.firstDisCount
                                }
                            }
                            
                        }
                        discountArr.push(data[i])
                    }
                    _this.numStat =  true
                    _this.states = true
                    _this.cardList = discountArr
                    _this.buyAmount
                }else{
                    _this.numStat = true
                    _this.other = true
                    _this.states = true
                    _this.buyAmount
                }
            })
            
        },
        changes1(value, label){
            console.log(value, label)
        },
        changes(i){},
        toBuy(){
            let _this = this
            if (!_this.validate()) return
            if(_this.other){
                if (!_this.card.name) {
                    showToast('请输入户名');
                    return false;
                }
                if (!_this.card.nums) {
                    showToast('请输入银行卡');
                    return false;
                }
                let reg = /^(\d{4})\d+(\d{4})$/
                _this.card.numsX = _this.card.nums.replace(reg, "$1**************$2")
                _this.submits()
            }else{
                _this.submits()
            }
        },
        submits(){
            let _this =this
            let param = {}
            if(_this.other){
                param = {
                    payerAccount:_this.card.nums,
                    amount: _this.buyAmount * 100,
                    ticketId:_this.id,
                    UAId:_this.userinfo.UAId,
                    ticketCount:_this.content.nums,
                    date:Date.parse(new Date(_this.content.time)),
                    name:_this.content.name,
                    accountName:_this.card.name,
                    mobile:_this.content.tel,
                    transSeq:Date.parse(new Date()),              
                    tradeName:_this.dataInfo.ticketName,
                    bannerItem:_this.bannerItem,
                    phone:phone
                }
            }else{
                param = {
                    payerAccount:_this.cardList[this.ids].account,
                    amount: _this.buyAmount * 100,
                    ticketId:_this.id,
                    UAId:_this.userinfo.UAId,
                    ticketCount:_this.content.nums,
                    date:Date.parse(new Date(_this.content.time)),
                    name:_this.content.name,
                    accountName:_this.cardList[this.ids].name,
                    mobile:_this.content.tel,
                    transSeq:Date.parse(new Date()),              
                    tradeName:_this.dataInfo.ticketName,
                    bannerItem:_this.bannerItem,
                    phone:phone
                }
            }
            _this.loadingFlag = true;
            console.log(param)
            getServerDataH5('/yqt/buyTicket/buyTicket.createOrder',param,'POST').then(result => {
               console.log(result)
               if(result.code == 0){
                    if(_this.other){
                        result['accountX'] = _this.card.numsX
                        result['account'] =  _this.card.nums
                        result['accountName'] = _this.card.name
                    }else{
                        result['accountX'] = _this.cardList[this.ids].accountX
                        result['account'] = _this.cardList[this.ids].account
                        result['accountName'] = _this.cardList[this.ids].name
                    }
                   
                    setBusinessData(_this.userinfo.UAId,result)
                    openRouterByValue('pay',{uid:encodeURIComponent(_this.userinfo.UAId)},_this)
                    _this.loadingFlag = false;
               }else{
                   _this.loadingFlag = false;
                   showToast(result.rdesc)
               }
            })
        },
        validate() {
            let _this = this;
            let reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
            if (!_this.content.name) {
                showToast('请输入姓名');
                return false;
            }
            if (!_this.content.tel) {
                showToast('请输入手机号');
                return false;
            }
            if (!reg.test(_this.content.tel)) {
                showToast('请输入正确手机号');
                return false;
            }
            
            if (!_this.content.time) {
                showToast('请选择购票日期');
                return false;
            }
            return true;
        },
        toactives(i){
            let _this = this
            if(i=='other'){
                if(_this.numStat){
                    _this.other = true
                    _this.numStat = true
                    _this.ids = null
                    _this.buyAmount
                }
            }else{
                _this.other = false
                this.ids=i
            }
        },
        changeNumber(i){
            let _this =this
            if(_this.other){
                if(_this.dataInfo.stores <= i){
                    _this.content.nums = _this.dataInfo.stores
                    showToast('购票数量不足')
                }
            }else{
                let num = parseInt(i + _this.cardList[_this.ids].totalNum)
                if(_this.cardList[_this.ids].baseAccountFlag == 11){
                    console.log(_this.firstDisCount)
                    if(_this.cardList[_this.ids].totalNum >= _this.firstDisCount.bucketLimit*1){
                        if(i <= _this.dataInfo.stores){
                            _this.content.nums = i
                        }else{
                            showToast('购票数量不足')
                            _this.content.nums = _this.dataInfo.stores
                        }
                    }else{
                        if(num => _this.firstDisCount.bucketLimit*1){
                            _this.content.nums = i - 1
                            showToast(`二类户优惠价格购买次数剩余${_this.firstDisCount.bucketLimit - _this.cardList[_this.ids].totalNum}次`)
                        }
                    }
                }
            }
        },
        getDateStr(AddDayCount) {
            let dd = new Date();
            dd.setDate(dd.getDate()+AddDayCount);
            let y = dd.getFullYear();
            let m = dd.getMonth()+1;
            let d = dd.getDate();
            return y+"-"+m+"-"+d;
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
        margin-top: 0.32rem;
        background-color: @color-white;
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
</style>
