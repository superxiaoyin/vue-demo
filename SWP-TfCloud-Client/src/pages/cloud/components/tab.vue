<template>
    <div class="header">
        <div class="li" @click="totab(1)" :class="step == 1 ? 'active' : ''">账户一览</div>
        <div class="li" @click="totab(2)" :class="step == 2 ? 'active' : ''">交易明细</div>
    </div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'
import { openRouterByValue} from '../../handler/handler'
export default {
    data(){
        return{
            parms:{}
        }
    },
    props:{
        step:{
            type:Number,
            default: 1
        }
    },
    methods: {
        totab(id) {
            if(id == 1){
                this.$emit('tabclick',id)
                openRouterByValue('info',{},this)
            }else{
                this.$emit('tabclick',id)
                openRouterByValue('list',{},this)
            }
        }
    },
    watch: {
        $route (to,from) {
            if(to.fullPath == "/list"){
                this.step = 2
            }else if(to.fullPath == "/info"){
                this.step = 1
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .header{width: 60%;margin: 20px auto;display: flex;border: 1px solid #EB4633;border-radius: 50px;overflow: hidden;
        .li{flex: 1;color: #EB4633;text-align: center;height: 32px;line-height: 32px;font-size: 15px;background-color: #fff;}
        .li.active{background-color: #EB4633;color: #fff;}
    }
</style>
