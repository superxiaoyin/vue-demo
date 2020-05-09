<template>
    <div class="step2">
        <step-header class="step-header" :step="2"></step-header>
        <div class="person-info">
            <SnText
                class="sn-text"
                title="姓名"
                readonly
                text-align="left"
                :maxlength="30"
                placeholder="请输入真实姓名"
                v-model="cardInfo.name"
            ></SnText>
            <SnText
                class="sn-text"
                title="性别"
                readonly
                text-align="left"
                :maxlength="1"
                placeholder="请输入性别"
                v-model="cardInfo.sex"
            ></SnText>
            <SnText
                class="sn-text"
                title="民族"
                readonly
                text-align="left"
                :maxlength="30"
                placeholder="请输入民族"
                v-model="cardInfo.nation"
            ></SnText>
            <SnText
                class="sn-text"
                title="国籍"
                readonly
                text-align="left"
                :maxlength="30"
                placeholder="请输入国籍"
                v-model="cardInfo.nationality"
            ></SnText>
            <SnText
                class="sn-text"
                title="生日"
                readonly
                text-align="left"
                :maxlength="1"
                placeholder="请输入生日"
                v-model="cardInfo.birthday"
            ></SnText>
            <div class="borderTip"></div>
            <SnText
                class="sn-text"
                title="证件类型"
                readonly
                text-align="left"
                :maxlength="30"
                placeholder="请输入证件类型"
                v-model="cardType"
            ></SnText>
            <SnIDCard
                class="sn-text"
                title="证件号码"
                readonly
                placeholder="请输入身份证号码"
                text-align="left"
                :maxlength="18"
                v-model="cardInfo.idNo"
            ></SnIDCard>
            <SnText
                class="sn-text"
                title="证件有效期"
                readonly
                text-align="left"
                :maxlength="30"
                placeholder="请输入证件有效期"
                v-model="cardInfo.invalidate"
            ></SnText>
            <SnText
                class="sn-text"
                title="签发机关"
                readonly
                text-align="left"
                :maxlength="30"
                placeholder="请输入签发机关"
                v-model="cardInfo.licenceAuthority"
            ></SnText>
            <SnPopupPicker
                class="sn-text"
                title="职业"
                text-align="left"
                placeholder="请选择职业"
                :dataList="professionList"
                :subTitle="subTitle"
                :selectFlag="selectFlag"
                v-model="profession"
            ></SnPopupPicker>
        </div>
        <div class="next-btn">
            <SnButton @SnButtonClick="nextStep">下一步</SnButton>
        </div>
    </div>
</template>
<script>
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { throttle, goBackPage, initTitleMenu, showToast } from 'sslib/common/extend'
import { openRouterByValue, setBusinessData, getProfessionList } from '../../handler/handler'
import { CardInfoModel } from '../../handler/model'
import { SnText, SnNumber, SnIDCard, SnPopupPicker } from 'biscomponents'
import StepHeader from './stepheader'
import { SnButton } from 'components'
export default {
    data(){
        return{
           cardInfo:{},
           professionList: [],
           subTitle:['实名认证'],
           profession:'',
           selectFlag: {'show': false},//是否显示选择控件 默认为false
        }
    },
    components:{
        StepHeader,SnButton,SnText,SnNumber,SnIDCard,SnPopupPicker
    },
    computed:{
        cardType(){
            return  this.cardInfo.idType === 1 ? "身份证" : ""
        }
    },
    created(){
        let _this = this;
        _this.init();
    },
    methods:{
        init(){
            let _this = this;
            notifyAppBackEvent(); //调用app，通知返回事件
            registerHandler('notifyAppBack', function (data) {//点击app返回事件
                throttle(function () {
                    if (_this.selectFlag.show) {
                        _this.selectFlag.show = false;
                        initTitleMenu(_this.subTitle)//回退时设置title及按钮
                    }else{
                        goBackPage('sswbv_close_browser');  
                    }                  
                }.bind(this));
            });
            _this.professionList = getProfessionList();
            if(!!_this.$route.query.cardInfo){
                const cardData = JSON.parse(decodeURIComponent(_this.$route.query.cardInfo));
                _this.cardInfo = new CardInfoModel(cardData);
            }
        },
        nextStep(){
            let _this = this;
            if(!_this.profession){
                showToast('请选择职业','middle');
                return;
            }
            openRouterByValue("identifystep3","",_this);
        }
    },
    watch:{
        profession(newVal,oldVal){
            let _this = this;
            if(!!newVal){
                _this.cardInfo.profession = _this.profession;
                setBusinessData("cardInfo",_this.cardInfo);
            }
        }
    }
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
            .sn-text{
                margin: 0 .3rem;
            }
            .weui-cell{
                padding: .24rem 0 !important;
                border-bottom: 1px solid @color-bg; 
                .weui-label{
                    width: 2rem !important;
                }
                .vux-cell-bd{
                    .vux-label{
                        width: 2rem !important;
                    }
                }
            }
            .borderTip{
                height: .3rem;
                background: @color-bg;
            }
        }
        .next-btn{
            padding: .5rem .3rem;
        }
    }
</style>
