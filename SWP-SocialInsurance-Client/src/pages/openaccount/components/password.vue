<template>
    <div class="password">
        <div class="textTips">设置密码</div>
        <div class="password-input">
            <SnCell title="新密码" value-align="left">
                <span class="cursor" id="psdCursor"></span>
                <input
                    class="form_line_input"
                    type="tel" 
                    style="-webkit-text-security:disc"
                    placeholder="请输入新密码"
                    v-model="content.password"
                    maxlength="6"
                    ref="psd"
                    id="psd"
                />
            </SnCell>
            <SnCell title="确认新密码" value-align="left">
                <span class="cursor" id="repsdCursor"></span>
                <input
                    class="form_line_input"
                    type="tel" 
                    style="-webkit-text-security:disc"
                    placeholder="请再次输入新密码"
                    v-model="content.newpassword"
                    maxlength="6"
                    ref="repsd"
                    id="repsd"
                />
            </SnCell>
        </div>
        <SnButton :showLoading="loadingFlag" @SnButtonClick="submit">提交</SnButton>
    </div>
</template>
<script type="text/javascript" src="../thirdparty/cfcasip.min.js"></script>
<script>
import { getEncryptPassword,openNativePage,getServerData,getBusinessData,openRouterByValue,getServerDataH5,deleteLocalData } from '../../handler/handler'
import { SnButton,SnCell } from 'components'
import { showToast } from 'sslib/common/extend';
import {initInput,numberKeyboard} from "sslib/common/cfcaKey.js";
export default {
    data(){
        return{
            content:{},
            data:{},
            loadingFlag: false,
            random:'',
        }
    },
    components:{
        SnCell,SnButton
    },
    created(){
        let _this = this;
        _this.init();
    },
    mounted(){
        let _this = this;
        let param = {
            phone:_this.data.phone,
        };
        getServerDataH5(textUrl+'/yqt/accountMgr/accountMgr.genServerRandom',param,'POST').then(result => {
            if (result.code===0) {
                _this.random = result.serverRandom;
                initInput(_this.random);
            }else{
                showToast(result.desc);
            }
        })
    },
    methods:{
        /**
         * 数据初始化
         */
        init(){
            let _this = this;
            if(!!_this.$route.query.data){
                _this.data = JSON.parse(decodeURIComponent(_this.$route.query.data));
            }
        },
        
        /**
         * 开户数据提交
         */
        async submit(){
            let _this = this;
            try {
                _this.loadingFlag = true;
                if (!numberKeyboard.checkInputValueMatch('psd', 'repsd')) {
                    showToast('两次输入密码不一致!');
                    //清空密码框
                    numberKeyboard.clearInputValue('psd');
                    numberKeyboard.clearInputValue('repsd');
                    _this.loadingFlag = false;
                    return;
                }
                //获取错误码，0表示成功
                var errorCode = numberKeyboard.getErrorCode('psd').toString(16);
                if(errorCode =='0'){
                    //获取密码输入框中加密后的数据
                    var encryptedInputValue = numberKeyboard.getEncryptedInputValue('psd');
                    var randomValue = numberKeyboard.getEncryptedClientRandom('psd');
                    if(!encryptedInputValue){
                        showToast('请输入正确的6位数密码!');
                        _this.loadingFlag = false;
                        return;
                    }
                    _this.data['pwd'] = encryptedInputValue;
                    _this.data['encryptedRc'] = randomValue;
                    const result = await getServerDataH5(textUrl+'/yqt/accountMgr/accountMgr.openAccountForH5', _this.data,'POST');
                    _this.loadingFlag = false;
                    deleteLocalData(_this.data.orderNo);
                    deleteLocalData(_this.data.phone);
                    if(result.code === 0){
                        let subAccount = result.subAccount;
                        openRouterByValue('result',{result:encodeURIComponent(JSON.stringify({status:1,text:'开户成功',desc:'您可以使用Ⅱ类账户'+ subAccount +'进行支付'})),phone:_this.data.phone},_this);
                    }else{
                        openRouterByValue('result',{result:encodeURIComponent(JSON.stringify({status:0,text:'开户失败',desc:result.desc})),phone:_this.data.phone},_this);
                    }             
                }else{
                    showToast('请输入正确的6位数密码!');
                    _this.loadingFlag = false;
                }
            } catch (error) {
                _this.loadingFlag = false;
                console.log(error);
            }
        },
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .password-input{
        background: @color-white;
    }
    .textTips {
        padding-left: 0.3rem;
        font-size: 0.28rem;
        background: @color-bg;
        color: @fc-info;
        height: 0.6rem;
        line-height: 0.6rem;
    }
    .sn-cell{
        border-bottom: 1px solid @color-bg;
        padding: .24rem .3rem !important;
    }
    .sn-cell:before{
        border: none !important;
    }
    .form_line_input {
        display: inline-block;
        text-align: left;
        border: none;
        background: none;
        .flex(1);
    }
    .cursor {
        position: absolute;
        margin-top: -3px;
        margin-left: 0px;
        width: 2px;
        height: 24px;
        display: none;
        z-index: 1000;
    }
</style>
