<template>
    <transition name="toast">
        <div class="sn-toast" v-show="value">
            <span class="content">{{content}}</span>
        </div>
    </transition>
</template>
<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        content: {
            type: String,
            default: "提示文字"
        }
    },

    data: function() {
        return {};
    },
    created: function() {},
    methods: {
        /**
         * 显示toast
         * @param {[string]} content  [内容]
         * @param {[number]} duration [toast的持续时间(单位毫秒,默认2500)]
         */
        closeTips: function(duration = 2000) {
            var _this = this;
            if (this.t) {
                window.clearTimeout(this.t);
            }
            this.t = window.setTimeout(
                function() {
                    _this.$emit("input", false);
                }.bind(this),
                duration
            );
        }
    },
    watch: {
        value: function(newValue, oldValue) {
            if (newValue == true) {
                this.closeTips();
            }
        }
    }
};
</script>
<style scoped lang="less">
.sn-toast {
    position: fixed;
    top: 40%;
    left: 5%;
    right: 5%;
    z-index: 9090;
    max-width: 90%;
    text-align: center;
    .content {
        display: inline-block;
        margin: 0 auto;
        padding: 0.2rem 0.4rem;
        border-radius: 0.1rem;
        color: #fff;
        font-size: 0.32rem;
        background-color: rgba(0, 0, 0, 0.6);
        word-break: break-all;
    }
}
@media screen and (min-width: 549px) {
    .sn-toast {
        .content {
            font-size: 14px;
        }
    }
}
.toast-enter-active,
.toast-leave-active {
    transition: opacity 0.5s ease;
}

.toast-enter,
.toast-leave-active {
    opacity: 0;
}
</style>