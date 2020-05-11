<template>
    <div class="info_none_text_warp">
        <span class="info_none_text">{{message}}</span>
    </div>
</template>
<style lang="less">
.info_none_text_warp {
    display: flex;
    height: 0.9rem;
    font-size: 0.32rem;
    line-height: 0.4rem;
    justify-content: center;
    align-items: center;

    .info_none_text {
        margin-top: 0;
        padding-left: 0.6rem;
        color: #7f7f7f;
        display: inline-block;
        background: url("../resource/img/loading.gif") no-repeat left;
        background-size: contain;
    }
}
@media screen and (min-width: 550px) {
    .info_none_text_warp {
        font-size: 14px;
    }
}
</style>
<script>
export default {
    props: {
        message: {
            type: String,
            default: "数据加载中..."
        }
    }
};
</script>