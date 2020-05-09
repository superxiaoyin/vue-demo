<template>
    <div class="record">
        <SnEmpty :isShow="true" icon="no-charge" tip="暂无缴费记录"></SnEmpty>
    </div>
</template>
<script>
import {openRouterByValue,backRouterByValue} from '../../handler/handler'
import { registerHandler, notifyAppBackEvent } from 'sslib/common/SnJsBridge'
import { throttle, goBackPage_new, initTitleMenu } from 'sslib/common/extend'
import { SnLoading,SnEmpty } from 'components'
export default {
    data(){
        return{
            subTitle:["缴费记录"]
        }
    },
    components:{
        SnEmpty,SnLoading
    },
    created(){
        let _this = this;
        initTitleMenu(_this.subTitle);
        _this.init();
    },
    methods:{
        init(){
            let _this = this;
            notifyAppBackEvent(); //调用app，通知返回事件
            registerHandler('notifyAppBack', function (data) {//点击app返回事件
                throttle(function () {
                    if(Number(_this.$route.query.optType) === 1){//月结
                        backRouterByValue('settlemonth',_this.$route.query,_this);
                    }else{//预存
                        backRouterByValue('prestore',_this.$route.query,_this);
                    }
                }.bind(this));
            });
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .record{
        background: @color-white;
        padding: .3rem;
    }
</style>
