<template>
    <div class="result">
        <div class="result-status" :class="{'extra':result.status===2||!result.infoList}">
            <i :class="result.status === 1?'success-icon':'failed-icon'"></i>
            <span class="status-text" v-if="!!result.text">{{result.payType == '1' ? '正常' : '核定缴费'}}{{result.text}}</span>
            <span class="status-money" v-if="!!result.productName">{{result.productName}}</span>
            <div class="text-info">
                <span class="status-info" v-if="!!result.info">{{result.info}}</span>
                <span class="status-desc" v-if="!!result.desc">{{result.desc}}</span>                
            </div>
        </div>
       
        <div class="result-btn">
            <sn-button @SnButtonClick="completed">完成</sn-button>
        </div>
    </div>
</template>
<script>
import {backRouterByValue,openRouterByValue} from '../../handler/handler'
import {SnButton,SnCell} from 'components'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { goBackPage,throttle,initTitleMenu } from 'sslib/common/extend'
export default {
    data(){
        return{
            result:{
                status:1
            },
            phone:'',
        }
    },
    components:{
        SnButton,SnCell
    },
    created(){
        let _this = this;
        _this.init();
    },
    methods:{
        init(){
            let _this = this;
            // console.log(JSON.parse(decodeURIComponent(_this.$route.query.result)))
            
            if(!!_this.$route.query.result){
                _this.result = JSON.parse(decodeURIComponent(_this.$route.query.result))
                _this.phone = _this.$route.query.phone
            }
        },
        completed(){
            let _this =  this;
            openRouterByValue("query",{phone:_this.phone},_this);
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .result{
        background: @color-white;
        padding: 0 .3rem;
        display: flex;
        flex-direction: column;
        .result-status{
            flex: 1.4;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            .success-icon{
                background: url('../../../resource/img/icon_success_big.png') no-repeat center;
            }
            .failed-icon{
                background: url('../../../resource/img/icon_failed.png') no-repeat center;
            }
            .success-icon,.failed-icon{
                display: block;
                height: .8rem;
                width: .8rem;
                background-size: .8rem .8rem;
            }
            .status-text{
                height: .8rem;
                line-height: .8rem;
                font-size: .4rem;
                margin-top: 10px;
            }
            .status-money{
                font-size: .3rem;
                font-weight: normal;
                margin: 0 0 20px;
            }
            .text-info{
                margin: 20px;
            }
            .status-desc{
                color: @fc-info;
            }
        }
        .extra{
            flex: 2.2;
        }
        .result-info{
            flex: 0.8;
            .sn-cell:before{
                border-bottom: none !important;
            } 
            .sn-cell{
                border-bottom: 1px solid @color-bg;
                padding: .24rem 0 !important;
                .sn-cell-label{
                    width: 2.5rem !important;
                }
            }
        }
        .result-btn{
            flex: 1.4;
        }
    }
</style>
