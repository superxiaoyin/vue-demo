<template>
    <div class="overflow-show" :class="{totalMoney:totalFlag}">
        <cell :title="title" value-align="left" v-if="readonly && isIos">
            <span ref="input" :value="formatMoney" :class="{colorRed:totalFlag}">{{formatMoney}}</span>
            <em
                class="payByCompanyOff"
                v-bind:class="{payByCompanyOn:cpyPayFlag}"
                v-if="cpyPayShowFlag"
                @click="choosedCpyPay"
            ></em>
            <!--公司代付-->
            <em
                class="adjustFlagPlus"
                v-bind:class="{adjustFlagMinus:balanceMinusFlag}"
                v-if="balanceShowFlag"
                @click="choosedAdjust"
            ></em>
            <!--银企对账调节金额-->
        </cell>
        <cell :title="title" value-align="left" v-else>
            <input
                ref="input"
                :relationFiledIds="relationFiledIds"
                :placeholder="placeholder"
                :readonly="readonly"
                :unitprice="unitprice"
                v-on:input="inputFrtValue($event.target.value)"
                v-on:focus="focusFrtValue($event.target.value)"
                v-on:blur="blurFrtValue($event.target.value)"
            >
            <em
                class="payByCompanyOff"
                v-bind:class="{payByCompanyOn:cpyPayFlag}"
                v-if="cpyPayShowFlag"
                @click="choosedCpyPay"
            ></em>
            <!--公司代付-->
            <em
                class="adjustFlagPlus"
                v-bind:class="{adjustFlagMinus:balanceMinusFlag}"
                v-if="balanceShowFlag"
                @click="choosedAdjust"
            ></em>
            <!--银企对账调节金额-->
        </cell>
        <div class="chooseMax" v-if="noMoney>0&&displayDiv>0" @click="chooseMax">无金额</div>
    </div>
</template>
<style lang="less" src="./SnMoney.less"></style>
<script>
import MoneyValidator from "../../../lib/validator/MoneyValidator.js";
import {
  moneyUppercase,
  insert_flg,
  showToast,
  getClass,
  sumStrings,
  moneyStringFixTwo,
  minusString
} from "../../../lib/common/extend.js";
import { TempletTypeData } from "../../../pages/approval/ApprovalConstantData.js";
import { Cell } from "vux";
export default {
  components: {
    Cell
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    value: {
      type: Number
    },
    relationFiledIds: {
      type: String
    },
    placeholder: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    },
    noMoney: {
      //无金额下拉框显示
      type: Number,
      default: 0
    },
    summationFlag: {
      //累加标识  如果有累加标识则表明模板中有总计与总计大写字段
      type: Boolean,
      default: false
    },
    totalFlag: {
      //总计标识  必填
      type: Boolean,
      default: false
    },
    isInDetailFlag: {
      //是否明细组件 默认为否
      type: Boolean,
      default: false
    },
    idx: {
      //组件的index
      type: Number
    },
    fieldKey: {
      //组件的key
      type: String
    },
    unitprice: {
      //采购模板单价标示，默认为否
      type: Boolean,
      default: false
    },
    ssDiaryFlag: {
      //二级明细标识
      type: Boolean,
      default: false
    },
    cpyPayShowFlag: {
      //公司代付标识 默认为false
      type: Boolean,
      default: false
    },
    cpyPayFieldKey: {
      //公司代付key
      type: String
    },
    cpyPayFlag: {
      type: Boolean,
      default: false
    },
    balanceMinusFlag: {
      //银企对账调节金额减标识 默认为false（加）
      type: Boolean,
      default: false
    },
    balanceShowFlag: {
      //银企对账调节金额加减显示标识 默认为false
      type: Boolean,
      default: false
    },
    batchFlag: {
      //是否批量转账
      type: Boolean,
      default: false
    },
    templetType: {
      type: String,
      default: ""
    }
  },
  data: function() {
    return {
      displayDiv: 0,
      inputFlag: false, //输入标识
      isIos: false,
      formatMoney: "0.00元"
    };
  },
  beforeCreate: function() {},
  created: function() {
    this.isIos = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
  },
  mounted: function() {
    if (this.value) {
      this.value = this.value + "";
      if (this.value.replace(/0/g, "")) {
        //存在value,显示value  供存草稿使用

        if ("-1" == this.value) {
          this.$refs.input.value = "无金额";
        } else {
          this.$refs.input.value = MoneyValidator.format(
            insert_flg(this.value, ".", this.value.length - 2)
          );
        }
      }
      this.formatMoney = this.$refs.input.value;
    } else {
      this.setZeroValue("difference");
    }
  },
  updated: function() {},
  methods: {
    /**
     * input输入时对数据进行格式化
     * @param {Object} value
     */
    inputFrtValue: function(value) {
      if (this.readonly) {
        return;
      }
      var result = MoneyValidator.parse(value); //格式化金额，不允许输入非数字字符
      this.$refs.input.value = result;

      //负号前缀
      var minus = "";
      if (this.balanceMinusFlag) {
        minus = "-";
      }
      if ("" == result) {
        this.$emit("input", ""); //生成发送给服务器的数据   向父组件发送input事件
      } else {
        this.$emit(
          "input",
          minus + MoneyValidator.format(result).replace(/[^\d]/g, "")
        ); //生成发送给服务器的数据   向父组件发送input事件
      }

      this.inputFlag = true;
      this.genRelationValue(result); //生成关联组件数据
      if (result == "") {
        this.displayDiv = 1;
      } else if (result != "无金额") {
        this.displayDiv = 0;
      }
      //采购的数量和单价的特殊处理，计算总价
      if (this.unitprice) {
        var amountId = "9"; //数量fieldKey
        var totalPriceId = "10"; //总价fieldKey
        var amountValue = this.$root.$refs.inDetail[0].$refs[amountId][this.idx]
          .value;
        var totalPrice = 0;
        for (var i = 0; i < amountValue; i++) {
          totalPrice = sumStrings(
            totalPrice,
            MoneyValidator.format(result).replace(/[^\d]/g, "")
          );
        }
        this.$root.$refs.inDetail[0].$refs[totalPriceId][
          this.idx
        ].value = totalPrice;
        this.$root.$refs.inDetail[0].$refs[totalPriceId][this.idx].$emit(
          "input",
          totalPrice
        );
      }
    },
    /**
     * 获取焦点时对数据进行格式化
     */
    focusFrtValue: function(value) {
      if (this.readonly) {
        return;
      }
      this.inputFlag = true;
      if (value == "") {
        this.displayDiv = 1;
      } else if (value != "无金额") {
        var regx = /[\u4E00-\u9FA5]|,/g; //去掉非数字字符
        this.$refs.input.value = value.replace(regx, "");
        this.displayDiv = 0;
      }
    },
    /**
     * 失去焦点时对数据进行格式化
     */
    blurFrtValue: function(value) {
      if (this.readonly) {
        return;
      }
      this.inputFlag = false;
      if (value && value != "无金额") {
        this.$refs.input.value = MoneyValidator.format(value); //格式化显示数据
      } else if (value == "") {
        setTimeout(() => {
          this.displayDiv = 0;
        }, 150);
      }
    },
    chooseMax: function chooseMax() {
      this.$emit("input", -1);
      this.$refs.input.value = "无金额";
      this.genRelationValue(this.$refs.input.value); //生成关联组件值
      this.displayDiv = 0;
    },
    /**
     * 根据控件值生成关联字段值   针对大写  需要添加总计   需要扩展为对应的函数处理
     * @param {Object} value
     */
    genRelationValue: function(value) {
      var _this = this;
      //差额
      if (this.relationFiledIds && "difference" == this.relationFiledIds[0]) {
        this.calMinusData(value, this.relationFiledIds);
        return;
      }
      //相符，银行余额跟随单位余额变化
      if (this.relationFiledIds && "bankRemain" == this.relationFiledIds) {
        var companyRemain = this.$root.content.companyRemain;
        this.$root.content[this.relationFiledIds] = companyRemain;
        this.setDisplayValue(companyRemain, this.relationFiledIds);
        return;
      }
      if (
        this.$root.$refs[this.relationFiledIds] || //存在关联字段  现在仅仅针对金额大写  需要对总计进行处理
        "subValue" == this.relationFiledIds
      ) {
        //兼容差旅二级页面
        var relationValue = "零元";
        var displayValue = "零元";

        if (
          this.summationFlag ||
          _this.$root.templetType == TempletTypeData.TEXAPPLY_TEMPLETTYPE
        ) {
          //累加标识  针对总计
          this.summation(); //数据累加，生产传递给服务器的数据

          if (_this.$parent.$refs.moneyBig) {
            var moneyBig = "";
            if ("无金额" == value) {
              //生成关联组件的值  现阶段主要针对大写
              moneyBig = "无金额";
            } else {
              moneyBig = moneyUppercase(
                MoneyValidator.format(value).replace(/[^\d]/g, "")
              );
            }

            _this.$parent.$refs.moneyBig[_this.idx].value = moneyBig;
            _this.$root.content.inDetail[_this.idx].moneyBig = moneyBig;
          }
        } else {
          if ("无金额" == value) {
            //生成关联组件的值  现阶段主要针对大写
            relationValue = "无金额";
          } else {
            relationValue = moneyUppercase(
              MoneyValidator.format(value).replace(/[^\d]/g, "")
            );
          }
          this.$root.content[this.relationFiledIds] = relationValue; //传递给服务器
          displayValue = relationValue;
          this.setDisplayValue(displayValue, this.relationFiledIds); //设置显示值
        }
      }
    },
    /**
     * 设置关联组件显示值
     * @param {Object} value
     */
    setDisplayValue: function(displayValue, ref) {
      //判断$refs是数组还是对象  数据显示
      var _root = this.$root.$refs;
      if (this.ssDiaryFlag) {
        //二级明细
        _root = this.$parent.$parent.$refs;
      }
      //如果_root下没有这个组件，则向上查找父组件下的该组件  兼容 差额计算 后续需要优化为统一处理
      if ("difference" == ref) {
        _root[ref] = this.$parent.$refs[ref];
      }
      //兼容银企对账相符，银行余额跟随单位余额变化
      if ("bankRemain" == ref) {
        _root[ref] = this.$parent.$refs[ref];
      }
      if (_root[ref]) {
        if (getClass(_root[ref]) == "Array") {
          //数组
          _root[ref][0].value = displayValue; //显示数据
        } else {
          //input元素
          _root[ref].value = displayValue;
        }
      }
    },
    /**
     * 数据累加   需要判断是否为公司代付
     * @param {Object} delInDetailIndex  明细删除索引
     * @param {Object} size   明细大小
     * @param {Object} delFlag   删除标识
     */

    summation: function(delInDetailIndex, size, delFlag) {
      var content = this.$root.content;
      var $refs = this.$root.$refs;
      if (this.ssDiaryFlag) {
        //二级明细
        content = this.$parent.$parent.travel; //有问题 导致多个小计均计算
        $refs = this.$parent.$parent.$refs;
        if (this.cpyPayFlag || delFlag) {
          this.calCpyPay();
        }
        //计算个人实付
        this.calPersonPay();
      }
      var fieldKey = this.fieldKey;
      var relationFiledIds = this.relationFiledIds;
      var result = this.calSummation(content, fieldKey);
      //				content[relationFiledIds] = result;//发送给服务器
      if (getClass($refs[this.relationFiledIds]) == "Array") {
        $refs[this.relationFiledIds][0].$emit("input", result); //总计的显示需要加上$emit('input')的设置，才能解决采购的总计bug
      } else {
        $refs[this.relationFiledIds].$emit("input", result);
      }
      this.setDisplayValue(
        0 == result ? "" : moneyStringFixTwo(result),
        relationFiledIds
      ); //数据显示
      //大写
      if (this.$root.$refs[relationFiledIds + "Big"]) {
        var refBig = moneyUppercase(
          moneyStringFixTwo(result).replace(/[^\d]/g, "")
        );
        content[relationFiledIds + "Big"] = refBig;
        this.setDisplayValue(refBig, relationFiledIds + "Big");
      }
    },
    /**
     * 计算累加
     * @param {Object} obj        累加的对象
     * @param {Object} fieldKey   累加的字段
     */
    calSummation: function(obj, fieldKey) {
      var _this = this;
      var result = 0;
      var length = (obj.inDetail || {}).length;
      //如果length存在，则需要累计到总计里面的金额是在明细里面的，
      if (_this.$root.templetType == TempletTypeData.TEXAPPLY_TEMPLETTYPE) {
        //需要累计到总计里面的金额是在明细外面  例如缴税申请模板  zc 20180808
        _this.$root.fieldList.forEach(function(item) {
          if (item.summationFlag == true) {
            result = sumStrings(result, obj[item.fieldKey]);
          }
        });
      } else {
        for (var i = 0; i < length; i++) {
          //针对总计
          if (obj.inDetail[i][fieldKey]) {
            //控件本身   需要加上其他需要累加的控件
            result = sumStrings(result, obj.inDetail[i][fieldKey]);
          }
          //加上其他所有需要累加的控件  暂时针对二级明细
          result = this.calSSDSub(this.$parent, obj.inDetail[i], result);
        }
      }
      //总计金额长度限制，Bug 24097
      if (result.length > 16) {
        //暂时只给出提示
        var toastMsg = "报销";
        if (_this.templetType == TempletTypeData.BATCHTRANSFER_TEMPLETTYPE) {
          toastMsg = "转账";
        }
        showToast("总计金额已超出可" + toastMsg + "范围", "middle");
      }

      return result;
    },
    /**
     * 计算公司代付
     * @param {Object} data  数据
     */
    calCpyPay: function(data) {
      var obj = this.$parent.$parent.travel;
      this.calToPay(obj, "payByCompanySubValue", true);
    },
    /**
     * 计算代付
     * @param {Object} obj         计算对象
     * @param {Object} sumFieldKey 总计key
     * @param {Object} cpyFlag     公司代付标识
     */
    calToPay: function(obj, sumFieldKey, cpyFlag) {
      var length = obj.inDetail.length;
      var sum = 0;

      for (var i = 0; i < length; i++) {
        if (this.ssDiaryFlag) {
          this.$parent.inDetailList.forEach(function(item) {
            var addFlag = false;
            if (cpyFlag) {
              addFlag =
                item.summationFlag &&
                obj.inDetail[i][item.fieldKey + "_payByCompanyFlag"];
            } else {
              addFlag =
                item.summationFlag &&
                !obj.inDetail[i][item.fieldKey + "_payByCompanyFlag"];
            }
            if (addFlag) {
              sum = sumStrings(sum, obj.inDetail[i][item.fieldKey]);
            }
          });
        }
      }

      obj[sumFieldKey] = sum;
      this.setDisplayValue(0 == sum ? "" : moneyStringFixTwo(sum), sumFieldKey); //数据显示
    },
    /**
     * 计算个人实付
     */
    calPersonPay: function() {
      var obj = this.$parent.$parent.travel;
      this.calToPay(obj, "payByMyselfSubValue", false);
    },
    /**
     * 计算二级明细
     * @param {Object} dom
     * @param {Object} sum
     */
    calSSDSub: function(dom, obj, sum) {
      var _this = this;
      if (this.ssDiaryFlag) {
        dom.inDetailList.forEach(function(item) {
          if (item.summationFlag && item.fieldKey != _this.fieldKey) {
            sum = sumStrings(sum, obj[item.fieldKey]);
          }
        });
      }
      return sum;
    },
    /**
     * 选中公司代付
     */
    choosedCpyPay: function() {
      var obj = this.$parent.$parent.travel;
      var payKey = this.fieldKey + "_payByCompanyFlag";
      if (this.cpyPayFlag) {
        this.cpyPayFlag = false; //需要给对应的值赋值
        //公司代付
        obj.inDetail[this.idx][payKey] = 0;
      } else {
        this.cpyPayFlag = true;
        obj.inDetail[this.idx][payKey] = 1;
      }
      //计算公司代付
      this.calCpyPay();

      //计算个人实付
      this.calPersonPay();
    },
    /**
     * 选中调节金额加减标识  ，需要将调节金额转换为正负传递给服务器
     */
    choosedAdjust: function() {
      var minus = "";
      if (this.balanceMinusFlag) {
        //如果为减
        this.balanceMinusFlag = false; //转为加
        //将传递给父组件的数据修改为负数
        this.value = (this.value + "").replace(/[^\d]/g, "");
        minus = "";
        this.$root.content.adjustFlagStr = "加";
      } else {
        this.balanceMinusFlag = true; //转为减
        this.$root.content.adjustFlagStr = "减";
        minus = "-";
      }
      if (this.value) {
        this.$emit("input", minus + this.value);
      }
    },
    /**
     * 计算相减后的数据
     * @param {Object} value
     * @param {Object} relationFiledIds
     */
    calMinusData: function(value, relationFiledIds) {
      // 差额显示id
      var showFiledId = relationFiledIds[0];
      var bankRemain = "";
      // 兼容旧数据
      if (relationFiledIds.length > 1) {
        // 相减id
        var calFiledId = relationFiledIds[1];
        bankRemain = this.$root.content[calFiledId];
      } else {
        bankRemain = this.$root.content.bankRemain;
      }
      var result = minusString(
        bankRemain,
        MoneyValidator.format(value).replace(/[^\d]/g, "")
      );
      this.$root.content[showFiledId] = result || 0; //金额控件中的复制在watch中完成
      this.setDisplayValue(moneyStringFixTwo(result), showFiledId);
    },
    /**
     * 设置零值显示值
     */
    setZeroValue: function(fieldKey) {
      if (fieldKey == this.fieldKey) {
        this.$refs.input.value = "0.00元";
      }
    }
  },
  watch: {
    value: function(newVal, oldVal) {
      //监听value的变化，主要针对金额控件新增与删除
      if (this.totalFlag) {
        //处理明细删除
        this.$refs.input.value = moneyStringFixTwo(
          (this.value + "").replace(/[^\d]/g, "")
        );
        this.formatMoney = moneyStringFixTwo(
          (this.value + "").replace(/[^\d]/g, "")
        );
        return;
      }
      if (this.value && !this.inputFlag) {
        //判断金额时，应该判断是否存在 例如undefined与''不应该直接使用对象来判断，这样会过滤掉0的情况
        if (-1 == this.value) {
          //无金额情况
          this.$refs.input.value = "无金额";
          this.formatMoney = "无金额";
          return;
        }
        if (0 == parseFloat(this.value) && parseFloat(oldVal) != 0) {
          //Bug 25684 发起银企对账不相符表单，在单位余额字段输入“0”，再输入调节单位余额，原输入的单位余额消失不可见
          this.$refs.input.value = "";
          this.setZeroValue("difference");
          this.formatMoney = "";
          return;
        }
        this.$refs.input.value = moneyStringFixTwo(
          (this.value + "").replace(/[^\d]/g, "")
        );
        this.formatMoney = moneyStringFixTwo(
          (this.value + "").replace(/[^\d]/g, "")
        );
      } else if (!this.value) {
        //值不存在则置空
        this.$refs.input.value = "";
        this.setZeroValue("difference");
        this.formatMoney = "";
      }
      //采购总价数据改后后，需要计算总计金额
      if (this.summationFlag && !this.batchFlag) {
        this.genRelationValue(this.value); //生成关联组件数据
      }
    }
  }
};
</script>