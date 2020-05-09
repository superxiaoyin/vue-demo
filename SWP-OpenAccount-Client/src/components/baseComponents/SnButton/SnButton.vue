<template>
    <div class="sn-button" v-if="type == 'one'">
        <button :class="{loading: showLoading,smallBtn:small}" type="default" @click="SnButtonClick" >
            <slot></slot>
        </button>
    </div>
    <div class="sn-button-bottom" v-else-if="type == 'bottom'">
        <button :class="{loading: showLoading}" type="default" @click="SnButtonClickBottom">
            <slot></slot>
        </button>
    </div>
    <div class="sn-button-two" v-else-if="type == 'two'">
        <button type="default" class="left" @click="SnButtonClickLeft" :class="color">
            <slot name="left"></slot>
        </button>
        <button type="default" class="right" @click="SnButtonClickRight">
            <slot name="right"></slot>
        </button>
    </div>
    <div class="sn-button-text" v-else-if="type == 'text'">
        <button type="default" class="left" @click="SnButtonClickLeft">
            <slot name="left"></slot>
        </button>
        <button type="default" class="right" @click="SnButtonClickRight">
            <slot name="right"></slot>
        </button>
    </div>
    <div class="sn-button-three" v-else-if="type == 'three'">
        <button type="default" class="left" @click="SnButtonClickLeft">
            <slot name="left"></slot>
        </button>
        <button type="default" class="center" @click="SnButtonClickCenter">
            <slot name="center"></slot>
        </button>
        <button type="default" class="right" @click="SnButtonClickRight">
            <slot name="right"></slot>
        </button>
    </div>
</template>
<script>
export default {
    props: {
        showLoading: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: "one"
        },
        color: {
            type: String,
            default: "default"
        },
        small: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        // 绑定事件
        SnButtonClick() {
            this.$emit("SnButtonClick");
        },
        SnButtonClickBottom() {
            this.$emit("SnButtonClickBottom");
        },
        SnButtonClickLeft() {
            this.$emit("SnButtonClickLeft");
        },
        SnButtonClickCenter() {
            this.$emit("SnButtonClickCenter");
        },
        SnButtonClickRight() {
            this.$emit("SnButtonClickRight");
        }
    }
};
</script>
<style scoped lang="less">
@import "SnButton.less";
</style>