<template>
    <div class="query-main">
         <div class="person-info">
        
            <cell class="sn-text" title="账号卡号" :value="joinInfo.payAccountCode"></cell>
            <cell class="sn-text" title="户名" :value="joinInfo.payAccountName"></cell>
            <cell class="sn-text" title="缴费金额" :value="joinInfo.payMoney"></cell>
            <SnCell title="支付密码" value-align="left" title-width="2.2rem">
                <span class="cursor" id="pwdCursor"></span>
                <input
                    class="form_line_input"
                    type="tel" 
                    style="-webkit-text-security:disc"
                    placeholder="请输入支付密码"
                    v-model="joinInfo.password"
                    maxlength="6"
                    ref="pwd"
                    id="pwd"
                />
            </SnCell>
        </div>
        <div class="next-btn">
            <SnButton :showLoading="loadingFlag" @SnButtonClick="submit">确认缴费</SnButton>
        </div>
    </div>
</template>
<script>
import {Cell} from 'vux'
import {initInput,numberKeyboard} from "sslib/common/cfcaKey.js"
import { throttle, showToast } from 'sslib/common/extend'
import { openRouterByValue, setBusinessData,getServerDataH5,getSignDataH5 } from '../../handler/handler'
import { SnButton,SnCell } from 'components'
export default {
    data(){
        return{
            idNum:"",
            PayPrice:'198.00',
            subTitle: ['信息确认'],
            joinInfo:{
                name:'201906',
                carNum:'99912',
                nickName:'99912',
                price:'城乡居民基本'
            },
            loadingFlag: false,
            random:'123',
            data:{},
        }
    },
    components:{
        SnButton,Cell,SnCell
    },
    created(){
        let _this = this;
        _this.init();
    },
    mounted(){
        let _this = this;
        // initInput('pwd', _this.random);
        getServerDataH5(textUrl+'/SSP-HTTP/socialSecurity.getServerRandom',{key:_this.joinInfo.idNum},'POST').then(result => {
            if (result.code===0) {
                _this.random = result.serverRandom;
                initInput(_this.random);
            }else{
                showToast(result.desc);
            }
        })
        
    },
    methods:{
        init(){
            let _this = this;
            if(!!_this.$route.query.content){
                _this.joinInfo = JSON.parse(decodeURIComponent(_this.$route.query.content));
                _this.data = _this.joinInfo;
            }
            console.log( _this.joinInfo)
        },
        nextStep(){
            let _this = this;
            openRouterByValue("result",{idNum:encodeURIComponent(_this.idNum)},_this);
        },
        async submit(){
            let _this = this;
            if (!_this.validate()) {
                return;
            }
            try{
                const tmpdata = {
                    traNum: _this.data.traNum,
                    payMoney: _this.data.payMoney,
                    payAccountName: _this.data.payAccountName,
                    payAccountCode: _this.data.payAccountCode
                };
                _this.data.signData = getSignDataH5(JSON.stringify(tmpdata));
                _this.loadingFlag = true;
                var errorCode = numberKeyboard.getErrorCode('pwd').toString(16);
                if(errorCode =='0'){
                    //获取密码输入框中加密后的数据
                    var encryptedInputValue = numberKeyboard.getEncryptedInputValue('pwd');
                    var randomValue = numberKeyboard.getEncryptedClientRandom('pwd');

                    console.log(encryptedInputValue)
                    console.log(randomValue)

                    if(!encryptedInputValue){
                        showToast('请输入正确的6位数密码!');
                        _this.loadingFlag = false;
                        return;
                    }
                    _this.data['payAccountPwd'] = encryptedInputValue;
                    _this.data['encryptedRc'] = randomValue;
                    const result = await getServerDataH5(textUrl+'/SSP-HTTP/socialSecurity.socialSecurityPay', _this.data,'POST');
                    _this.loadingFlag = false;
                    if(result.code === 0){
                        numberKeyboard.clearInputValue('pwd')
                        openRouterByValue('result',{result:encodeURIComponent(JSON.stringify({status:1,text:'缴费成功',desc:result.rdesc,..._this.data}))},_this);
                    }else{
                        numberKeyboard.clearInputValue('pwd')
                        openRouterByValue('result',{result:encodeURIComponent(JSON.stringify({status:0,text:'缴费失败',desc:result.rdesc,..._this.data}))},_this);
                    }          
                }else{
                    numberKeyboard.clearInputValue('pwd')
                    showToast('请输入正确的6位数密码!');
                    _this.loadingFlag = false;
                }

            }catch(err){
                numberKeyboard.clearInputValue('pwd')
                _this.loadingFlag = false;
                console.log(err);
            }
            

        },
         validate() {
            let _this = this;
            if (!_this.joinInfo.payAccountCode) {
                showToast('请输入银行卡号');
                return false;
            }
            if (_this.joinInfo.payAccountCode.length !== 16 && _this.joinInfo.payAccountCode.length !== 19) {
                showToast('请输入正确银行卡号');
                return false;
            }
            if ('' == _this.joinInfo.payAccountName) {
                showToast('请输入户名');
                return false;
            }
            return true;
        },
    },
}
</script>
<style lang="less">
    @import '~components/style/common.less';
    .vux-label{width: 4rem !important}
</style>
