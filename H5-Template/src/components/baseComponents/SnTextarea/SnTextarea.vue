<template>
    <cell :title="title" class="sn-textarea" value-align="left">
        <textarea
            ref="input"
            :style="inputStyle"
            :value="value"
            :rows="rows"
            :maxlength="maxlength"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            @input="changeTextarea($event.target.value)"
            @focus="focusTextarea($event.target.value)"
            @blur="blurTextarea($event.target.value)"
        ></textarea>
    </cell>
</template>
<script>
import { Group, Cell, XInput } from "vux";
export default {
    components: {
        Group,
        Cell,
        XInput
    },
    props: {
        title: {
            type: String,
            default: ""
        },
        value: {
            type: String,
            default: ""
        },
        rows: {
            type: Number
        },
        maxlength: {
            type: Number
        },
        placeholder: {
            type: String,
            default: ""
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
    data: function () {
        return {};
    },
    created: function () { },
    computed: {
        inputStyle() {
            if (this.textAlign) {
                return {
                    textAlign: this.textAlign
                }
            }
        },
    },
    methods: {
        // input框发生改变时
        changeTextarea(val) {
            this.$emit("input", val);
        },
        // input得到焦点时
        focusTextarea(val) {
            this.$emit("focus", val);
        },
        // input失去焦点时
        blurTextarea(val) {
            this.$emit("blur", val);
        },
        updateAutosize(){
            this.$refs.input.style.height = 'auto';
            this.$refs.input.scrollTop = 0; //防抖动
            this.$refs.input.height = elem.scrollHeight + 'px';
        }
    }
};
</script>
<style lang="less">
.sn-textarea {
    .weui-cell__ft {
        display: flex;
        align-items: center;
        textarea {
            resize: none;
            overflow: hidden;
            line-height: 1.5;
        }
    }
}
</style>