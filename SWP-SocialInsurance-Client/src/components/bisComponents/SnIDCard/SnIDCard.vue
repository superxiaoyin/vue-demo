<template>
    <div>
        <cell :title="title" value-align="left">
            <input
                ref="input"
                :value="value"
                :placeholder="placeholder"
                v-on:input="inputFrtValue($event.target.value)"
            >
        </cell>
    </div>
</template>
<script>
import { getClass, cryptPost } from '../../../lib/common/base.js';
import { prefixInteger, moneyStringFixTwo, stringFixTwoWithType } from '../../../lib/common/extend.js';
import { Cell } from 'vux';
export default {
    components: {
        Cell,
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        value: {
            type: String
        },
        relationFiledIds: {
            type: String
        },
        placeholder: {
            type: String
        },
        maxlength: {
            type: Number,
            default: 18//身份证固定18位
        },
        readonly: {
            type: Boolean,
            default: false
        },
        frclass: {
            type: String,
            default: ''
        },
        fieldKey: {//接受模板中的fieldKey，主要是为了购买理财的产品代码需要查询
            type: String
        },
        autosize: {
            type: Boolean,
            default: true
        },
        rowsNum: {
            type: Number,
            default: 1
        },
        isInDetailFlag: {//是否明细组件 默认为否
            type: Boolean,
            default: false
        },
        idx: { //组件的index
            type: Number
        }

    },
    data: function () {
        return {
            value: '',
            relationFiledIds: ''
        }
    },
    created: function () {
    },
    mounted: function () {//存在value,显示value  供存草稿使用
        if (this.value) {
        }
    },
    methods: {
        /**
         * input输入时对数据进行格式化
         * @param {Object} value
         */
        inputFrtValue: function (value) {
            var result = value;
            //前面17位只能输入数字
            if (value.length < this.maxlength) {
                result = (value + '').replace(/[^\d]/g, "");
            } else if (value.length == this.maxlength) {
                //第18位可以输入数字和字母X
                result = (value + '').replace(/[^0-9Xx]/g, "");
            }

            if (value.length > this.maxlength) {
                result = value.slice(0, this.maxlength);
            }
            this.$refs.input.value = result;
            this.$emit('input', result);
        },
    },
}
</script>