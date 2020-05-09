<!--
 * @Description: 
 * @Author: ZhangChuan
 * @Date: 2020-04-10 17:58:44
 * @LastEditors: ZhangChuan
 * @LastEditTime: 2020-05-08 12:22:48
 -->


<template>
  <div class="handle-rent-index">
    <div class="content">
      <popup-picker
        title="保管箱种类"
        :data="typeList"
        :columns="2"
        v-model="type"
        @on-change="onChange"
        placeholder="请选择保险箱种类"
        show-name
      ></popup-picker>

      <cell title="租赁开始日期:" :value="currenDate"></cell>
      <cell title="租期单位:" :value="selectDateUnit"></cell>
      <x-number :value="rentDate" title="租期:" :fillable="true"></x-number>

      <div class="total flex cont-rl">
        <label class="weui-label" style="width: 5.5em;">收费金额(合计):</label>
        <div class="cont-rl" @click="moneyInfo()">
          <span>{{totalMoney}}</span>
          <SnIcon type="clamation-circle-fill" />
        </div>
      </div>
    </div>
    <div class="footer button-on">
      <div class="btns" @click="nextStep">下一步</div>
    </div>
    <SnModal
      v-if="isShow"
      @SnConfirmPopOnly="SnConfirmPopOnly"
      title="费用明细"
      content
      btnType="one"
      shadowColor="rgba(0, 0, 0, .5)"
      btnConfirmOne="确定"
    >
      <div slot="descriptionContent" class="description_content">
        <p>租金：{{Detailed.rental}}</p>
        <p>保证金：{{Detailed.earnestMoney}}</p>
      </div>
    </SnModal>
  </div>
</template>
<script>
import { SnIcon } from "sinosun-ui";
import common from "sslib/common/common.js";
import { Cell, PopupPicker, Calendar, Group, XNumber } from "vux";
import { SnModal, SnPopupList } from "components/index.js";
import {
  newOpenRouterByValue,
  setLocalData,
  getLocalData,
  deleteLocalStorage
} from "../../../handler/handler";
import { showToast } from "sslib/common/extend";
import { sendPost } from "sslib/common/HttpProtocol.js";
export default {
  data() {
    return {
      total: "",
      currenDate: "",
      endDate: "",
      list1: [["小米", "iPhone", "华为", "情怀", "三星", "其他", "不告诉你"]],
      type: [],
      selectDateUnit: "年",
      isShow: false,
      totalMoney: 0,
      Detailed: {
        rental: 1111,
        earnestMoney: 22222
      },
      rentDate: 1,
      dateUnit: [
        {
          name: "周",
          value: "W"
        },
        {
          name: "月",
          value: "M"
        },
        {
          name: "年",
          value: "Y"
        }
      ],
      typeList: [
        {
          name: "1",
          value: "china001",
          parent: 0
        },
        {
          name: "2",
          value: "china002",
          parent: 0
        },
        {
          name: "3",
          value: "china003",
          parent: 0
        },
        {
          name: "111天/台",
          value: "gz",
          parent: "china001"
        },
        {
          name: "112天/台",
          value: "gx001",
          parent: "china002"
        },
        {
          name: "113天/台",
          value: "gx001",
          parent: "china003"
        }
      ]
    };
  },
  components: {
    Calendar,
    Cell,
    PopupPicker,
    SnIcon,
    SnModal,
    SnPopupList,
    Group,
    XNumber
  },
  created() {
    console.log(new Date(2019, 3, 0).getDate());
    this.getSafeBoxType();
    this.getCost();
    this.getCurrentdate();
    if (getLocalData("cardInfo") !== null) {
      deleteLocalStorage("cardInfo");
    }
    if (getLocalData("safeBoxInfo") !== null) {
      deleteLocalStorage("safeBoxInfo");
    }
  },
  mounted() {},
  methods: {
    /**
     * @description:  获取保险箱种类
     * @param {type}
     * @return:
     */
    async getSafeBoxType() {
      try {
        let result = await sendPost(
          "GET",
          textUrl + "/SSP-HTTP/userTencent.getToken",
          {},
          "json"
        );
        if (!!result && result.code == 0) {
        } else {
          showToast("出错了，请重新操作。", "middle");
        }
      } catch (error) {}
    },

    /**
     * @description: 获取保管箱种类明细
     * @param :
     * @return:
     */
    getSafeBoxTypeInfo() {},
    //获取费用
    getCost() {},

    /**
     * @description: 选择日期后计算价格
     * @param : “2020-04-06”
     * @return:
     */

    // calculate(endDate, starDdate) {
    //   let newStarDate = Date.parse(new Date(starDdate));
    //   let newEndDate = Date.parse(new Date(endDate));
    //   let dates = Math.floor(newEndDate - newStarDate) / (1000 * 60 * 60 * 24);
    //   this.totalMoney = 111111;
    // },

    onChange() {
      console.log(this.type, 5555);
    },
    onChangeDateUnit() {
      this.getRentMoney();
    },
    /**
     * @description:获取保管箱租赁费用
     * @param :
     * @return:
     */
    getRentMoney() {
      this.totalMoney = 111111;
    },
    changes() {
      // this.calculate("2020-04-30", this.currenDate);
    },
    selectFlag() {},
    nextStep() {
     
      if (!this.type.length) {
        showToast("请选择保管箱种类");
        return;
      }
       let param = {
        type: this.safeBoxTypeFrt(),
        currenDate: this.currenDate,
        total: this.total,
        Detailed: this.Detailed,
        selectDateUnit: this.selectDateUnit,
        rentDate: this.rentDate
      };
      setLocalData("safeBoxInfo", param);
      newOpenRouterByValue.call(this, "handleRentConfirm");
    },
    /**
     * @description: 转换箱子类型数据
     * @param :
     * @return:
     */
    safeBoxTypeFrt() {
      let arry = [];
      this.typeList.forEach(el => {
        if (el.value === this.type[0]) {
          arry[0] = el;
        } else if (el.value === this.type[1]) {
          arry[1] = el;
        }
      });
      return arry;
    },
    getCurrentdate() {
      let date = new Date();
      let guid = new Common.GUID();
      this.currenDate = `${date.getFullYear()}-${guid.addZero(
        date.getMonth() + 1
      )}-${guid.addZero(
        date.getDate()
      )}`;
    },
    moneyInfo() {
      if (this.totalMoney) {
        this.isShow = true;
      }
    },
    SnConfirmPopOnly() {
      this.isShow = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~components/style/common.less";
@import "~components/style/filex.less";
.handle-rent-index {
  .content {
    background: #ffffff;
    padding: 0 10px 0 0;
    margin: 12px 12px;
    border-radius: 10px;
    box-shadow: 10px 5px 12px 3px rgba(0, 0, 0, 0.06);
  }
  .next-btn {
    position: fixed;
    width: 100%;
    bottom: 0;
  }
  .total {
    padding: 0.24rem 0.3rem;
    border-top: solid 1px #ececec;
    margin-left: 12px;
    padding-left: 0.06rem;
  }
  .footer {
    .safeBox-footer();
  }
}
</style>
<style lang="less">
.handle-rent-index {
  .weui-label,
  .sn-cell-label,
  .vux-label {
    width: 2.7rem !important;
  }
  .vux-number-selector {
    padding: 0 !important;
  }
  .vux-number-input {
    font-size: 0.32rem !important;
  }
}
</style>