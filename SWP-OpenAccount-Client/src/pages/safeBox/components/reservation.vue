<template>
  <div class="reservation-main">
    <div class="reservation-info">
      <SnText
        class="sn-text"
        title="用户名"
        text-align="left"
        :maxlength="10"
        placeholder="请输入用户名"
        v-model="dataInfo.username"
      ></SnText>
      <SnText
        class="sn-text"
        title="接送地址"
        text-align="left"
        :maxlength="10"
        placeholder="请输入接送地址"
        v-model="dataInfo.address"
      ></SnText>
      <Cell title="接送时间">
        <DateTimePicker mode="datetime" v-model="dataInfo.date" placeholder="请选择" />
      </Cell>
      <div class="borderTip"></div>
      <SnTel
        title="联系电话"
        :maxlength="11"
        text-align="left"
        v-model="dataInfo.phonenum"
        placeholder="请输入联系电话"
      ></SnTel>
      <SnVerifyCode
        ref="verifyCode"
        title="验证码"
        :maxlength="6"
        text-align="left"
        :phone-num="dataInfo.phonenum"
        @getending="getendingfun"
        v-model="dataInfo.code"
        placeholder="请输入验证码"
      ></SnVerifyCode>
    </div>
    <SnButton @SnButtonClick="submit">立即预约</SnButton>
  </div>
</template>
<script>
import { throttle, showToast } from "sslib/common/extend";
import {
  openRouterByValue,
  setBusinessData,
  getServerDataH5
} from "../../handler/handler";
import { Group, Cell } from "vux";
import { SnButton, SnCalendar } from "components";
import { SnVerifyCode, SnTel, SnText, SnIDCard } from "biscomponents";
const { DateTimePicker, DateTimePickerView } = SnCalendar;
export default {
  data() {
    return {
      dataInfo: {
        username: "",
        address: "",
        phonenum: "",
        code: "",
        date: ""
      }
    };
  },
  components: {
    SnButton,
    SnText,
    SnVerifyCode,
    SnTel,
    DateTimePicker,
    Group,
    Cell
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
      _this.phone = _this.$route.query.phone;
    },
    nextStep() {
      let _this = this;
    },
    getendingfun(data) {
      let _this = this;
      if (data) {
        let param = {
          userPhone: _this.dataInfo.phonenum,
          vType: 12
        };
        getServerDataH5(
          textUrl + "/SSP-HTTP/user.getVerifyCode",
          param,
          "GET"
        ).then(result => {
          if (result.code === 0) {
            _this.verifyCodeFlag = true;
          }
        });
      }
    },
    async submit() {
      let _this = this;
      if (!_this.dataInfo.username) {
        showToast("请输入用户名");
        return;
      }
      if (!_this.dataInfo.address) {
        showToast("请输入接送地址");
        return;
      }
      if (!_this.dataInfo.date) {
        showToast("请选择预约时间");
        return;
      }
      if (!_this.dataInfo.phonenum) {
        showToast("请输入正确的手机号");
        return;
      }
      if (!_this.dataInfo.code && _this.dataInfo.code.length !== 6) {
        showToast("请输入正确的验证码");
        return;
      }
      const param = _this.dataInfo;
      // const result = await getServerDataH5(
      //   textUrl + "/SSP-HTTP/user.getVerifyCode",
      //   param,
      //   "GET"
      // );
      // if (result.code === 0){
      openRouterByValue(
        "result",
        {
          result: encodeURIComponent(JSON.stringify(param)),
          phone: _this.phone
        },
        _this
      );
      // }
    }
  }
};
</script>
<style lang="less">
@import "~components/style/common.less";
.reservation-main {
  .reservation-info {
    margin-top: 0.3rem;
    background: @color-white;
    .verify-title {
      color: @fc-info;
      font-size: @fs-mob-small;
      padding: 0.3rem 0.3rem 0.15rem 0.3rem;
    }
    .snVerifyCode {
      background: @color-white;
      .button-detail {
        background: none !important;
        border-radius: 0.3rem !important;
        border: 1px solid @color-blue;
        color: @color-blue !important;
      }
    }
    .vux-cell-primary {
      flex: none;
    }
    .borderTip {
      background: #f6f6f6;
      height: 0.3rem;
      line-height: 0.3rem;
    }
  }
}
.sn-calendar-pane-month .day .today.active,
.sn-calendar-pane-month .day .active {
  background-color: #e8422e;
}
.sn-calendar-header,
.sn-calendar-header .sn-calendar-tabs-item.active {
  color: #e8422e;
}
.sn-calendar-header .sn-calendar-tabs-item.active:after {
  background-color: #e8422e;
}
</style>
