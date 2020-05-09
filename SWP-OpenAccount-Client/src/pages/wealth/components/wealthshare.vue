<template>
    <div class="share-main">
        <div class="img-gold" v-if="flag==1">
            <img class="img-div" src="../../../resource/img/wealth/快乐金.jpg" @click="goDownload()"/>
        </div>
        <div class="img-month" v-else>
            <img class="img-div" src="../../../resource/img/wealth/月月红.jpg" @click="goDownload()"/>
        </div>
    </div>
</template>
<script>
import {initTitleMenu } from 'sslib/common/extend'
export default {
    data(){
        return{
            flag:'',
        }
    },
    created(){
        let _this = this;
        if(!!_this.$route.query.flag){
            _this.flag = _this.$route.query.flag;
            initTitleMenu([_this.$route.query.flag == 1 ? '快乐金' : '月月红']);
        }
    },
    methods:{
        goDownload(){
            window.location.href = '/yqtdownload/download.html';
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .share-main{
        // .img-gold{
        //     width: 100%;
        //     height:100vh;
        //     background:url("../../../resource/img/wealth/快乐金.jpg") no-repeat    ;
        //     background-size:100% 100%; /*随着原始比例缩放*/
        // }
        // .img-month{
        //     width: 100%;
        //     height:100vh;
        //     background:url("../../../resource/img/wealth/月月红.jpg") no-repeat    ;
        //     background-size:100% 100%; /*随着原始比例缩放*/
        // }
        .img-div{
            width: 100%;
            height: 100%;
        }
    }
</style>
