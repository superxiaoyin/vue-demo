<template>
  <div class="introduction">
    <div class="content">保险箱业务介绍</div>
    <SnButton @SnButtonClick="nextStep">下一步</SnButton>
  </div>
</template>
<script>
import { throttle, showToast } from "sslib/common/extend";
import {
  openRouterByValue,
  setBusinessData,
  getServerDataH5
} from "../../handler/handler";
import { SnText, SnIDCard } from "biscomponents";
import { SnButton } from "components";
export default {
  data() {
    return {};
  },
  components: {
    SnButton
  },
  mounted: function() {
    let _this = this;
  },
  created() {
    let _this = this;
    _this.init();
  },
  methods: {
    init() {
      let _this = this;
    },
    nextStep() {
      let _this = this;
      openRouterByValue("reservation", {}, _this);
    }
  }
};
</script>
<style lang="less">
@import "~components/style/common.less";
.introduction {
}
</style>
