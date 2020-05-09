<template>
    <div class="step4">
        <step-header class="step-header" :step="4"></step-header>
        <div class="identify-result">
            <i :class="'status'+status"></i>
            <span>{{statusText}}</span>
            <span class="status-desc" v-if="!!desc">{{desc}}</span> 
        </div>
        <div>
            <SnButton v-if="status==1 || status==2" type="bottom" @SnButtonClickBottom="nextStep">完成</SnButton>
            <!-- <SnButton type="bottom" @SnButtonClickBottom="nextStep">完成</SnButton> -->
            <div v-if="status==1">
                <a class="sn-pointer" @click="nextStep3">点击此处，去开通Ⅱ类户</a>
            </div>

        </div>
    </div>
</template>
<script>
import { openRouterByValue, getBusinessData, getLocalData, getServerDataH5,deleteLocalData,setBusinessData,deleteLocalStorage } from '../../handler/handler'
import StepHeader from './stepheader'
import { SnButton } from 'components'
import common from "sslib/common/common.js";
import { getUrlParams,goBackPage,throttle,initTitleMenu,openPage } from 'sslib/common/extend'
var urlParams = getUrlParams();
var orderNo = urlParams.orderNo;
var h5faceId = urlParams.h5faceId;
var newSignature = urlParams.newSignature;
var UAId = urlParams.UAId;
export default {
    data(){
        return{
            status: 3,
            cardData:{},
            desc:'',
            ids:''
        }
    },
    created(){
        let _this = this;
        _this.init();
    },
    computed:{
        statusText(){
            let text = "";
            if(this.status === 1){
                text = "认证成功"
            }else if(this.status === 2){
                text = "认证失败"
            }else if(this.status === 3){
                text = "认证中"
            }
            return text
        }
    },
    components:{
        StepHeader,SnButton
    },
    methods:{
        /**
         * 数据初始化
         */
        init(){
            let _this = this;
            if(!!orderNo){
                _this.cardData = getBusinessData(orderNo);
                if(!_this.cardData){
                    _this.cardData = getLocalData(orderNo);
                    let loginData = getLocalData(_this.cardData.phone);
                    if(!!loginData){
                        setBusinessData(_this.cardData.phone,loginData);
                    }
                }
            }
            let param = {
                UAId:_this.cardData.UAId,
                orderNo:orderNo,
                faceId:h5faceId,
                ticket:'aass',
                phone:_this.cardData.phone,
                profession:_this.cardData.profession,
                imageFontFileId:_this.cardData.imageFontFileId,
                imageBackFileId:_this.cardData.imageBackFileId,
            }
            getServerDataH5(textUrl+'/SSP-HTTP/userTencent.certification',param,'GET').then(result => {
                if(result.code===0){
                    let data = result;
                    _this.status = data.status;
                    _this.uaid = data.UAId

                    deleteLocalData(orderNo);
                    deleteLocalData(_this.cardData.phone);
                    let loginData = getBusinessData(_this.cardData.phone);
                    if(!!loginData&&!loginData.lgParam){
                        loginData.UAId=data.UAId;
                        loginData.token=data.token;
                        loginData.lgParam=data.lgParam;
                        loginData.ssoParam=data.ssoParam;
                        setBusinessData(_this.cardData.phone,loginData);
                    }
                }else{
                    _this.status = 2;
                    if(!!result.desc){
                        _this.desc = result.desc;
                    }
                }
            })
        },
        /**
         * 完成
         */
        nextStep(){
            let _this = this;
            _this.id = getLocalData('ticketid')
            if(getLocalData('ticket')==1){
                deleteLocalStorage('ticket')
                deleteLocalStorage('ticketid')
                // window.open(`ticketshop.html#/buyconfirm?phone=${_this.cardData.phone}&ticketId=${_this.id}`);
                window.location.href = `ticketshop.html?phone=${_this.cardData.phone}#/buyconfirm?ticketId=${_this.id}`;
            }else{
                // openRouterByValue("finance",{phone:_this.cardData.phone,listType:2},_this);
                 window.location.href = `home.html?phone=${_this.cardData.phone}#/index`
            }
        },
        /**
         * 后续操作
         */
        nextStep3(){
            let _this = this;
            // openPage(`openaccount.html#/identifystep3?identify=1`);
            _this.checkOpenAccount('openaccount.html#/')
        },
        async checkOpenAccount(url){
            let _this = this;
            let param = {
                phone:_this.cardData.phone
            }
            try {
                    //Ⅱ类开户要先判断是否认证
                    const result = await getServerDataH5(textUrl+'/yqt/user/user.queryCertificationInfo',param,'POST');
                    if(result.code === 0){
                        if(result.status === 1){//认证成功
                            //Ⅱ类户开通权限校验(开通的数量有限制)
                            _this.showLoading = true;
                            const checkdata = await getServerDataH5(textUrl+'/yqt/accountMgr/accountMgr.openAccountAuthForH5',param,'POST');
                            _this.showLoading = false;
                            if(checkdata.code === 0){
                                if(checkdata.status === 1){
                                    const newResult = await getServerDataH5(textUrl+'/yqt/accountMgr/accountMgr.uploadInfoAndSign', param,'POST');
                                    if(newResult.code === 0){
                                        let data = newResult;
                                        if(!!data.orderNo){
                                            data['UAId'] =  _this.uaid;
                                            data['phone'] = _this.cardData.phone;
                                            data['name'] = result.name;
                                            setBusinessData(data.orderNo,data);

                                            openRouterByValue("identifystep3",{identify:1,name:result.name,orderNo:encodeURIComponent(data.orderNo)},_this);
                                            // window.open(`${url}identifystep3?identify=1&name=${result.name}&orderNo=`+data.orderNo);
                                        }
                                    }else{
                                        showToast(newResult.desc);
                                    }
                                    // openPage(`${url}identifystep3?identify=1&name=${result.name}`);
                                }else if(checkdata.status === 2){
                                    _this.showconfirm("已开通Ⅱ类户，无法重复开通",null,function(){
                                        // window.close(); 
                                    },"","确定",false);
                                }
                            }else{
                                showToast(checkdata.desc);
                            }
                        }else if(result.status === 2){//未认证
                            _this.showconfirm("开通Ⅱ类户需要实名认证，请认证后再开通",function(){
                                // window.close(); 
                            },function(){
                                openRouterByValue("identifystep1",{phone:phone},_this);
                                // window.open(`${url}identifystep1?ticket=1&phone=`+phone);
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
                            openRouterByValue("identifystep1",{phone:phone},_this);
                            // window.open(`${url}identifystep1?ticket=1&phone=`+phone);
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
    }
</style>
