<template>
  <div class="sn-action-sheet">
    <SnButton @SnButtonClick="showASCommonfun" type="one">基本操作</SnButton>
    <SnButton @SnButtonClick="showASSelectfun" type="one">actionsheet单选效果</SnButton>

    <sn-cell :title='title'  @clickSnCell='clickSnCell' isLink  value-align='left'></sn-cell>
    <!-- 一般使用 -->
    <SnActionSheet
      v-model="showActionSheetCommon"
      :menu="menu2"
      :showCancel="showCancel"
      :descriptionText="descriptionText"
      @on-click-menu="showMenuItem"
      @on-click-menu-cancel="cancleFun"
      @on-after-hide="log('隐藏后')"
      @on-after-show="log('显示后')"
    ></SnActionSheet>
    <!-- 单选效果 -->
    <div v-transfer-dom>
      <SnActionSheet
        v-model="showActionSheetSelect"
        :menu="menu1"
        :titleLabel='title'
        :showSelectedEffect="true"
        @on-click-menu="showMenuItem"
        @on-click-menu-cancel="cancleFun"
        @on-after-hide="log('隐藏后')"
        @on-after-show="log('显示后')"
      ></SnActionSheet>
    </div>
  </div>
</template>

<script>
import { SnActionSheet, SnButton,SnCell } from "components/index.js";
import { TransferDom } from 'vux';
export default {
  components: {
    SnActionSheet,
    SnButton,
    SnCell
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      title:'请选择',
      descriptionText: "辅助说明文字",
      showCancel: true,
      showActionSheetSelect: false,
      showActionSheetCommon: false,
      menu1: [
        {
          label: "按钮文字1"
        },
        {
          label: "按钮文字2"
        },
        {
          label: "按钮文字3"
        },
        {
          label: "按钮文字4"
        }
      ],
      menu2: [
        {
          label: "分享好友",
          type: "primary"
        },
        {
          label: "分享朋友圈",
          type: "warn"
        },
        {
          label: "disabled",
          type: "disabled"
        },
        {
          label: "删除",
          type: "default"
        }
      ]
    };
  },
  beforeCreate: function() {},
  created() {},
  mounted() {},
  methods: {
    log(str) {
      console.log(str);
    },
    showASfun() {
      this.showActionSheet = true;
    },
    cancleFun() {
      this.showActionSheetSelect = false;
      this.showActionSheetCommon = false;
    },
    showMenuItem(menuIndex, menuItem) {
      console.log("menuIndex", menuIndex);
      console.log("menuItem", menuItem);
      this.title = menuItem.label
    },
    showASSelectfun() {
      this.showActionSheetSelect = true;
    },
    showASCommonfun() {
      this.showActionSheetCommon = true;
    },
    clickSnCell(){
      console.log(123)
      this.showActionSheetSelect=true
    }
  }
};
</script>


