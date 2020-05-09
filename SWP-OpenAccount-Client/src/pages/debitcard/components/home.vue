<template>
    <div >
        <SnList type="choose" v-for="(item, index) in timelist" :key="index" :title="timelist[index]+'小时'" mark="" @click.native='select(index)'>
            <!-- <img v-if="active===index" slot="righticon" src="resource/img/icon_choosed.png" > -->
        </SnList>
    </div>
</template>

<script>
    import common from '../dbcommon/common'
    import { SnList } from 'components'
    import { showToast } from 'sslib/common/extend.js';
    document.body.addEventListener('touchstart', function() {});
    export default {
        components: {
            SnList
        },
        data() {
            return {
               timelist:[24,48,72],
               active:null
            }
        },
        mounted() {
           this.getConfigList();
        },
        methods: {
             select (index){
                //this.active = index;
                this.modifyConfig(3600*this.timelist[index]);
            },
            //获取授权时间
            getConfigList(){
                let data = {cfgKey:'1'};
                common.getConfigList(data).then(res=>{
                    //console.log(res)
                    if(res&&res.cfgValue){
                        let active = this.timelist.indexOf(res.cfgValue/3600);
                        this.active = (active>-1)?active:this.active;
                    }
                })
            },
            //设置授权时间
            modifyConfig(selectTime){
                let data = {cfgKey:'1',cfgValue:selectTime};
                common.modifyConfig(data).then(res=>{
                    //console.log(res)
                    if(res){
                        showToast('设置成功');
                    }
                    this.getConfigList();
                })
            }
        },
        
    }
</script>
<style scoped lang="less">
    @import '~components/style/common.less';

</style>