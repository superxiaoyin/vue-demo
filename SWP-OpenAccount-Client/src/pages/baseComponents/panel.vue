<template>
    <div class="panel">
        <div class="panel-item" v-for="(item,index) in dataList" @click="onChooseItem(index)">
            <i class="icon-bank-account"></i>
            <div class="item-info">
                <span>{{item.title}}</span>
                <i class="info-checked" v-if="index === chooseIndex" ></i>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        dataList:{
            type:Array,
            default:[]
        },
        chooseIndex:{
            type:Number,
            default:0
        }
    },
    methods:{
        onChooseItem(index){
            this.$emit('on-choose-item',index);
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .panel{
        padding-left: .3rem;
        height: 100%;
        overflow-y: auto;
        padding-bottom: .3rem;
        .panel-item{
            display: flex;
            align-items: center;
            .icon-bank-account{
                margin: .24rem .2rem .24rem 0;
                display: inline-block;
                height: .54rem;
                width: .54rem;
                // background: url('../../resource/img/icon_bank_account.png') no-repeat center;
                background: url('../../resource/img/icon_bank.png') no-repeat center;
                background-size: .54rem .54rem;
            }
            .item-info{
                padding: .24rem  .3rem .24rem 0;
                border-bottom: 1px solid @color-bg;
                width: 100%;
                display: inline-flex;
                align-items: center;
                justify-content: space-between;
                .info-checked{
                    display: inline-block;
                    height: .54rem;
                    width: .54rem;
                    background: url('../../resource/img/icon_checked.png') no-repeat center;
                    background-size: .54rem .54rem;
                }

            }
        }
    }
</style>
