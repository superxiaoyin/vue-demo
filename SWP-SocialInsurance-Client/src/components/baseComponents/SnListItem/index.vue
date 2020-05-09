<template>
    <div class="sn-list-item">
        <div v-if="isIndex" class="sn-list-item-index">
            <span :id="data.href" :name="data.href">{{ data.valuePropName }}</span>
        </div>
        <div v-else :class="['sn-list-item-panel', itemSize]">
            <slot class="sn-list-item-icon" name="leftIcon"></slot>
            <div class="sn-list-item-main">
                <div class="sn-list-item-con">
                    <div class="sn-list-item-display" :style="{textAlign:textAlign}">{{  data.valuePropName  }}</div>
                    <div
                        v-if="descPropName && data[descPropName]"
                        class="sn-list-item-dec sn-nowrap"
                    >{{ data[descPropName] }}</div>
                </div>
                <div :class="['sn-list-item-right', { 'sn-link': isLink }]">
                    <div class="sn-list-item-mark">{{ mark }}</div>
                    <slot class="sn-list-item-right-icon" name="rightIcon"></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    props: {
        size: {
            type: String,
            default: "middle"
        },
        valuePropName: {
            type: String,
            default: "value"
        },
        descPropName: {
            type: String,
            default: ""
        },
        isLink: {
            type: Boolean,
            default: false
        },
        mark: {
            type: String,
            default: ""
        },
        data: {
            type: Object,
            default: {}
        },
        isIndex: {
            type: Boolean,
            default: false
        },
        textAlign: {
            type: String,
            default: 'right',
        },
    },
    computed: {
        itemSize() {
            return `sn-list-item-${this.size}`;
        }
    }
};
</script>
<style lang="less">
@import "./index.less";
</style>