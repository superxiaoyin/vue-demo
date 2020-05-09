<template>
    <div class="header">
        <div class="step-item" v-for="i in 4">
            <div class="step-info">
                <i :class="step>=i?`step${i}-icon-active`:`step${i}-icon-nor`"></i>
                <span :class="step>=i?'':'step-title-nor'">{{stepTitle[i]}}</span>
            </div>
            <span v-if="i<4" class="right-line"></span>            
        </div>

    </div>
</template>
<script>
export default {
    data(){
        return{
            stepTitle:{
                1:'证件照片',
                2:'个人信息',
                3:'身份验证',
                4:'完成认证'
            }
        }
    },
    props:{
        step:{
            type:Number,
            default: 1
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~components/style/common.less';
    .header{
        background: @color-bg;
        display: flex;
        align-items: center;
        padding: .15rem;
        justify-content: space-between;
        .step-item{
            display: inline-flex;
            align-items: center;
            .step-info{
                display: inline-flex;
                flex-direction: column;
                align-items: center;
                width: 1.2rem;
                font-size: @fs-mob-small;
                .step1-icon-active{
                    background: url('../../../resource/img/openaccount/icon_step1_active.png') no-repeat center;
                }
                .step2-icon-active{
                    background: url('../../../resource/img/openaccount/icon_step2_active.png') no-repeat center;
                }
                .step2-icon-nor{
                    background: url('../../../resource/img/openaccount/icon_step2_nor.png') no-repeat center;
                }
                .step3-icon-active{
                    background: url('../../../resource/img/openaccount/icon_step3_active.png') no-repeat center;
                }
                .step3-icon-nor{
                    background: url('../../../resource/img/openaccount/icon_step3_nor.png') no-repeat center;
                }
                .step4-icon-active{
                    background: url('../../../resource/img/openaccount/icon_step4_active.png') no-repeat center;
                }
                .step4-icon-nor{
                    background: url('../../../resource/img/openaccount/icon_step4_nor.png') no-repeat center;
                }
                .step1-icon-active,.step2-icon-active,.step2-icon-nor,.step3-icon-active,.step3-icon-nor,.step4-icon-active,.step4-icon-nor{
                    display: block;
                    height: .48rem;
                    width: .48rem;
                    background-size: .48rem .48rem;
                    margin-bottom: .1rem;
                }
                .step-title-nor{
                    color: @fc-info;
                }
            }
            .right-line{
                width: .6rem;
                height: 1px;
                margin-bottom: .4rem;
                border-top: 1px dotted #e5e5e5;
            }
        }
        
    }
</style>
