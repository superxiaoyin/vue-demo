<template>
    <div class="card-list">
        <Logo></Logo>
        <Tab :step="step" @tabclick="tabclick"></Tab>
        <router-view></router-view>
    </div>
</template>
<script>
import Logo from './logo.vue'
import Tab from './tab.vue'
import {openRouterByValue,backRouterByValue,getServerData,setBusinessData,getBusinessData,getServerDataH5} from '../../handler/handler'
import { throttle, goBackPage, showToast, getUrlParams } from 'sslib/common/extend'
var urlParams = getUrlParams();
export default {
    data(){
        return{
            step:1
        }
    },
    created(){
        let _this = this;
        if(_this.$route.path != '/info'){
            _this.step = 2
        }else{
            _this.step = 1
        }
        _this.init();
    },
    components:{
       Logo,Tab
    },
    methods:{
        //数据初始化
        init(){
            let _this = this;
            // _this.userLogin();
        },
        tabclick(id){
            this.step = id
        }
    }
}
</script>
