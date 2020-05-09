<template>
  <div class="handle-rent-confirm">
    <div class="content">
      <div class="safeBoxInfo">
        <div class="title">保管箱租用信息</div>
        <cell title="申请编号:" :value="safeBoxInfo.number"></cell>
        <cell title="保管箱规格:" :value="safeBoxInfo.size"></cell>
        <cell title="租用开始日期:" :value="safeBoxInfo.startDate"></cell>
        <cell title="租用结束日期:" :value="safeBoxInfo.endDate"></cell>
        <div class="total flex cont-rl">
          <label class="weui-label" style="width: 5.5em;">收费金额:</label>
          <div class="cont-rl" @click="moneyInfo()">
            <span>{{safeBoxInfo.total}}</span>
            <SnIcon type="clamation-circle-fill"/>
          </div>
        </div>
      </div>

      <div class="personInfo">
        <div class="title">个人信息</div>
        <cell title="姓名:" :value="cardInfo.name"></cell>
        <cell title="状态:" :value="cardInfo.type"></cell>
        <cell title="手机号码:" :value="cardInfo.phone"></cell>
        <cell title="身份证号码:" :value="cardInfo.number"></cell>
      </div>
    </div>

    <div class="footer button-on">
      <div class="btns"  @click="nextStep('rentWithDraw')">退租</div>
        <div class="btns" @click="nextStep('renewal')">续租</div>
      </div>
      <SnModal
        v-if="isShow"
        @SnCanclePop="SnCanclePop"
        @SnConfirmPop="SnConfirmPop"
        :title="title"
        :content="content"
        :btnType="btnType"
        @SnConfirmPopOnly="SnConfirmPopOnly"
      >
        <div slot="descriptionContent" class="description_content" v-if="isSlot">
          <p>1.姓名需与所持证件的姓名一致</p>
          <p>2.姓名中间不要输入空格或其他符号。</p>
          <p>3.少数民族的乘客，若需要购买火车票，需要输入姓名中的“·”,如“阿不都·买买提”；如需购买机票，可直接出入“阿卜杜买买提”。</p>
          <p>4.香港、台湾、澳门的护照不支持国内航班，请改用其他证件输入。</p>
        </div>
      </SnModal>
  </div>
</template>
<script>
import { Cell } from "vux";
import { SnIcon } from "sinosun-ui";
import { SnModal, SnPopup } from "components/index.js";
import { openRouterByValue } from "../../handler/handler";
export default {
  data() {
    return {
      safeBoxInfo: {
        number: 1,
        size:'大',
        startDate: "2020-02-09",
        endDate: "2020-02-09",
        total: 3333333
      },
      cardInfo: {
        name: "ss",
        type: "1",
        number: 123456789098765432,
        phone: "111111111111"
      },
      isShow: false,
      title: "",
      content: "",
      isSlot: false,
      btnType: "two"
    };
  },
  components: {
    Cell,
    SnIcon,
    SnModal,
    SnPopup
  },
  methods: {
    
    moneyInfo() {
      this.isShow = true;
      this.isSlot = true;
      this.title = "费用明细";
      this.btnType = "one";
    },
    SnConfirmPopOnly() {
      this.isSlot = false;
      this.isShow = false;
    },
    SnCanclePop() {
      this.isShow = false;
    },
    SnConfirmPop() {
      this.isShow = false;
    },
    nextStep(info) {
      if(info==='rentWithDraw'){
        this.title = "确认退租此保管箱吗？";
      }else if(info==='renewal'){
        this.title = "确认租用此保管箱吗？";
      }
      this.isShow = true;
      this.btnType = "two";
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "~components/style/common";
@import "~components/style/filex.less";
.handle-rent-confirm {
  .title {
    font-size: 0.36rem;
    font-weight: bold;
    padding: 10px 6px;
  }
  .content {
    padding-bottom: 100px;
  }
  .safeBoxInfo,.personInfo {
    padding: 10px;
    box-shadow: 10px 5px 12px 3px rgba(0, 0, 0, 0.06);
    margin: 12px;
    border-radius: 10px;
    padding-bottom: 0;
  }
  .safeBoxInfo {
    background: #fff;
    .total {
      padding: 0.24rem 0.3rem;
      border-top: solid 1px #ececec;
      margin-left: 12px;
      padding-left: 0.06rem;
    }
  }
  .personInfo {
    background: #fff;
    margin-top: 20px;
  }
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 99;
    width: 100%;
    height: 1.12rem;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.06);
    padding: 7px 0.3rem 0;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .btns {
      height: 0.8rem;
      width: 40%;
      line-height: 0.8rem;
      background: linear-gradient(132deg,rgba(255, 134, 109, 1) 0%,rgba(250, 65, 143, 1) 100%);
      border-radius: 40px;
      text-align: center;
      color: #fff;
      font-size: 0.32rem;
    }
  }
}
</style>
<style lang="less">
.handle-rent-confirm {
  .vux-label {
    width: 2.7rem !important;
  }
}
</style>