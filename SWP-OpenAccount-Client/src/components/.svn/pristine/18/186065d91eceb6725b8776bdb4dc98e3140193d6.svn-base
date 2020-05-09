<template>
    <x-textarea
        ref="input"
        :value="value"
        :class="frclass"
        :title="title"
        :style="inputStyle"
        :max="maxlength"
        :placeholder="placeholder"
        :rows="rows"
        :show-counter="counter"
        :height="height"
        :readonly="readonly"
        :disabled="disabled"
        :autosize="autosize"
        @on-change="changeXTextarea"
    ></x-textarea>
</template>
<script>
import { Group, Cell, XTextarea } from 'vux';
export default {
    components: {
        Group,
        Cell,
        XTextarea,
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        frclass: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        maxlength: {
            type: Number
        },
        placeholder: {
            type: String
        },
        rows: {
            type: Number
        },
        counter: {
            type: Boolean,
            default: true
        },
        height: {
            type: String
        },
        readonly: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        autosize: {
            type: Boolean,
            default: true
        },
        textAlign: {
            type: String,
            default: 'left'
        }
    },
    data: function () {
        return {}
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

    methods: {
        changeXTextarea(value) {
            console.log("changeXTextarea", value);
            var _this = this;
            this.$emit('input', value);
            setTimeout(() => {
                _this.$refs.input.updateAutosize();
            }, 50)
        },
    }
}
</script>