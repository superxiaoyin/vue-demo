<template>
    <cell class="sn-number" :title="title" value-align="left">
        <input
                :style="inputStyle"
                ref="input"
                tpye="text"
                :maxlength="maxlength"
                :placeholder="placeholder"
                :readonly="readonly"
                :value="defauleValue"
                :pointlength="pointlength"
                :unit="unit"
                :beforeFlowId="beforeFlowId"
                v-on:input="inputNumFrtValue($event.target.value)"
                v-on:focus="focusNumFrtValue($event.target.value)"
                v-on:blur="blurNumFrtValue($event.target.value)"
        >
    </cell>
</template>
<script>
    import MoneyValidator from "../../../lib/validator/MoneyValidator.js";
    import {prefixInteger, stringFixTwoWithType, sumStrings, pad} from "../../../lib/common/extend.js";
    import {Cell} from "vux";

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
                type: String,
                defaule: "",
            },
            placeholder: {
                type: String,
                default: ""
            },
            maxlength: {
                type: Number
            },
            pointlength: {
                type: Number,
                default: 0
            },
            unit: {
                type: String,
                default: ""
            },
            readonly: {
                type: Boolean,
                default: false
            },
            textAlign: {
                type: String,
                default: 'left'
            }
        },
        data: function () {
            return {
                defauleValue: ''
            };
        },
        created: function () {

        },
        computed: {
            // defauleValue:function(){
            //     if (this.pointlength == 2) {
            //         return stringFixTwoWithType(this.value, "") + this.unit;
            //     }else if(this.pointlength == 1){
            //         return this.value / 10 + this.unit;
            //     }else{
            //         return this.value + this.unit;
            //     }
            // },
            inputStyle() {
                if (this.textAlign) {
                    return {
                        textAlign: this.textAlign
                    }
                }
            },
        },
        methods: {
            /**
             * input输入时对数据进行格式化
             * @param {Object} value
             */
            inputNumFrtValue: function (value) {
                var result = '';
                if (this.pointlength == 0) {
                    result = (value + "").replace(/[^\d]/g, "");
                } else if (this.pointlength == 2) {
                    result = MoneyValidator.parse(value); //有两位小数的数据格式的输入限制
                } else if (this.pointlength == 1) {
                    result = MoneyValidator.parse(value, 14, 1); //小数点只有一位的，整数部门临时显示14位
                }
                this.$refs.input.value = result;
                console.log(result)
            },
            /**
             * 获取焦点时对数据进行格式化
             */
            focusNumFrtValue: function (value) {
                if (!!this.unit) {
                    this.$refs.input.value = value.split(this.unit)[0];
                }
            },
            /**
             * 失去焦点时对数据进行格式化
             */
            blurNumFrtValue: function (value) {
                this.$emit('input', this.$refs.input.value)
                if (!!this.unit) {
                    if (this.pointlength == 2) {
                        //如果有小数点并且是2位，则需要将100变成1.00,
                        var valueTS = stringFixTwoWithType(value, "");
                        this.$refs.input.value = parseFloat(valueTS || 0).toFixed(this.pointlength) + this.unit;
                    } else {
                        this.$refs.input.value = parseFloat(value || 0).toFixed(this.pointlength) + this.unit;
                    }
                }
            },
        },
        watch: {
            value: {
                immediate: true,
                handler: function () {
                    if (this.value === "" || this.value === null || this.value === undefined) {
                        this.defauleValue = "";
                        return;
                    }
                    if (this.pointlength == 2) {
                        this.defauleValue = stringFixTwoWithType(this.value, "") + this.unit;
                    } else if (this.pointlength == 1) {
                        this.defauleValue = this.value / 10 + this.unit;
                    } else {
                        this.defauleValue = this.value + this.unit;
                    }
                }
            }
        }
    };
</script>
<style lang="less">
    .sn-number {
        input {
            height: 100%;
        }
    }
</style>
