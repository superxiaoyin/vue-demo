<template>
    <div class="query-main">
       协议内容
    </div>
</template>
<script>
import { throttle, showToast } from 'sslib/common/extend'
import { openRouterByValue, setBusinessData,getServerDataH5 } from '../../handler/handler'
import { SnText, SnIDCard } from 'biscomponents'
import { SnButton } from 'components'
export default {
    data(){
        return{
           idNum:"",
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
        },
        nextStep(){
            let _this = this;
            if(!_this.idNum){
                showToast('请输入身份证号码','middle');
                return;
            }
            // openRouterByValue("identifystep3","",_this);
            openRouterByValue("insuranceList",{idNum:encodeURIComponent(_this.idNum)},_this);
        }
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
