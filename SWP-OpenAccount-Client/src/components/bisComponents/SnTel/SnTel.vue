<template>
    <cell :title="title" value-align="left">
        <input ref="input" :style="inputStyle" :value="value" :placeholder="placeholder" v-on:input="inputFrtValue($event.target.value)">
    </cell>
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
            default: 13//不超过13位
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
        isInDetailFlag: {//是否明细组件 默认为否
            type: Boolean,
            default: false
        },
        idx: { //组件的index
            type: Number
        },
        textAlign: {
            type: String,
            default: 'left'
        }

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
    data: function () {
        return {
        
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
            var result = (value + '').replace(/[^0-9-]/g, "");
            if (value.length > this.maxlength) {
                result = value.slice(0, this.maxlength);
            }
            this.$refs.input.value = result;
            this.$emit('input', result);
        },
    },
}
</script>