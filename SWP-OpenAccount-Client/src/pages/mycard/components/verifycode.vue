<template>
    <div class="verify-code">
        <div class="verify-title">{{`验证码已发送至：${cardData.phone}`}}</div>
        <SnVerifyCode
            ref="verifyCode"
            title="验证码"
            :maxlength="6"
            text-align="left"
            :phone-num="cardData.phone"
            @getending="getendingfun"
            v-model="vCode"
            placeholder="请输入验证码"
        ></SnVerifyCode>            
        <div class="agreement">
            <i :class="agree?'agree_pre':'agree_nor'" @click="agree=!agree"></i>
            <span class="agree-text">同意<a class="sn-pointer" @click="openProtocol">《银行卡使用协议》</a></span>               
        </div>
        <SnButton v-if="agree" :showLoading="loadingFlag" @SnButtonClick="submitBind">确定</SnButton>
        <SnButton v-else-if="!agree" class="btn-grey">确定</SnButton>
    </div>
</template>
<script>
import { openRouterByValue,backRouterByValue, getServerData,cardError,getServerDataH5 } from '../../handler/handler'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { throttle, initTitleMenu, showToast } from 'sslib/common/extend'
import { SnVerifyCode } from 'biscomponents'
import { SnButton } from 'components'
export default {
    data(){
        return{
            cardData: {}, //Ⅰ类户数据
            superCardData: {}, //Ⅱ类户数据
            loadingFlag: false,
            agree: true,
            vCode: '',
            phone:'',
            vType:114
        }
    },
    components:{
        SnVerifyCode,SnButton
    },
    created(){
        let _this = this;
        initTitleMenu(['验证']);
        _this.init();
    },
    mounted(){
        let _this = this;
        if(!_this.$route.query.backFlag){
            _this.$refs.verifyCode.sendVerifyCode();//发送验证码
        }
    },
    methods:{
        /**
         * 数据初始化
         */
        init(){
            let _this = this;
            if(!!_this.$route.query.phone){
                _this.phone = _this.$route.query.phone;
            }
            if(!!_this.$route.query.vCode){
                _this.vCode = _this.$route.query.vCode;
            }
            if(!!_this.$route.query.addData){//加挂
                _this.vtype = 114;
                _this.cardData = JSON.parse(decodeURIComponent(_this.$route.query.addData)).cardData;
                _this.superCardData = JSON.parse(decodeURIComponent(_this.$route.query.addData)).superCardData;
            }else if(!!_this.$route.query.unbindData){//解绑
                _this.vtype = 115;
                _this.cardData = JSON.parse(decodeURIComponent(_this.$route.query.unbindData)).cardData;
                _this.superCardData = JSON.parse(decodeURIComponent(_this.$route.query.unbindData)).superCardData;
            }
        },
        /**
         * 提交绑定
         */
        submitBind(){
            let _this = this;
            if(!_this.vCode&&_this.vCode.length !== 6){
                showToast('请输入正确的验证码');
                return;
            }
            if(!!_this.$route.query.addData){//加挂
                _this.bindFirstCard();
            }else if(!!_this.$route.query.unbindData){//解绑
                _this.untyingFirstCard();
            }
        },
        /**
         * 加挂Ⅰ类账户
         */
        async bindFirstCard(){
            let _this = this;
            const bindData = {
                account: _this.cardData.cardNumber,
                superAccount: _this.superCardData.cardNumber,
                telphone: _this.cardData.phone,
                accountName: _this.superCardData.cardName,
                vCode: _this.vCode,
                phone:_this.phone
            }
            try {
                _this.loadingFlag = true;
                const bindResult = await getServerDataH5(textUrl+'/yqt/accountMgr/accountMgr.bindFirstCard',bindData);
                _this.loadingFlag = false;
                let data = {
                    backRouter: {name:'supercardlist',data: _this.cardData}
                }
                if(bindResult.code === 0 && bindResult.status === 1){//成功
                    data.status = 1;
                    data.text = '加挂成功';
                }else{
                    data.status = 0;
                    data.text = '加挂失败';
                    data.desc = bindResult.desc;
               } 
                openRouterByValue('result',{result:encodeURIComponent(JSON.stringify(data)),phone:_this.phone},_this);
            } catch (error) {
                _this.loadingFlag = false;
                console.log(error);
            }
        },
        /**
         * 解绑Ⅰ类账户
         */
        async untyingFirstCard(){
            let _this = this;
            const untyingData = {
                account: _this.cardData.cardNumber,
                superAccount: _this.superCardData.accountNo,
                telphone: _this.cardData.phone,
                vCode: _this.vCode,
                phone:_this.phone
            }
            try {
                _this.loadingFlag = true;
                const untyingResult = await getServerDataH5(textUrl+'/yqt/accountMgr/accountMgr.untyingFirstCard',untyingData);
                _this.loadingFlag = false;
                let data = {};
                if(untyingResult.code === 0 && untyingResult.status === 1){//成功
                    data.status = 1;
                    data.text = '解绑成功';
                    data.backRouter = {name:'supercardlist',data: _this.cardData};
                }else{   
                    data.status = 0;
                    data.text = '解绑失败';
                    data.desc = untyingResult.desc;
                }
                openRouterByValue('result',{result:encodeURIComponent(JSON.stringify(data)),phone:_this.phone},_this);
            } catch (error) {
                _this.loadingFlag = false;
                console.log(error);
            }
        },
        /**
         * 获取验证码
         */
        getendingfun(data) {
            let _this = this;
            if (data) {
                getServerDataH5(textUrl+'/SSP-HTTP/user.getVerifyCode',{userPhone :_this.cardData.phone,vType:_this.vtype},'GET').then(res => {
                    if (res.code ===0) {
                        _this.verifyCodeFlag = true;
                    }else{
                        showToast(res.desc);
                    }
                })
            }
        },
        /**
         * 打开协议
         */
        openProtocol(){
            let _this = this;
            _this.$route.query.vCode = _this.vCode;
            openRouterByValue("protocol",_this.$route.query,_this);
        }
    }
}
</script>
<style lang="less">
    @import '~components/style/common.less';
    .verify-code{
        background: @color-bg;
        .verify-title{
            color: @fc-info;
            font-size: @fs-mob-small;
            padding: .3rem .3rem .15rem .3rem;
        }
        .agreement {
            display: flex;
            align-items: center;
            margin: 0.3rem;
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
        .btn-grey button{
            background-color: @color-disable;
            &:hover{
                background-color: @color-disable;
            }
        }

        .snVerifyCode{
            background: @color-white;
            .button-detail{
                background: none !important;
                border-radius: .3rem !important;
                border: 1px solid @color-blue;
                color: @color-blue !important;                
            }

        }
    }
</style>
