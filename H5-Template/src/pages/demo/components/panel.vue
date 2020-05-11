<template>
    <div>
        <SnButton @SnButtonClick="SnButtonClick">点击显示弹框</SnButton>
        <SnPanel v-model="showToast">
            <div class="panelContent" @click="SnPanelClickTwo">这里可以放任何内容</div>
        </SnPanel>
    </div>
</template>

<script>
import { SnButton, SnPanel } from "components/index.js";
export default {
    components: {
        SnButton,
        SnPanel
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
        },
        SnPanelClickTwo: function() {
            console.log(111);
            // this.showToast = false;
        }
    }
};
</script>
<style scoped lang="less">
.panelContent {
    text-align: center;
    position: absolute;
    top: 20%;
    left: 10%;
    width: 80%;
    background: #fff;
    padding: 20px;
}
</style>