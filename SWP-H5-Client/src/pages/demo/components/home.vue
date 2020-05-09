<template>
  <div style="overflow: hidden;">
    <group title="DemoList">
      <cell
        v-for="(el,index) in list"
        :key="index"
        :title="el.name"
        is-link
        :link="el.url"
        value="点击选择"
      ></cell>
    </group>
  </div>
</template>
<script>
import { Cell, Group } from "vux";
export default {
  components: {
    Cell,
    Group
  },
  data() {
    return {
      list: [
        {
          name: "代码示例",
          url: "/code"
        },
        {
          name: "数据加载中",
          url: "/loading"
        },
        {
          name: "空页面",
          url: "/empty"
        },
        {
          name: "按钮",
          url: "/btn"
        },
        {
          name: "toast",
          url: "/toast"
        },
        {
          name: "panel",
          url: "/panel"
        },
        {
          name: "表单",
          url: "/input"
        },
        {
          name: "列表",
          url: "/list"
        },
        {
          name: "单选",
          url: "/radio"
        },
        {
          name: "导航",
          url: "/tap"
        },
        {
          name: "时间选择",
          url: "/calendar"
        },
        {
          name: "时间区段选择",
          url: "/rangePicker"
        },
        {
          name: "SnModal弹窗",
          url: "/SnModal"
        },
        {
          name: "actionsheet",
          url: "/actionsheet"
        },
        {
          name: "sncell",
          url: "/sncell"
        }
      ]
    };
  },
  beforeCreate: function() {},
  created() {
    let _this = this;
  },
  mounted() {},
  methods: {}
};
</script>
