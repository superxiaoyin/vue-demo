<template>
    <div>
        <cell :title="title" value-align="left">
            <input
                ref="input"
                :style="inputStyle"
                :relationFiledIds="relationFiledIds"
                :maxlength="maxlength"
                :minlength="minlength"
                :placeholder="placeholderSet"
                :readonly="readonly"
                :fieldkey="fieldkey"
                :autocomp="autocomp"
                v-on:input="inputNumFrtValue($event.target.value)"
                v-on:focus="focusNumFrtValue($event.target.value)"
                v-on:blur="blurNumFrtValue($event.target.value)"
            />
        </cell>
    </div>
</template>
<script>
import "./SnNumber.less";
import MoneyValidator from "../../../lib/validator/MoneyValidator.js";
import AttendanceHandler from "../../../pages/attendance/AttendanceHandler.js";
import { getClass } from "../../../lib/common/base.js";
import {
    prefixInteger,
    stringFixTwoWithType,
    sumStrings,
    pad, showToast
} from "../../../lib/common/extend.js";
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
        maxlength: {
            type: Number
        },
        minlength: {
            type: Number
        },
        readonly: {
            type: Boolean,
            default: false
        },
        unit: {
            type: String,
            default: ""
        },
        pointlength: {
            type: Number,
            default: 0
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
        fieldkey: {
            type: String,
            default: ""
        },
        autocomp: {
            //采购模板数量标示，默认为否
            type: Boolean,
            default: false
        },
        snFormat: {
            //是否格式化
            type: Number
        },
        beforeFlowId: {
            type: Number,
            default: 0
        },
        elementFlag: {
            type: Number,
            default: 0
        },
        textAlign: {
            type: String,
            default: 'left'
        }
    },
    data: function () {
        return {
            value: "",
            inputFlag: false, //输入标识
            placeholderSet: "",
            computeDays: 0
        };
    },
    computed: {
        inputStyle() {
            if (this.textAlign) {
                return {
                    textAlign: this.textAlign
                }
            }
        },
    },
    created: function () {
        this.placeholderSet = this.placeholder;
    },
    mounted: function () {
        //存在value,显示value  供存草稿使用
        if (this.value || this.value == 0) {
            if (this.pointlength == 2) {
                //如果有小数点并且是2位，则需要将100变成1.00,
                this.value = stringFixTwoWithType(this.value, "");
            }
            if (this.pointlength == 1) {
                //如果有小数点并且是1位，则需要将10变成1.0,
                this.value = this.value / 10;
            }
            this.$refs.input.value = this.value + this.unit; //显示的时候加上单位，单位默认为空
        }
    },
    methods: {
        /**
         * input输入时对数据进行格式化
         * @param {Object} value
         */
        inputNumFrtValue: function (value) {
            var result = "";
            if (this.pointlength == 0) {
                result = (value + "").replace(/[^\d]/g, "");
            } else if (this.pointlength == 2) {
                result = MoneyValidator.parse(value); //有两位小数的数据格式的输入限制
            } else if (this.pointlength == 1) {
                result = MoneyValidator.parse(value, 14, 1); //小数点只有一位的，整数部门临时显示14位
            }
            this.inputFlag = true;
            //不能超过maxlength位数
            if (value.length > this.maxlength) {
                result = value.slice(0, this.maxlength);
            }
            this.$refs.input.value = result;
            if (this.pointlength == 2) {
                //如果有小数点并且为2位，则将 0.01-> 001 生成发送给服务器的数据
                if (this.unit == "%" && result == "") {
                    this.$emit(
                        "input", ""
                    );
                } else {
                    this.$emit(
                        "input",
                        MoneyValidator.format(result).replace(/[^\d]/g, "")
                    );
                }

            } else if (this.pointlength == 1) {
                //如果有小数点并且为1位，则将 0.1-> 01 生成发送给服务器的数据
                this.$emit(
                    "input",
                    MoneyValidator.format(result, 1).replace(/[^\d]/g, "")
                );
            } else {
                this.$emit("input", result);
            }
            if (this.unit == "张") {
                if (Number(value) > 10000) {
                    this.$refs.input.value = 10000;
                    this.$emit("input", 10000);
                }
            }
            if (this.unit == "天") {
                if (Number(value) > 365) {
                    this.$refs.input.value = 365;
                    this.$emit("input", 3650);
                }
            }
            if (this.unit == "%") {
                if (Number(value) > 100) {
                    this.$refs.input.value = 100;
                    this.$emit("input", 100);
                }
            }
            //采购的数量和单价的特殊处理，计算总价
            if (this.autocomp) {
                var unitpriceId = "8"; //单价fieldKey
                var totalPriceId = "10"; //总计fieldKey
                var unitprice = this.$root.$refs.inDetail[0].$refs[unitpriceId][
                    this.idx
                ].value;
                var totalPrice = 0;
                for (var i = 0; i < value; i++) {
                    totalPrice = sumStrings(totalPrice, unitprice);
                }
                this.$root.$refs.inDetail[0].$refs[totalPriceId][
                    this.idx
                ].value = totalPrice;
                this.$root.$refs.inDetail[0].$refs[totalPriceId][
                    this.idx
                ].$emit("input", totalPrice);
            }
        },
        /**
         * 获取焦点时对数据进行格式化
         */
        focusNumFrtValue: function (value) {
            if (this.readonly) return;
            this.inputFlag = true;
            if (this.unit != "" && value != "") {
                this.$refs.input.value = value.split(this.unit)[0];
            }
        },
        /**
         * 失去焦点时对数据进行格式化
         */
        blurNumFrtValue: function (value) {
            this.inputFlag = false;
            if (value != "" && !!this.unit) {
                this.$refs.input.value =
                    parseFloat(value).toFixed(this.pointlength) + this.unit;
            }
            //请假模板天数的特殊处理
            if (this.fieldkey == "num10_584_noempty") {
                AttendanceHandler.leaveDaysCheck(value, this.computeDays, this);
                //Bug 23744
                AttendanceHandler.showLeaveTips(this);
            }
            //销假模板天数的特殊处理
            if (this.fieldkey == "num10_4_noempty") {
                AttendanceHandler.recallDaysCheck(value, this);
            }
            //5要素的票据模板，需要格式化输入的凭证号 
            if (!!value && this.elementFlag == "5") {
                //密码器业务格式化transactionSN
                if (0 == value) {
                    value = 1;
                }
                let padValue = pad(parseInt(value || 1), Number(8));
                this.$refs.input.value = padValue;
                this.$emit("input", padValue);
            }
            //出差和差旅模板的出差天数的特殊处理
            if (this.fieldkey == "traveDays" || this.fieldkey == "travelDays") {
                if (value > this.computeDays) {
                    showToast('出差天数不正确', 'middle');
                    return false;
                }
            }
        }
    },
    watch: {
        /**
         * 监听value变化
         * @param {Object} newVal
         * @param {Object} oldVal
         */
        value: function (newVal, oldVal) {
            if (this.value) {
                var valueTS = newVal + "";
                if (!this.inputFlag) {
                    //使用代码给组件赋值的情况，inputFlag为false,需要加上单位
                    if (this.pointlength == 2) {
                        //如果有小数点并且是2位，则需要将100变成1.00,
                        valueTS = stringFixTwoWithType(valueTS, "");
                    }
                    if (this.pointlength == 1) {
                        //如果有小数点并且是1位，则需要将10变成1.0,
                        valueTS = valueTS / 10;
                    }
                    this.$refs.input.value = valueTS + this.unit;
                }
            } else {
                this.$refs.input.value = "";
            }
        },
        beforeFlowId: function (newVal, oldVal) {
            //6要素的票据模板，凭证号设置为只读，并且将beforeFlowId显示出来
            if (this.fieldkey == "transactionSN" && this.elementFlag == "6" && newVal != 0) {
                let padValue = pad(parseInt(newVal || 1), 8);
                this.$refs.input.value = padValue;
                this.$emit("input", padValue);
                this.readonly = true;
            }
        }
    }
};
</script>