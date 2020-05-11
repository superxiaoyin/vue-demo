<template>
  <div class="info_none_text_warp">
    <span class="info_none_text">{{tipsText}}</span>
  </div>
</template>

<script>
  export default {
    components: {},
    props: {
      tipsText: {
        type: String,
        default: '数据加载中...'
      }
    },
    data() {
      return {

      }
    },
    created() {

    },
    mounted() {

    },
    methods: {

    }
  }

</script>
<style scoped lang="less">
  @import '../../style/variables.less';

  .info_none_text_warp {
    text-align: center;
    height: 0.84rem;
    font-size: 0.24rem;
    line-height: 0.39rem;
  }

  .info_none_text {
    margin-top: 0.225rem;
    height: 0.39rem;
    text-align: center;
    padding-left: 0.51rem;
    color: #7f7f7f;
    display: inline-block;
    background: url(../resource/img/bpcompment/loading2.gif) no-repeat left;
    background-size: contain;
  }

</style>
