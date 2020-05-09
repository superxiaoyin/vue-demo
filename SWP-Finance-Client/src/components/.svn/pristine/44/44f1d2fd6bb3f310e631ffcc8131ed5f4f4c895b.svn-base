<template>
    <div>
        <transition name="mask">
            <div class="panel-mask" v-show="value" :style="{position: absolute ? 'absolute' : 'fixed'}" ></div>
        </transition>
        <transition :name="animation">
            <div class="panel-wrap" v-show="value" :style="{position: absolute ? 'absolute' : 'fixed'}" :class="animation"  @click="panelClick"  >
                <slot></slot>
            </div>
        </transition>
    </div>
</template>
<script>
var fixsizeCount = 0;
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        //展示的动画类型['slideInUp','slideInRight','fadeIn']
        animation: {
            type: String,
            default: "fadeIn"
        },
        //panel-mask'和'panel-wrap'默认是fixed定位显示的, 这在panel里面有输入框时会有问题,因为键盘弹出时布局会改变,这时把absolute设置为true,使用absolute能够更好的控制布局
        absolute: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        panelClick: function(e) {
            if (e.target == e.currentTarget){
                this.$emit("input", false);
            }
        }
    },
    watch: {
        value: function() {
            if (this.absolute) {
                if (this.value) {
                    this.__scroll_top = window.scrollY;
                    window.scrollTo(0, 0);
                    fixsizeCount += 1;
                    $("html,body").addClass("fixbody");
                } else {
                    fixsizeCount -= 1;
                    if (fixsizeCount == 0) {
                        $("html,body").removeClass("fixbody");
                    }
                    //100毫秒后滚动到原先位置
                    window.setTimeout(
                        function() {
                            window.scrollTo(0, this.__scroll_top);
                        }.bind(this),
                        100
                    );
                }
            } else {
                if (this.value) {
                    this.__scroll_top = window.scrollY;
                    $("body").css({
                        position: "fixed",
                        top: "-" + this.__scroll_top + "px"
                    });
                } else {
                    $("body").css({
                        position: "",
                        top: ""
                    });
                    window.scrollTo(0, this.__scroll_top);
                }
            }
        }
    }
};
</script>
<style scoped lang="less">
    @import "SnPanel.less";
</style>