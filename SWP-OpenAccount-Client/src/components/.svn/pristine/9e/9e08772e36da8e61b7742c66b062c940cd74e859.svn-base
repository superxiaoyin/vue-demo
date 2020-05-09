<template>
    <cell class="sn-popup" :title="title" value-align="left" @click.native="beforePopup">
        <input
            type="text"
            :style="inputStyle"
            class="sn-popup-input"
            maxlength="20"
            :placeholder="placeholder"
            readonly="readonly"
            :value="defaultValue"
        >
        <i class="loading" v-show="isLoading">&nbsp;</i>
        <div v-transfer-dom>
            <popup
                v-model="value"
                width="100%"
                position="right"
                @on-hide="onHide"
                @on-show="onShow"
                @on-first-show="onFirstShow"
            >
                <scroll-lock
                    class="popup-con"
                    :lock="true"
                    :bodyLock="value"
                    @scroll.native="onScroll"
                >
                    <slot></slot>
                </scroll-lock>
            </popup>
        </div>
    </cell>
</template>

<script>
import Vue from 'vue';
import { Popup, Cell, TransferDom } from 'vux';
import { isPC } from '../../../lib/common/extend.js';
import VueScrollLock from 'vue-scroll-lock'
import { setTimeout } from 'timers';
Vue.use(VueScrollLock)
export default {
    directives: {
        TransferDom
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        textAlign: {
            type: String,
            default: 'right',
        },
        isLoading: {
            type: Boolean,
            default: false
        },
        defaultValue: {
            type: String,
            default: ""
        },
        value: {
            type: Boolean,
            default: false
        },
        delayShow: 0,
    },
    data() {
        return {
            bodyLock: false,
            show: false,
            throttle: true
        };
    },

    components: {
        Popup,
        Cell
    },

    computed: {
        inputStyle() {
            if (this.textAlign) {
                return {
                    textAlign: this.textAlign
                }
            }
        }
    },

    mounted() {

    },

    methods: {
        beforePopup() {
            this.$emit("beforePopup");
        },
        onHide() {
            this.$emit("input", false);
            this.$emit("onHide");
        },
        onShow() {
            this.$emit("onshow");
        },
        onFirstShow() {
            this.$emit("onFirstShow");
        },
        onScroll(e) {
            let _this = this;
            if (!_this.throttle) return;
            _this.throttle = false;
            setTimeout(() => {
                let scrollHeight = e.target.scrollHeight;
                let clientHeight = e.target.clientHeight;
                let scrollTop = e.target.scrollTop;
                if (scrollHeight - scrollTop < clientHeight + 20) {
                    _this.$emit("loadMore");
                }
                _this.throttle = true;
            }, 300)
        }
    }
}

</script>
<style lang='less'>
@import (reference) "../../style/common.less";
.sn-popup {
    i.loading {
        display: inline-block;
        width: 0.5rem;
        height: 0.5rem;
        background: url(../resource/img/loading.gif) no-repeat center;
        background-size: contain;
    }
    .weui-cell__ft {
        padding-right: 0;
        align-items: center;
        .flex-box();
        &:after {
            content: "";
            width: 0.4rem;
            height: 0.4rem;
            background: url(../resource/img/icon_narrow_right.png) no-repeat
                center;
            background-size: 0.42rem 0.42rem;
            display: inline-block;
            vertical-align: middle;
        }
    }
    .sn-popup-input {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}
div.vux-popup-dialog {
    background: #fff;
    max-width: @max-content-width;
    .popup-con {
        display: block;
        overflow: auto;
        height: auto;
        max-height: 100vh;
        padding: 0 0 0 0.3rem;
        background: #fff;
    }
}
@media screen and (min-width: @screen-xs-max) {
    .sn-popup {
        i.loading {
            right: 55px;
        }
        .weui-cell__ft {
            cursor: pointer;
            input {
                cursor: pointer;
            }
            &:after {
                width: 20px;
                height: 20px;
            }
        }
    }
    div.vux-popup-dialog {
        .popup-con {
            padding: 0 30px;
        }
    }
}
@media screen and (min-width: @screen-md-min) {
    div.vux-popup-dialog {
        .popup-con {
            padding: 0 50px;
        }
    }
}
</style>