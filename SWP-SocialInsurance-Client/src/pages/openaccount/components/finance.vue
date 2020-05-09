<template>
  <div>
    <div class="templet-list">
        <div class="templet-item" @click="checkOpenAccount('openaccount.html#/')">
            <img class="icon" src="../../../resource/img/23account.png" alt="">
            <div>开户</div>
        </div>
        <div class="templet-item" @click="openIdentifyPage()">
            <img class="icon" src="../../../resource/img/23account.png" alt="">
            <div>认证</div>
        </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { appList,getServerData,setBusinessData,getBusinessData,deleteBusinessData,formatProduct,openNativePage, openRouterByValue,setLocalData,getLocalData,getServerDataH5} from '../../handler/handler'
import { SnLoading,SnEmpty } from 'components'
import { LoadingPage } from '../../baseComponents'
import common from "sslib/common/common.js";
import { registerHandler, notifyAppBackEvent, ReloadPageFunction, GetUserInfoFunction } from 'sslib/common/SnJsBridge'
import { throttle, openPage, showConfirm, showToast, getUrlParams, openLonginPage, goBackPage } from 'sslib/common/extend'
import  { ConfirmPlugin } from 'vux'
Vue.use(ConfirmPlugin)
var urlParams = getUrlParams();
var phone = urlParams.phone;
export default {
    data(){
        return{
            moneyFlag: true,
            totalBalance: 0,
            appList:appList,
            productList:[],
            noInfo:false,
            showLoading:false,
            uaId:'',
            videoWidth: 540,      
            videoHeight: 410,      
            imgSrc: '',      
            thisCancas: null,      
            thisContext: null,      
            thisVideo: null,      
            validTip: '验证中',
            tokenData:{},
            frontFileId:'',
            backFileId:'',
            loginData:{},

        }
    },
    components:{
        SnLoading,SnEmpty,LoadingPage
    },
    mounted:function(){//组件渲染生成dom
        var _this = this;
    },
    created(){
        let _this = this;
        _this.init();
        // let url = 'openaccount.html#/';
        // _this.checkOpenAccount(url);
    },
    methods:{
        /**
         * 初始化
         */
        init(){
            let _this = this;
            if(!!_this.$route.query.phone){
                _this.loginData = getBusinessData(_this.$route.query.phone);
                phone = _this.$route.query.phone;
            }else if(!!phone){
                _this.loginData = getBusinessData(phone);
            }
        },
        /**
         * 打开认证页面
         */
        openIdentifyPage(){
            let _this = this;
            getServerDataH5(textUrl+'/yqt/user/user.queryCertificationByPhone',{phone:phone},'GET').then(result => {
                if(result.code===0){
                    let data = result;
                    if(data.status==1){
                        showToast('该用户已认证');
                    }else if(data.status==2){
                        openRouterByValue("identifystep1",{phone:phone},_this);
                    }
                }else{
                    showToast(result.desc);
                }
            },rej=>{
                _this.loadingFlag = false;
            })
            // const result = await getServerDataH5(textUrl+'/yqt/user/user.queryCertificationInfo',param,'POST');
            
            // window.open('openaccount.html#/identifystep1?phone='+phone);
            
        },
        /**
         * 使用vux弹框组件
         */
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
        /**
         * 检查2类开户条件
         */
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
                            _this.showLoading = false;
                            if(checkdata.code === 0){
                                if(checkdata.status === 1){
                                    const newResult = await getServerDataH5(textUrl+'/yqt/accountMgr/accountMgr.uploadInfoAndSign', param,'POST');
                                    if(newResult.code === 0){
                                        let data = newResult;
                                        if(!!data.orderNo){
                                            data['UAId'] = _this.loginData.UAId;
                                            data['phone'] = phone;
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
                                // window.open(`${url}identifystep1?phone=`+phone);
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
                            // window.open(`${url}identifystep1?phone=`+phone);
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
    },
}
</script>
<style lang="less">
@import "~components/style/common.less";
.templet-list{
    display: flex;
    flex-wrap: wrap;
    border-bottom: .3rem solid @color-bg;
    padding: 0 .3rem;
    .templet-item{
        width: 25%;
        text-align: center;
        margin-bottom: .5rem;
        font-size: .28rem;
        .icon{
            display: block;
            height: .72rem;
            width: .72rem;
            margin-left: auto;
            margin-right: auto;
        }
    }
}
</style>
