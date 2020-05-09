<template>
    <div class="step3">
        <step-header v-if="!identifyState" class="step-header" :step="3"></step-header>
        <div class="face-identify" @click="faceIdentify">
            <div class="face">
                <i class="face-icon"></i>
                <span>人脸采集</span>                
            </div>
            <div class="identify">
                <span class="identify-title" :class="{'success':collectState}">{{collectState?"已采集":"未采集"}}</span>
                <i class="right-icon"></i>             
            </div>
        </div>
        <SnButton type="bottom" :showLoading="loadingFlag" @SnButtonClickBottom="nextStep">下一步</SnButton>
    </div>
</template>
<script>
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { openRouterByValue,openNativePage,getBusinessData, setBusinessData, getServerData } from '../../handler/handler'
import StepHeader from './stepheader'
import { SnButton } from 'components'
import { getUrlParams, initTitleMenu, openPage, showToast, goBackPage, throttle } from 'sslib/common/extend'
let urlParams = getUrlParams();
let identify = Number(urlParams.identify || 0);
let name = urlParams.name || "";
export default {
    data(){
        return{
            identifyState: identify,
            collectState: 0,
            livePhoto: '',
            loadingFlag: false
        }
    },
    components:{
        StepHeader,SnButton
    },
    created(){
        let _this = this;
        _this.init();
    },
    methods:{
        /**
         * 数据初始化
         */
        init(){
            let _this = this;
            notifyAppBackEvent(); //调用app，通知返回事件
            registerHandler('notifyAppBack', function (data) {//点击app返回事件
                throttle(function () {
                    goBackPage('sswbv_close_browser');                   
                }.bind(this));
            });
            if(_this.identifyState){
                initTitleMenu(['2类开户']);
            }
        },
        /**
         * 活体检测
         */
        async faceIdentify(){
            let _this = this;
            try {
                const faceData = await openNativePage("IntentAction_TfdIdentify",[{key:"ocr_live",value:"1",type:"string"},{key:"action_count",value:"3",type:"string"}],[{type:"string", value: "", key: "live_info"}]); 
                if(!!faceData[0].value){
                    _this.collectState = 1;
                    _this.livePath = JSON.parse(faceData[0].value).photoPath;
                    setBusinessData("livePath",_this.livePath);
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * 下一步
         */
        async nextStep(){
            let _this = this;
            if(!_this.collectState){
                showToast("请点击人脸采集进行人脸识别","middle");
                return;
            }
            if(_this.identifyState){//开户
                openRouterByValue("open",{name: name},_this);
            }else{//实名认证
                if(!!_this.livePath&&!!getBusinessData("frontPath")&&!!getBusinessData("backPath")){
                    const uploadData = await openNativePage("IntentAction_TfdIdentify",[{key:"ocr_upload",value:"1",type:"string"},{key:"front",value: getBusinessData("frontPath"),type:"string"},{key:"back",value: getBusinessData("backPath"),type:"string"},{key:"live",value:_this.livePath,type:"string"}],[{type:"string", value: "", key: "upload_info"}]); 
                    if(!!uploadData[0].value){
                        _this.certification(JSON.parse(uploadData[0].value));
                    }else{
                        showToast("上传图片失败,请重新认证","middle");
                    }
                }else{
                    showToast("上传图片失败,请重新认证","middle");
                }
            }
        },
        /**
         * 实名认证
         */
        async certification(fileData){
            let _this = this;
            const data = {
                certType: 1,
                certInfo:{
                    realTimePictureId: fileData.live,
                    fontSidePictureId: fileData.front,
                    backsidePictureId: fileData.back,
                    idType: 1
                }
            }
            if(!!getBusinessData("cardInfo")){
                data.certInfo.personInfo = getBusinessData("cardInfo");
            }
            try {
                _this.loadingFlag = true;
                const certificationData = await getServerData("user/user.certification",data);
                _this.loadingFlag = false;
                if(certificationData.code === 0){
                    openRouterByValue("identifystep4",{status:certificationData.status},_this);
                }
            } catch (error) {
                _this.loadingFlag = false;
                console.log(error);
            }
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .step3{
        background: @color-bg;
        padding: .3rem 0;
        .step-header{
            margin: 0 .3rem .3rem .3rem;
        }
        .face-identify{
            background: @color-white;
            padding: .9rem .45rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .face{
                display: inline-flex;
                align-items: center;
                .face-icon{
                    display: inline-block;
                    width: 1.04rem;
                    height: 1.04rem;
                    background: url('../../../resource/img/openaccount/icon_face.png') no-repeat center;
                    background-size: 1.04rem 1.04rem;
                    margin-right: .3rem;
                }                
            }
            .identify{
                display: inline-flex;
                align-items: center;
                .identify-title{
                    color: @fc-info;
                    font-size: @fs-mob-small;
                }
                .success{
                    color: #20BD2A;
                }
                .right-icon{
                    display: inline-block;
                    height: .44rem;
                    width: .44rem;
                    background: url('../../../resource/img/icon_narrow_right.png') no-repeat center;
                    background-size: .44rem .44rem;
                }
            }

        }
    }
</style>
