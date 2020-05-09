<template>
    <div class="card">
        <div class="card-input">
            <SnNumber
                :title="title"
                :text-align="textAlign"
                v-model="cardNumber"
                :placeholder="placeholder"
                :minlength="minlength"
                :maxlength="maxlength"
                @onChange="onChange"
            ></SnNumber>
        </div>
        <div>
            <!--扫码icon-->
			<a class="scanicon" @click="scancode"></a>
        </div>
    </div>
</template>
<script>
import { SnNumber } from 'biscomponents'
export default {
    data(){
        return{
        }
    },
    components:{
        SnNumber
    },
    props:{
        title: {//title
            type: String,
            default: ""
        },
        cardNumber: {//账号
            type: String,
            default: ""
        },
        textAlign:{
            type:String,
            default:'left'
        },
        placeholder:{
            type: String,
            default: ""
        },
        maxlength:{
            type: String,
            default: ""
        },
        minlength:{
            type: String,
            default: ""
        },
    },
    computed: {
        inputStyle() {
            if (this.textAlign) {
                return {
                    textAlign: this.textAlign
                }
            }
        },
    },
    mounted(){
        let _this = this;
    },
    methods:{
        onChange() {
            let _this = this;
            _this.$emit('input', _this.cardNumber || '');
        },
        scancode() {
            let _this = this;
            alert('扫描');
        }
    },
    watch:{

    }
}
</script>

<style lang="less">
    @import '~components/style/common.less';
    .card{
        display: flex;
        border-bottom: 1px solid #f6f6f6;
    }
    .card-input{
        // padding-right: 1rem;
        width: 100%;
        div.weui-cell {
            border-bottom: 0px solid #f6f6f6;
        }
    }
    .scanicon{
        // position: absolute;
        width: 0.9rem;
        height: 0.9rem;
        top: 50%;
        right: 0.06rem;
        // margin-top: -1rem;
        background: url(../../resource/img/mycard/scanicon.png) no-repeat center;
        background-size: 0.42rem 0.42rem;
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
    }
    .vux-toast{
        display: none !important;
    }
    .vux-popup-mask{
        display: none !important;
    }
</style>
