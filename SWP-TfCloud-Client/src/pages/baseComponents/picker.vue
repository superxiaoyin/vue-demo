<template>
    <div class="picker">
        <cell :title="title" value-align="right" @click.native="openPopup">
            <input
                type="text"
                :style="inputStyle"
                class="popupInput"
                maxlength="20"
                readonly="readonly"
                ref="input"
                :value="accountData.title"/>
        </cell>
        <div v-transfer-dom>
            <popup
                class="popup-s"
                v-model="popupShowFlag"
                position="right"
                width="100%">
                <panel @on-choose-item="chooseItem" :chooseIndex="chooseIndex" :dataList="dataList"></panel>
            </popup>
        </div>
    </div>
</template>
<script>
import { Group, Popup, PopupHeader, Cell, TransferDom } from 'vux'
import Panel from './panel'
export default {
    data(){
        return{
            accountData:{},
            selectedValue:'',
            popupShowFlag: false,
            delayShow: 0,
            chooseIndex: 0,
            account: ''
        }
    },
    components:{
        Group, Popup, PopupHeader, Panel, Cell, TransferDom
    },
    props:{
        title: {//title
            type: String,
            default: ""
        },
        dataList: {//list数据
            type: Array,
            default() {
                return []
            }
        },
        selectFlag: {
            type: Object,
            default: { 'show': false }
        },
        textAlign:{
            type:String,
            default:'left'
        }
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
         //检测键盘是否弹起并设置下拉框弹出延时
        $(document).on("focus", "input,textarea", function () {
            _this.delayShow = 450;
        })
        $(document).on("blur", "input,textarea", function () {
            setTimeout(function() {
                _this.delayShow = 0;
            }, 500)
        })
    },
    methods:{
        openPopup(){
            let _this = this;
            setTimeout(function () {
                _this.popupShowFlag = true;
                _this.delayShow = 0;
                _this.selectFlag.show = true;
                _this.$emit('changeTitle','选择付款方式');
            }, _this.delayShow);   
        },
        chooseItem(index){
            let _this = this;
            _this.chooseIndex = index;
            _this.accountData = _this.dataList[_this.chooseIndex];
            _this.$parent.backFun();
        }
    },
    watch:{
        dataList:{
            handler(newVal,oldVal){
                let _this = this;
                if(newVal.length){
                    _this.accountData = _this.dataList[_this.chooseIndex];
                }
            }
        }
    }
}
</script>

<style lang="less">
    @import '~components/style/common.less';
    .picker{
        .weui-cell__ft{
            .flex-box();
            width: 4rem;
            &:after {
                content: "";
                width: 0.42rem;
                height: 0.42rem;
                background: url(../../resource/img/icon_narrow_right.png) no-repeat center;
                background-size: 0.42rem 0.42rem;
                display: inline-block;
                vertical-align: middle;
                cursor: pointer;
            }
        }
        .popup-s{
            position: fixed;
            bottom: 0 !important;
            right: 0 !important;
            left: 0 !important;
            top: unset !important;
            height: 42% !important;
            background-color: @color-white;
        }
    }
    .vux-toast{
        display: none !important;
    }
    // .vux-popup-mask{
    //     display: none !important;
    // }
</style>
