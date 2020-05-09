<template>
    <div>
        <SnButton @SnButtonClick="SnButtonClick">点击显示弹框</SnButton>
        <SnToast content="提示文本" v-model="showToast"></SnToast>
    </div>
</template>

<script>
import { SnButton, SnToast } from "components/index.js";
export default {
    components: {
        SnButton,
        SnToast
    },
    data() {
        return {
            showToast: false
        };
    },
    beforeCreate: function() {},
    created() {
        let _this = this;
    },
    mounted() {},
    methods: {
        SnButtonClick: function() {
            this.showToast = true;
        }
    }
};
</script>