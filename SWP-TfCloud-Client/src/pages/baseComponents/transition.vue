<template>
  <div class="sn-main-con">
  <transition :name="transitionName">
    <router-view class="child-view"></router-view>
  </transition>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        transitionName: 'slide-left'
      }
    },
    beforeRouteUpdate (to, from, next) {
      let isBack = this.$router.isBack
      if (isBack) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
      this.$router.isBack = false
      next()
    }
  }
</script>

<style scoped lang="less">
@import '~components/style/common.less';
  .child-view {
    position: absolute;
    max-width: @max-content-width;
    min-height: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: 0 auto;
    overflow: auto;
    transition: all .3s cubic-bezier(.55,0,.1,1);
    -moz-transition: all .3s cubic-bezier(.55,0,.1,1);
    -webkit-transition: all .3s cubic-bezier(.55,0,.1,1);
    -o-transition: all .3s cubic-bezier(.55,0,.1,1);
  }
  .slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(50px, 0);
    transform: translate(50px, 0);
  }
  .slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-50px, 0);
    transform: translate(-50px, 0);
  }
</style>
