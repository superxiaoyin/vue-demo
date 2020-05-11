<template>
  <div>
    <SnButton showLoading @SnButtonClick="SnButtonClick">转账</SnButton>
    <SnButton  @SnButtonClick="SnButtonClick" small>提交</SnButton>
    <SnButton  @SnButtonClick="SnButtonClick" type="one">确定</SnButton>
    <!-- <SnButton  @SnButtonClickBottom="SnButtonClickBottom" type="bottom">提交</SnButton> -->
    <!-- <SnButton  @SnButtonClickLeft="SnButtonClickLeft" @SnButtonClickRight="SnButtonClickRight" type="two"><span slot="left" >取消</span><span slot="right" >确定</span></SnButton> -->
    <!-- <SnButton  @SnButtonClickLeft="SnButtonClickLeft" @SnButtonClickRight="SnButtonClickRight" type="two" color="default"><span slot="left" >取消</span><span slot="right" >确定</span></SnButton> -->
    <!-- <SnButton  @SnButtonClickLeft="SnButtonClickLeft" @SnButtonClickRight="SnButtonClickRight" type="two" color="red"><span slot="left" >取消</span><span slot="right" >确定</span></SnButton> -->
    <!-- <SnButton  @SnButtonClickLeft="SnButtonClickLeft" @SnButtonClickRight="SnButtonClickRight" type="two" color="blue"><span slot="left" >取消</span><span slot="right" >确定</span></SnButton> -->
    <SnButton  @SnButtonClickLeft="SnButtonClickLeft" @SnButtonClickRight="SnButtonClickRight" type="text"><span slot="left">添加角色</span><span slot="right">添加角色组</span></SnButton>
    <!-- <SnButton  @SnButtonClickLeft="SnButtonClickLeft" @SnButtonClickCenter="SnButtonClickCenter" @SnButtonClickRight="SnButtonClickRight" type="three"><span slot="left" >添加角色</span><span slot="center" >添加子部门</span><span slot="right" >部门设置</span></SnButton> -->
  </div>
</template>

<script>
import { SnButton } from "components/index.js";
export default {
  components: {
    SnButton
  },
  data() {
    return {};
  },
  beforeCreate: function() {},
  created() {
    let _this = this;
  },
  mounted() {},
  methods: {
    SnButtonClick: function() {
      console.log('SnButtonClick');
    },
    SnButtonClickBottom: function() {
      console.log('SnButtonClickBottom');
    },
    SnButtonClickLeft: function() {
      console.log('SnButtonClickLeft');
    },
    SnButtonClickCenter: function() {
      console.log('SnButtonClickCenter');
    },
    SnButtonClickRight: function() {
      console.log('SnButtonClickRight');
    }
  }
};
</script>