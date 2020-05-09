<!--
 * @Description: 
 * @Author: ZhangChuan
 * @Date: 2020-04-13 11:19:57
 * @LastEditors: ZhangChuan
 * @LastEditTime: 2020-05-08 10:02:35
 -->

<template>
  <div class="handle-rent-personinfo">
    <div class="content">
      <div class="title">个人信息</div>

      <cell title="姓名:" :value="cardInfo.name"></cell>
      <cell title="证件类型:" :value="cardInfo.type"></cell>
      <cell title="证件号码:" :value="cardInfo.number"></cell>
      <cell title="身份证地址:" :value="cardInfo.address"></cell>
      <SnInput
        title="手机号码"
        type="number"
        text-align="right"
        v-model="cardInfo.phone"
        maxlength="11"
        placeholder="请输入手机号码"
      ></SnInput>
    </div>
    <div class="footer button-on">
      <div class="btns" @click="nextStep">下一步</div>
    </div>
  </div>
</template>

<script>
import { Cell } from "vux";
import { SnInput } from "components";
import {
  newOpenRouterByValue,
  setLocalData,
  getLocalData
} from "../../../handler/handler";
import { showToast } from "sslib/common/extend";
export default {
  data() {
    return {
      cardInfo: {
        name: "ss",
        type: "1",
        number: 123456789098765432,
        address: "少时诵诗书所四十岁少时诵诗书所四十岁所所所所所所所所所所",
        phone: ""
      }
    };
  },
  components: {
    Cell,
    SnInput
  },
  created() {
    // let cardInfo = getLocalData("cardInfo");
    // this.cardInfo = cardInfo;
    // console.log(JSON.parse(decodeURIComponent(this.$route.query.personInfo)).number);
  },
  methods: {
    nextStep() {
      let reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
      if (!this.cardInfo.phone) {
        showToast("请填写手机号");
        return;
      }
      if (!reg.test(this.cardInfo.phone)) {
        showToast("请输入正确手机号");
        return ;
      }
      setLocalData("cardInfo", this.cardInfo);
      newOpenRouterByValue.call(this, "handleRentConfirm");
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "~components/style/common";
@import "~components/style/filex.less";
.handle-rent-personinfo {
  .content {
    box-shadow: 10px 5px 12px 3px rgba(0, 0, 0, 0.06);
    background: #fff;
    // padding: 10px 10px;
    padding-bottom: 0;
    margin: 12px 12px;
    border-radius: 10px;
    padding-right: 10px;
  }
  .title {
    font-size: 0.36rem;
    font-weight: bold;
    padding: 10px 6px;
  }
  .footer {
    .safeBox-footer();
  }
}
</style>
<style lang="less">
.handle-rent-personinfo {
  .vux-label {
    width: 2.7rem !important;
  }
}
</style>