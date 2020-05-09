<template>
    <cell :title="title" value-align="left">
        <input ref="input" :style="inputStyle" :value="value" :type="type" :maxlength="maxlength" :placeholder="placeholder" :disabled="disabled" :readonly="readonly" @input="changeInput($event.target.value)" @focus="focusInput($event.target.value)" @blur="blurInput($event.target.value)">
    </cell>
</template>
<script>
import { Group, Cell, XInput } from 'vux';
export default {
    components: {
        Group,
        Cell,
        XInput
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        maxlength: {
            type: String,
        },
        placeholder: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
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
        return {}
    },
    created: function () { },
    methods: {
        // input框发生改变时
        changeInput(val) {
            console.log(val)
            console.log(this.$refs.input.value);
            this.$emit('input', val);
        },
        // input得到焦点时
        focusInput(val) {
            this.$emit('focus', val);
        },
        // input失去焦点时
        blurInput(val) {
            this.$emit('blur', val);
        },
    }
}
</script>