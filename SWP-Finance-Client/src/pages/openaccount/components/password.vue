<template>
    <div class="password">
        <div class="textTips">请绑定您的同名1类账号</div>
        <div class="password-input">
            <SnCell title="新密码" value-align="left">
                <input
                    class="form_line_input"
                    type="tel" 
                    @input="onInput('password')"
                    style="-webkit-text-security:disc"
                    placeholder="请输入新密码"
                    v-model="content.password"
                    maxlength="6"
                />
            </SnCell>
            <SnCell title="确认新密码" value-align="left">
                <input
                    class="form_line_input"
                    type="tel" 
                    @input="onInput('newpassword')"
                    style="-webkit-text-security:disc"
                    placeholder="请再次输入新密码"
                    v-model="content.newpassword"
                    maxlength="6"
                />
            </SnCell>
        </div>
        <SnButton :showLoading="loadingFlag" @SnButtonClick="submit">提交</SnButton>
    </div>
</template>
<script>
import { getEncryptPassword,openNativePage,getServerData,getBusinessData,openRouterByValue } from '../../handler/handler'
import { SnButton,SnCell } from 'components'
import { showToast } from 'sslib/common/extend';
export default {
    data(){
        return{
            content:{},
            data:{},
            loadingFlag: false,
        }
    },
    components:{
        SnCell,SnButton
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
            if(!!_this.$route.query.data){
                _this.data = JSON.parse(decodeURIComponent(_this.$route.query.data));
            }
        },
        /**
         * 数据校验
         */
        validate(){
            let _this = this;
            if(!_this.content.password){
                showToast('请输入密码','middle');
                return false;
            }else if(!_this.content.newpassword){
                showToast('请再次输入新密码','middle');
                return false;
            }else if((_this.content.password+'').length!=6){
                showToast('请输入六位数密码','middle');
                return false;
            }else if(_this.content.password !== _this.content.newpassword){
                showToast('两次密码不一致，请重新输入','middle');
                return false;
            }
            return true;
        },
        /**
         * 开户数据提交
         */
        async submit(){
            let _this = this;
            if(!_this.validate()){
                return;
            }
            try {
                const password = await getEncryptPassword({password:_this.content.password,type:1});
                if(!!password.data){
                    _this.data.pwd = password.data;
                    if(!!getBusinessData("livePath")){
                        const uploadData = await openNativePage("IntentAction_TfdIdentify",[{key:"ocr_upload",value:"1",type:"string"},{key:"live",value:getBusinessData("livePath"),type:"string"}],[{type:"string", value: "", key: "upload_info"}]); 
                        if(!!uploadData[0].value){
                            _this.data.modeData = { realTimePictureId: JSON.parse(uploadData[0].value).live };
                            _this.loadingFlag = true;
                            const result = await getServerData('accountMgr/accountMgr.openAccount', _this.data,false);
                            _this.loadingFlag = false;
                            if(result.code === 0){
                                openRouterByValue('result',{result:encodeURIComponent(JSON.stringify({status:1,text:'开户成功',desc:'您可以使用Ⅱ类账户进行支付'}))},_this);
                            }else{
                                openRouterByValue('result',{result:encodeURIComponent(JSON.stringify({status:0,text:'开户失败',desc:result.desc}))},_this);
                            }
                        }else{
                            showToast("上传图片失败，请重试");
                        } 
                    } 
                }             
            } catch (error) {
                _this.loadingFlag = false;
                console.log(error);
            }
        },
        onInput (key) {
            let _this = this;
            let temp = _this.content[key].split("").filter( (item,index) => {
                return /^[0-9]*$/.test(item);
            }).join("");
            _this.content[key] = temp;
            }
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
</style>
