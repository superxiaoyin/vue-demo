<template>
    <div class="sn-list">
        <SnListItem
            v-for="(item, index) in list"
            :class="{ active: item[keyPropName] == defaultValue }"
            :key="index"
            :data="item"
            :size="size"
            :textAlign="textAlign"
            :isIndex="item.flag === false"
            :descPropName="descPropName"
            :valuePropName="valuePropName"
            @click.native="onClick(item)"
        />
        <SnLoading v-show="hasMore"></SnLoading>
    </div>
</template>
<script>
import SnListItem from "../SnListItem";
import SnLoading from '../SnLoading/SnLoading.vue';
export default {
    props: {
        list: {
            type: Array,
            default: []
        },
        keyPropName: {
            type: String,
            default: ""
        },
        valuePropName: {
            type: String,
            default: ""
        },
        descPropName: {
            type: String,
            default: "",
        },
        defaultValue: {
            type: String,
            default: ""
        },
        hasMore: {
            type: Boolean,
            default: false,
        },
        size: {
            type: String,
            default: "middle",
        },
        textAlign: {
            type: String,
            default: 'right',
        },
    },
    data() {
        return {
            selected: null,
        };
    },

    components: {
        SnListItem,
        SnLoading
    },

    computed: {},

    mounted() {

    },

    methods: {
        onClick(item) {
            let _this = this;
            if (item.flag === false) {
                return;
            }
            let sel = _this.selected;
            if (!sel || (sel && sel[_this.keyPropName] != item[_this.keyPropName])) {
                _this.$emit("onChange", item)
            }
            _this.$emit("onSelect", item);
            _this.selected = item;
        }
    }
}

</script>
<style lang='less'>
.popup-con {
    height: auto;
    max-height: 100vh;
    overflow: auto;
    padding: 0 0.6rem 0 0.3rem;
    background: #fff;
}
</style>
