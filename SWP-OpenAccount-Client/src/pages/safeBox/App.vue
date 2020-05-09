<template>
  <router-view v-wechat-title="$route.meta.title"></router-view>
</template>

<script>
import "components/style/common.less";
export default {
  name: "safeBox",
  data() {
    return {
    };
  },
};
</script>
<style lang="less">
@import "~components/style/variables.less";
html {
  font-size: 10000/750vw;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
body {
  width: 100%;
  /*overflow: hidden;*/
}
</style>
