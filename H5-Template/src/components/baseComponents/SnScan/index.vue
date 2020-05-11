<template>
    <div class="sn-scan">
        <cell :title="title" value-align="left" class="in_cell">
            <slot></slot>
        </cell>
        <a class="sn-scan-icon"></a>
        <!-- <a class="sn-scan-icon" @click="scancode"></a> -->
    </div>
</template>

<script>
import { QrcodeScan } from '../../../lib/common/SnJsBridge.js';
import { Cell } from 'vux';
export default {
    components: {
        Cell,
        QrcodeScan
    },
    data() {
    },
    props: {
        title: {
            type: String,
            default: "",
        }
    },

    computed: {},

    mounted() { },

    methods: {
        scancode() {
            let _this = this;
            QrcodeScan().then(function (res) {
                _this.$emit("onScan", res);
            })
        },
    }
}

</script>
<style lang='less'>
@import "./index.less";
</style>