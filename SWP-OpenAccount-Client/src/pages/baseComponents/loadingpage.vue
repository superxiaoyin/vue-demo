<template>
    <div class="loading-toast">
        <i class="icon-loading"></i>
        <p class="loading-content">加载中...</p>
    </div>
</template>
<script>
export default {

}
</script>
<style lang="less" scoped>
    .loading-toast{
        background: hsla(0,0%,7%,.7);
        z-index: 5001;
        position: fixed;
        top: 50%;
        left: 50%;
        margin: -1.2rem 0 0 -1.2rem;
        width: 2.4rem;
        height: 2.4rem;  
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-radius: 5px;
        color: #eee;
        .icon-loading{
            display: block;
            width: 30%;
            height: 30%;
            background: url('../../resource/img/loading.gif') no-repeat center;
            background-size: cover;
            margin-bottom: .2rem;
        }
    }
</style>
