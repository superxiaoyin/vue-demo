<template>
    <router-view/>
</template>
<script>
export default {
    name: "demo"
};
</script>
<style lang="less">
@import "~style/common.less";
.weui-cell {
    background-color: #fff;
    font-size: 14px;
    padding: 14px 15px;
}
.weui-cell:before {
    border-top: 1px solid #e5e5e5;
}
.weui-cells:after {
    border-bottom: 1px solid #e5e5e5;
}
.weui-label,
.vux-label {
    width: 1.9rem !important;
    padding-right: 0.3rem;
}
.vux-tab .vux-tab-item.vux-tab-selected {
    color: #478aee;
    border-bottom: 1px solid #478aee;
}
::-webkit-input-placeholder {
    color: #c2c2c2;
    font-size: 14px;
}
.weui-cell_access .weui-cell__ft {
    padding-right: 0.34rem;
}
.weui-cell__ft {
    color: #c2c2c2;
}
.weui-cell_access .weui-cell__ft:after {
    border-color: #c2c2c2;
    height: 0.16rem;
    width: 0.16rem;
}
.weui-toast__content {
    font-size: 14px;
}

// 后来加上的
.weui-cells__title {
    margin: 0;
    line-height: 0.6rem;
}
@media screen and (max-width: @pc-width) {
    .weui-cell,
    .weui-cells,
    .weui-cells__title {
        font-size: 0.32rem;
    }
    .weui-cell {
        padding: 0.24rem 0.3rem;
    }
    ::-webkit-input-placeholder {
        font-size: 0.32rem;
    }
    .vux-tab .vux-tab-item {
        font-size: 0.32rem;
    }
}
</style>