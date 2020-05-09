<template>
  <div class="popup">
    <transition name="popup-mask">
        <div class="mask" @click="onClickingMask" v-show="open"></div>
    </transition>
    <transition name="fade" @after-enter="$emit('on-after-show')" @after-leave="$emit('on-after-hide')">
        <div class="popup-wrapper" v-show="open">
            <div v-if="descriptionText" class="description">
                <i v-if="selectFlag.show" class="back-icon" @click="backFun"></i>
                <i v-else class="fill-icon"></i>
                <span>{{titleText}}</span>
                <i v-if="showCancel" class="cancel-icon" @click="cancelFun"></i>
            </div>
            <slot></slot>
        </div>
    </transition>
  </div>
</template>
<script>
import {SnButton,SnCell} from 'components'
export default {
    name: "popup",
    components: {SnButton,SnCell},
    props: {
        value: Boolean,

        //是否显示取消按钮
        showCancel: Boolean,

        //辅助说明文字
        descriptionText: String,

        selectFlag: {
            type: Object,
            default: { 'show': false }
        },

        //点击mask是否隐藏actionsheet
        closeOnClickingMask: {
            type: Boolean,
            default: true
        },

        //点击menuItem是否隐藏actionsheet
        closeOnClickingMenu: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
        open: false,
        titleText: '',
        };
    },
    created(){
        this.titleText = this.descriptionText;
    },
    watch: {
        open(val) {
            this.$emit("input", val);
        },
        value: {
            handler: function(val) {
                this.open = val;
            },
            immediate: true
        }
    },
    methods: {
        cancelFun() {
            let _this = this;
            _this.$parent.showPopup = false;
            _this.$emit("on-click-cancel");
        },
        onClickingMask() {
            let _this = this;
            if (_this.closeOnClickingMask) {
                _this.$parent.showPopup = false;
                _this.$emit("on-click-cancel");
            }
        },
        backFun(){
            let _this = this;
            _this.selectFlag.show = false;
            _this.titleText = _this.descriptionText;
        },
    }
};
</script>
<style lang="less">
    @import '~components/style/common.less';
    .mask {
        position: fixed;
        z-index: 1000;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .3);
    }

    .popup-mask-enter,
    .popup-mask-leave-active {
        opacity: 0;
    }
    .popup-mask-leave-active,
    .popup-mask-enter-active {
        transition: opacity 400ms!important;
    }

    .popup-wrapper {
        position: fixed;
        height: 50%;
        padding: .3rem 0;
        border-top-left-radius: .2rem;
        border-top-right-radius: .2rem;
        background: @color-white;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        z-index: 1002;
        .description{
            padding: 0 .3rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: .34rem;
            .back-icon{
                background: url('../../resource/img/icon_back.png') no-repeat right;
            }
            .cancel-icon{
                background: url('../../resource/img/icon_cancel.png') no-repeat right;
            }
            .back-icon,.cancel-icon,.fill-icon{
                display: inline-block;
                height: .44rem;
                width: .44rem;
                background-size: .44rem .44rem;
            }
        }
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: all .4s ease;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
    }
</style>
