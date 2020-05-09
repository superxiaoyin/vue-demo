<template>
    <div class="step1">
        <step-header :step="1"></step-header>
        <div class="idcard">
            <label class="idcard-title">拍摄/上传您的二代身份证</label>
            <img ref="front" src="../../../resource/img/openaccount/icon_idcard_front.png" class="idcard-front" @click="getFrontPhoto"/>
            <img ref="back" src="../../../resource/img/openaccount/icon_idcard_back.png" class="idcard-back" @click="getBackPhoto"/>
        </div>
        <SnButton type="bottom" :showLoading="loadingFlag" @SnButtonClickBottom="nextStep">下一步</SnButton>
    </div>
</template>
<script>
import { openRouterByValue,openNativePage,setBusinessData } from '../../handler/handler'
import StepHeader from './stepheader'
import { SnButton } from 'components'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { throttle, goBackPage, initTitleMenu, showToast } from 'sslib/common/extend'
export default {
    data(){
        return{
            subTitle:['实名认证'],
            backFlag: false,
            frontFlag: false,
            loadingFlag: false,
            frontPath: '',
            backPath: ''
        }
    },
    components:{
        StepHeader,SnButton
    },
    created(){
        let _this = this;
        initTitleMenu(_this.subTitle);
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
        },
        /**
         * 下一步
         */
        async nextStep(){
            let _this = this;
            if(!_this.frontFlag){
                showToast('请点击拍摄身份证正面','middle');
                return;
            }else if(!_this.backFlag){
                showToast('请点击拍摄身份证反面','middle');
                return;
            }
            //1.传正反面图片进行ocr扫描 2.跳转个人信息页面
            try {
                _this.loadingFlag = true;
                const ocrData = await openNativePage("IntentAction_TfdIdentify",[{key:"ocr",value:1,type:"string"},{key:"front",value: _this.frontPath,type:"string"},{key:"back",value: _this.backPath,type:"string"}],[{type:"string", value: "", key: "ocr_info"}]); 
                _this.loadingFlag = false;
                if(!!ocrData[0].value){
                    openRouterByValue("identifystep2",{cardInfo:encodeURIComponent(ocrData[0].value)},_this);
                }
            } catch (error) {
                _this.loadingFlag = false;
                console.log(error);
            }
        },
        /**
         * 获取身份证正面照片
         */
        async getFrontPhoto(){
            let _this = this;
            try {
                _this.frontFlag = false;
                const frontData = await openNativePage("IntentAction_TfdIdentify",[{key:"ocr_takephoto_type",value:"1",type:"string"},{key:"ocr_photo_position",value:"1",type:"string"}],[{type:"string", value: "", key: "front_photo"}]);
                if(!!frontData[0].value){
                    _this.frontFlag = true;
                    _this.$refs.front.src = JSON.parse(frontData[0].value).photoBase64;
                    _this.frontPath = JSON.parse(frontData[0].value).photoPath;
                    setBusinessData("frontPath", _this.frontPath);
                }
            } catch (error) {
                console.log(error)
            }
        },
        /**
         * 获取身份证反面照片
         */
        async getBackPhoto(){
            let _this = this;
            try {
                _this.backFlag = false;
                const backData = await openNativePage("IntentAction_TfdIdentify",[{key:"ocr_takephoto_type",value:"1",type:"string"},{key:"ocr_photo_position",value:"2",type:"string"}],[{type:"string", value: "", key: "back_photo"}]);
                if(!!backData[0].value){
                    _this.backFlag = true;
                    _this.$refs.back.src = JSON.parse(backData[0].value).photoBase64;
                    _this.backPath = JSON.parse(backData[0].value).photoPath;
                    setBusinessData("backPath", _this.backPath);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .step1{
        background: @color-bg;
        padding: .3rem; 
        .idcard{
            padding: .56rem .3rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            .idcard-title{
                font-size: @fs-mob-small;
                color: @fc-info;
                text-align: center;
            }
            .idcard-front,.idcard-back{
                display: block;
                width: 100%;
                height: 3.2rem;
                margin-top: .4rem;
                border-radius: .1rem;
            }
        }
    }
</style>
