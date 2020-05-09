<template>
    <SnPopup
        :title="title"
        :placeholder="placeholder"
        :textAlign="textAlign"
        :defaultValue="currentValue[valuePropName]"
        v-model="value"
        @beforePopup="beforePopup"
        @onHide="onHide"
        @onShow="onShow"
        @onFirstShow="onFirstShow"
        @loadMore="loadMore"
    >
        <slot></slot>
        <SnList
            :list="list"
            @onChange="onChange"
            :textAlign="textAlign"
            @onSelect="onSelect"
            :defaultValue="currentValue[keyPropName]"
            :descPropName="descPropName"
            :keyPropName="keyPropName"
            :valuePropName="valuePropName"
            :hasMore="hasMore"
            :size="size"
        />
    </SnPopup>
</template>

<script>
import SnPopup from "../SnPopup";
import SnList from "../SnList";
export default {
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
        defaultValue: {
            type: Object,
            default: {}
        },
        list: {
            type: Array,
            default: []
        },
        descPropName: {
            type: String,
            default: ""
        },
        keyPropName: {
            type: String,
            default: ""
        },
        valuePropName: {
            type: String,
            default: ""
        },
        value: {
            type: Boolean,
            default: false,
        },
        hasMore: {
            type: Boolean,
            default: false,
        },
        size: {
            type: String,
            default: "middle",
        }
    },
    data() {
        return {
            currentValue: {}
        }
    },

    components: {
        SnPopup,
        SnList
    },

    computed: {
        showPopup() {
            return this.show;
        }
    },

    methods: {
        onChange(item) {
            this.value = item;
            this.$emit("onChange", item)
        },
        onSelect(item) {
            this.$emit("input", false);
            this.$emit("onSelect", item);
        },
        beforePopup() {
            this.$emit("beforePopup");
        },
        onShow() {
            this.$emit("onShow");
        },
        onHide() {
            this.$emit("input", false);
            this.$emit("onHide")
        },
        onFirstShow() {
            this.$emit("onFirstShow");
        },
        loadMore() {
            if (this.hasMore) {
                this.$emit("loadMore");
            }
        }
    },
    watch: {
        defaultValue() {
            let _this = this;
            if (!_this.defaultValue) return;
            _this.currentValue[_this.valuePropName] = _this.defaultValue[_this.valuePropName];
            _this.currentValue[_this.keyPropName] = _this.defaultValue[_this.keyPropName];
        }
    }
}

</script>
<style lang='less' scoped>
</style>