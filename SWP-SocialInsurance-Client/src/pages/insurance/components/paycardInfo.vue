<template>
    <div class="query-main">
        <div class="person-info">
            <SnNumber
                title="银行卡号"
                text-align="left"
                v-model="content.payAccountCode"
                placeholder="请输入银行卡号"
                :minlength="1"
                :maxlength="19"
            ></SnNumber>
            <SnText
                title="户名"
                text-align="left"
                :maxlength="30"
                placeholder="请输入户名"
                v-model="content.payAccountName"
            ></SnText>
            <!-- <SnCell title="支付密码" value-align="left" title-width="2.2rem">
                <span class="cursor" id="pwdCursor"></span>
                <input
                    class="form_line_input"
                    type="tel" 
                    style="-webkit-text-security:disc"
                    placeholder="请输入支付密码"
                    v-model="content.password"
                    maxlength="6"
                    ref="pwd"
                    id="pwd"
                />
            </SnCell> -->
        </div>
        <!-- <div class="person-info">
            <div class="sn-text">
                <div class="agreement">
                    <i :class="agree?'agree_pre':'agree_nor'" @click="agree=!agree"></i>
                    <span class="agree-text">同意</span>
                    <a class="sn-pointer" @click="openProtocol">《银行卡使用协议》</a>
                </div>
            </div>
        </div> -->

        <div class="next-btn">
            <SnButton :showLoading="loadingFlag" @SnButtonClick="nextStep">下一步</SnButton>
        </div>

    </div>
</template>

<script>
import { throttle, showToast } from 'sslib/common/extend'
// import {initInput} from "sslib/common/cfcaKey.js";
import {getEncryptPassword,openNativePage,getServerData,getBusinessData,openRouterByValue,getServerDataH5 } from '../../handler/handler'
import { SnText,SnNumber } from 'biscomponents'
import { SnButton,SnCell} from 'components'

export default {
    data(){
        return{
            idNum:"",
            agree: false,
            subTitle: ['支付信息'],
            content:{},
            joinInfo:{},
            loadingFlag: false,
            random:'123',
        }
    },
    components:{
        SnButton,SnText,SnNumber,SnCell
    },
    created(){
        let _this = this;
        _this.init();
    },
    mounted(){
        let _this = this;
        
        // initInput('pwd', _this.random);
        // let param = {
        //     phone:_this.data.phone,
        // };
        // getServerDataH5(textUrl+'/yqt/accountMgr/accountMgr.genServerRandom',param,'POST').then(result => {
        //     if (result.code===0) {
        //         _this.random = result.serverRandom;
        //         initInput('pwd', _this.random);
        //     }else{
        //         showToast(result.desc);
        //     }
        // })
    },
    methods:{
        init(){
            let _this = this;
            if(!!_this.$route.query.joinInfo){
                _this.content = JSON.parse(decodeURIComponent(_this.$route.query.joinInfo));
            }
            console.log(_this.content)
        },
        nextStep(){
            let _this = this;
            if (!_this.validate()) {
                return;
            }
            openRouterByValue("payInfo",{content:encodeURIComponent(JSON.stringify(_this.content))},_this);
        },
        validate() {
            let _this = this;
            if (!_this.content.payAccountCode) {
                showToast('请输入银行卡号');
                return false;
            }
            if (_this.content.payAccountCode.length !== 16 && _this.content.payAccountCode.length !== 19) {
                showToast('请输入正确银行卡号');
                return false;
            }
            if ('' == _this.content.payAccountName) {
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
    .step2{
        background: @color-bg;
        padding: .3rem 0;
        .step-header{
            margin: 0 .3rem .3rem .3rem;
        }
        .person-info{
            background: @color-white;
            .vux-cell-value{color: #333}
            .weui-cell{
                padding: .24rem 0 !important;
                border-bottom: 1px solid @color-bg; 
                .weui-label{
                    width: 2.2rem !important;
                }
                .vux-cell-bd{
                    .vux-label{
                        width: 2.2rem !important;
                    }
                }
            }
            .borderTip{
                height: .3rem;
                background: @color-bg;
            }
            .sn-picker{
                padding: 0 .3rem;
            }
        }
        .next-btn{
            padding: .5rem .3rem;
        }
    }
    
    .manager-name{
        display: -webkit-box;
        padding: 0 .3rem;
        height: .9rem;
        line-height: .9rem;
        border-bottom: 1px solid @color-bg; 
        .manager-name-info{
            width:2.2rem;
            color: #666;
        }
        &:after {
            content: "";
            width: .42rem;
            height: .42rem;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAQlBMVEUAAACAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIXJE8ckAAAAFnRSTlMA/r7y6KZ7bz4pHw8H38e1lYliV0wxns2HqAAAAGNJREFUOMvt00kSgCAQBEELFcR9/f9XDX5QER6lz3mAmZ6m5s/JYfQ4sHg9rXTZ60D3aD1vtIPXfdE6Pdxe73B5fcDpdYTkdYL4Hftn+A/60fml+HX7IvmK+vL7s/IHW1NT8gLVxQKJ1fadGgAAAABJRU5ErkJggg==) no-repeat 50%;
            background-size: .42rem .42rem;
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;
        }
        .gradeNum{width: 61%}
    }
    .sn-price{font-size: .5rem;font-weight: bold}
    .agreement {
        display: flex;
        align-items: center;
        padding: .24rem !important;
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
    .vux-cell-value{color: #333}
    .weui-cell:before {border-top: 0}
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
        padding: .24rem !important;
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
