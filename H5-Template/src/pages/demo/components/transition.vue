<template>
    <div class="sn-main-con">
        <transition>
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
export default {
    data() {
        return {
            transitionName: "slide-fade"
        };
    },
    beforeRouteUpdate(to, from, next) {
        let isBack = this.$router.isBack;
        if (isBack) {
            this.transitionName = "slide-fade";
        } else {
            this.transitionName = "slide-fade";
        }
        this.$router.isBack = false;
        next();
    }
};
</script>
<style scoped>
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
    transition: all 0.3s ease;
}

.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to

/* .slide-fade-leave-active for below version 2.1.8 */
 {
    transform: translateX(10px);
    opacity: 0;
}
</style>