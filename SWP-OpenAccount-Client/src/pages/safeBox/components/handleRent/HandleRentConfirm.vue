<!--
 * @Description: 
 * @Author: ZhangChuan
 * @Date: 2020-04-23 19:28:51
 * @LastEditors: ZhangChuan
 * @LastEditTime: 2020-05-08 15:43:35
 -->


<template>
  <div class="handle-rent-confirm">
    <div class="content">
      <div class="safeBoxInfo">
        <div class="title">保管箱租用信息</div>
        <cell title="保管箱种类:" :value="safeBoxInfo.type[0].name"></cell>
        <cell title="租用开始日期:" :value="safeBoxInfo.currenDate"></cell>
        <cell title="租用结束日期:" :value="safeBoxInfo.endDate"></cell>
        <cell title="租期单位:" :value="safeBoxInfo.selectDateUnit"></cell>
        <cell title="租期:" :value="safeBoxInfo.rentDate"></cell>
        <div class="total flex cont-rl">
          <label class="weui-label" style="width: 5.5em;">收费金额:</label>
          <div class="cont-rl" @click="moneyInfo()">
            <span>{{safeBoxInfo.total}}</span>
            <SnIcon type="clamation-circle-fill" />
          </div>
        </div>
      </div>
      <div class="personInfo">
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
      <div>
        <div class="agreement flex jcenter">
          <i :class="agree?'agree_pre':'agree_nor'" @click="agree=!agree"></i>
          <span class="agree-text">同意</span>
          <a class="sn-pointer" @click="openProtocol">《保管箱租用协议》</a>
        </div>
      </div>
    </div>

    <div class="footer button-on">
      <div class="btns" @click="nextStep">下一步</div>
    </div>
    <SnModal
      v-if="isShow"
      @SnCanclePop="SnCanclePop"
      @SnConfirmPop="SnConfirmPop"
      :title="title"
      :content="content"
      :btnType="btnType"
      btnConfirmOne="确定"
      shadowColor="rgba(0, 0, 0, .5)"
      @SnConfirmPopOnly="SnConfirmPopOnly"
    >
      <div slot="descriptionContent" class="description_content" v-if="isSlot">
        <p>租金：111111</p>
        <p>保证金：222222</p>
      </div>
    </SnModal>
  </div>
</template>

<script>
import { Cell } from "vux";
import { SnIcon } from "sinosun-ui";
import { SnModal } from "components/index.js";
import {
  newOpenRouterByValue,
  setLocalData,
  getBusinessData,
  getServerDataH5,
  getLocalData,
  deleteLocalStorage
} from "../../../handler/handler";
import { showToast } from "sslib/common/extend";
import { SnInput } from "components";
export default {
  data() {
    return {
      safeBoxInfo: {
        type: [],
        currenDate: "2020-02-09",
        endDate: "2020-02-09",
        total: 3333333,
        selectDateUnit: "年",
        rentDate: 0
      },
      cardInfo: {
        name: "",
        type: "",
        number: "",
        address: "",
        phone: ""
      },
      agree: true,
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
    SnInput
  },

  created() {
    this.getCardInfo();
    let safeBoxInfo = getLocalData("safeBoxInfo");
    let phone = getBusinessData("phone");
    this.cardInfo.phone = phone;
    // if (cardInfo === null) {
    //   showToast("获取个人信息失败");
    //   newOpenRouterByValue.call(this, "handleRentOcr");
    //   return;
    // }
    if (safeBoxInfo === null) {
      showToast("获取保管箱信息失败");
      newOpenRouterByValue.call(this, "handleRentIndex");
      return;
    }
    this.safeBoxInfo = safeBoxInfo;
  },
  beforeRouteLeave(to, from, next) {
    if (to.name !== "handleRentAgreement") {
      if (getLocalData("safeBoxInfo") !== null) {
        deleteLocalStorage("safeBoxInfo");
      }
    }
    next();
  },
  methods: {
    /**
     * @description: 获取身份信息
     * @param :
     * @return:
     */
    getCardInfo() {},
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
      newOpenRouterByValue.call(this, "handleRentIndex");
    },
    SnConfirmPop() {
      this.isShow = false;
      // this.submits();
    },
    submits() {
      let _this = this;
      let {
        dataInfo,
        insureInfo,
        beInsureInfo,
        card,
        wxpay,
        loadingFlag
      } = _this;
      let param = {
        prodName: dataInfo.title,
        prodId: dataInfo.id,
        insureName: insureInfo.insureName,
        insureIdNo: insureInfo.insureIdNo,
        backInsureName: beInsureInfo.backInsureName,
        backInsureIdNo: beInsureInfo.backInsureIdNo,
        phone: insureInfo.phone,
        insuranceCount: 1,
        insuranceAmount: dataInfo.prices * 100,
        accountNo: card.nums,
        accountName: card.name,
        address: insureInfo.address,
        uaId: userInfo.UAId,
        lgParam: userInfo.lgParam,
        phone: phone,
        payChannel: wxpay ? "02" : "01"
      };
      loadingFlag = true;
      getServerDataH5(
        "/yqt/buyTicket/insurance.createOrder",
        param,
        "POST"
      ).then(result => {
        if (result.code == 0) {
          _this.wxpayinfo = result;
          setLocalData(phone, getBusinessData(phone));
          _this.OrderUpdata(result.outTradeNo).then(res => {
            if (res.code == 0) {
              _this.wxPayFn();
            }
          });
        }
      });
    },
    async OrderUpdata(tranSeq) {
      let parame = { tranSeq: tranSeq, phone: phone };
      let data = await getServerDataH5(
        "/yqt/buyTicket/insurance.updateOrderStat",
        parame,
        "POST"
      );
      return data;
    },

    wxPayFn() {
      let _this = this;
      let res = _this.wxpayinfo;
      // let url = '/wxpay/preService/payApi/getOAuthUrlPostURL';
      let url = res.payUrl;
      // console.log(res)
      let data = {
        outTradeNo: res.outTradeNo,
        merchantNo: res.merchantNo,
        terminalId: res.terminalId,
        totalAmount: res.totalAmount,
        storeId: res.storeId,
        businessParams: res.businessParams,
        goodsName: res.goodsName,
        userAgent: res.userAgent,
        merchantFrontNoticeUrl: res.merchantFrontNoticeUrl
      };

      axios
        .post(url, data)
        .then(function(response) {
          console.log(response);
          window.location.href = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    openProtocol() {
      newOpenRouterByValue.call(this, "handleRentAgreement");
    },
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
      this.isShow = true;
      this.btnType = "two";
      this.title = "确认租用此保管箱吗？";
    }
  }
};
</script>

<style lang="less" >
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
  .safeBoxInfo,
  .personInfo {
    padding-right: 10px;
    box-shadow: 10px 5px 12px 3px rgba(0, 0, 0, 0.06);
    margin: 12px 12px;
    border-radius: 10px;
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
  .agreement {
    display: flex;
    align-items: center;
    margin: 0.3rem;
    font-size: @fs-mob-smaller;
    .agree_pre {
      background: url("../../../../resource/img/icon_agree_pre.png") no-repeat
        center;
    }
    .agree_nor {
      background: url("../../../../resource/img/icon_agree_nor.png") no-repeat
        center;
    }
    .agree_pre,
    .agree_nor {
      display: inline-block;
      width: 0.24rem;
      height: 0.24rem;
      background-size: 0.24rem 0.24rem;
    }
    .agree-text {
      margin-left: 0.15rem;
      color: @fc-info;
    }
    a {
      color: #3891ff;
    }
  }
  .footer {
    .safeBox-footer();
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