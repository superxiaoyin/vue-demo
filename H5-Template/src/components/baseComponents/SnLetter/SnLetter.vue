<template>
    <div>
        <cell :title='title' value-align='left'>
            <input ref="input" :value="value" :placeholder="placeholder" @input="inputFrtValue($event.target.value)" />
        </cell>
    </div>
</template>
<script>
import { Cell } from 'vux';
export default {
    components: {
        Cell,
    },
    props: {
        title: {
            type: String,
        },
        value: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String
        },
    },
    data: function() {
        return {
        }
    },
    created: function() {},
    mounted: function() {},
    methods: {
        /**
         * input输入时对数据进行格式化
         * @param {Object} value
         */
        inputFrtValue: function(value) {
            var reg = /[\u4E00-\u9FA5]/g;
            var result = (value + '').replace(reg, "");
            this.$refs.input.value = result;
            this.$emit('input', result);
        },
    }
}
</script>