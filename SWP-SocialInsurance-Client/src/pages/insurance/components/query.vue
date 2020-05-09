<template>
    <div class="query-main">
        <div class="person-info">
            <SnText
                class="sn-text"
                title="姓名"
                text-align="left"
                :maxlength="10"
                placeholder="请输入姓名"
                v-model="param.name"
            ></SnText>
            <SnText
                class="sn-text"
                title="证件类型"
                readonly
                text-align="left"
                :maxlength="30"
                placeholder="请输入证件类型"
                v-model="cardType"
            ></SnText>
             <SnText
                class="sn-text"
                title="证件号码"
                text-align="left"
                :maxlength="18"
                placeholder="请输入身份证号码"
                v-model="param.idNum"
            ></SnText>
            <!-- <SnIDCard
                class="sn-text"
                title="证件号码"
                placeholder="请输入身份证号码"
                text-align="left"
                :maxlength="18"
                v-model="param.idNum"
            ></SnIDCard> -->
        </div>
        <div class="next-btn">
            <SnButton :showLoading="loadingFlag" @SnButtonClick="nextStep">下一步</SnButton>
        </div>
    </div>
</template>
<script>
import { throttle, showToast } from 'sslib/common/extend'
import { openRouterByValue, backRouterByValue, setBusinessData, getBusinessData, getServerDataH5, getvoucherName } from '../../handler/handler'
import { SnText, SnIDCard } from 'biscomponents'
import { SnButton} from 'components'
export default {
    data(){
        return{
            param:{idNum:'',name:''},
            loadingFlag: false,
            joinInfo:{},
        }
    },
    components:{
        SnButton,SnText,SnIDCard
    },
    computed:{
        cardType(){
            return  "身份证"
        }
    },
    created(){
        let _this = this;
        _this.init();
    },
    methods:{
        init(){
            let _this = this;
            if(!!_this.$route.query.param){
                _this.param = JSON.parse(decodeURIComponent(_this.$route.query.param));
            }
        },
        nextStep(){
            let _this = this;
            // _this.loadingFlag = true;
            throttle(function () {
                if(!_this.param.name){
                    showToast('请输入姓名','middle');
                    return;
                }
                if(!_this.param.idNum){
                    showToast('请输入身份证号码','middle');
                    return;
                }
                _this.loadingFlag = true;
                getServerDataH5(textUrl+'/SSP-HTTP/socialSecurity.queryJoinInfo',_this.param,'POST').then(result => {
                    console.log(result)
                    _this.loadingFlag = false;
                    if (result.code===0) {
                        _this.joinInfo = result.joinInfo;
                        _this.joinInfo.today = result.today;
                        _this.joinInfo.voucherName = getvoucherName(_this.joinInfo.voucherType);
                        setBusinessData(_this.joinInfo.idNum,_this.joinInfo)
                        openRouterByValue("insuranceList",{joinInfo:encodeURI(_this.joinInfo.idNum)},_this);
                    }else{
                        showToast(result.rdesc);
                    }
                })
                // getServerDataH5(textUrl+'/SSP-HTTP/socialSecurity.queryJoinInfo',_this.param,'POST').then(result => {
                //     console.log(result)
                //     if(result.code === 0){
                //         openRouterByValue("insuranceList",{idNum:encodeURIComponent(_this.param.idNum)},_this);
                //     }else{
                //         showToast(result.rdesc);
                //         _this.loadingFlag = false;
                //     }
    
                // })
            }.bind(_this));
           
        },
    },
}
</script>
<style lang="less">
    @import '~components/style/common.less';
    .query-main{
        .person-info{
            margin-top: .2rem;
            background: @color-white;
            .weui-cell{
                padding: .24rem!important;
                border-bottom: 1px solid @color-bg; 
                .weui-label{
                    width: 2.25rem !important;
                }
                .vux-cell-bd{
                    .vux-label{
                        width: 2.25rem !important;
                    }
                }
            }
            .borderTip{
                height: .3rem;
                background: @color-bg;
            }
        }
        .new{
            display: -webkit-box;
            .sn-button{
                padding: 0;
                button{
                    color: #E8422E;
                    opacity: 1;
                    border: 0px solid rgba(214,61,43,1);
                    border-width: .02rem;
                    line-height: 0.54rem;
                    background: transparent;
                }
            }
            .btn-left{
                width: 1.92rem;
                margin-left: 1.36rem;
                margin-right: .6rem;
            }
            .btn-right{
                width: 1.92rem;
            }
        }
    }
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
        }
        .next-btn{
            padding: .5rem .3rem;
        }
    }
</style>
