<template>
    <cell class="snVerifyCode" :title="title" value-align="left">
        <input
            ref="input"
            :style="inputStyle"
            :value="value"
            :placeholder="placeholder"
            v-on:input="inputFrtValue($event.target.value)"
        />
        <div
            class="button-detail"
            :class="{ fail: !canGetVerifyCode }"
            @click="sendVerifyCode"
        >
            {{ verifyCodeTips }}
        </div>
    </cell>
</template>
<script>
import './SnVerifyCode.less';
import { getClass, cryptPost } from '../../../lib/common/base.js';
import { throttle, showToast } from '../../../lib/common/extend.js';

import { Cell } from 'vux';
import SnInput from "../../baseComponents/SnInput/SnInput.vue";
export default {
    components: {
        Cell,
        SnInput
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
        phoneNum: { //组件的index
            type: String,
            default:''
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
            canGetVerifyCode: true,//能否获取验证码
            verifyCodeTips: '获取验证码',
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
            var result = (value + '').replace(/[^0-9]/g, "");
            if (value.length > this.maxlength) {
                result = value.slice(0, this.maxlength);
            }
            this.$refs.input.value = result;
            this.$emit('input', result);
        },
        /**
         * 发送验证码
         */
        sendVerifyCode: function () {
            var _this = this;
            var reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
            if (!_this.canGetVerifyCode) {
                return;
            } else if ('' == _this.phoneNum || !!!_this.phoneNum) {
                showToast('请输入手机号');
                return;
            } else if (!reg.test(_this.phoneNum)) {
                showToast('请输入正确的手机号');
                return;
            }
            showToast('验证码已发送', 'middle');
            _this.$emit('getending', 'true');
            _this.getRetCode(60);
            _this.canGetVerifyCode = false;
        },
        /**
         * 60秒倒计时
         */
        getRetCode: function (count) {
            var _this = this;
            if (count > 0) {
                count--;
                _this.verifyCodeTips = count + 's';
                setTimeout(function () {
                    _this.getRetCode(count);
                }, 1000)
            } else {
                _this.canGetVerifyCode = true;
                _this.verifyCodeTips = '再次发送';
            }
        },
    },
    watch:{
        phoneNum(newVal,oldVal){
            console.log(newVal);
        }
    }
}
</script>