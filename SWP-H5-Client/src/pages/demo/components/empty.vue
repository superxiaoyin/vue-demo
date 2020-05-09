<template>
  <div>
    <SnLoading message="自定义语句……" v-if="isShow"></SnLoading>
    <SnEmpty :isShow="!isShow" icon="no-auth" tip="暂无权限" v-else :showBtn=true btnTips="自定义文字"></SnEmpty>
    <!-- <SnButton :showLoading="true" @SnButtonClick="SnButtonClick">转账</SnButton> -->
  </div>
</template>

<script>
import { SnLoading, SnEmpty, SnButton } from "components/index.js";
export default {
  components: {
    SnEmpty,
    SnLoading,
    SnButton
  },
  data() {
    return {
      isShow: true
    };
  },
  computed: {},
  beforeCreate: function() {},
  created() {
    setTimeout(() => {
      this.isShow = false;
    }, 500);
  },
  mounted() {},
  methods: {}
};
</script>