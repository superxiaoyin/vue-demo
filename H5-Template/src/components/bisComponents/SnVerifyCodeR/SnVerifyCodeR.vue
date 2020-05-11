<template>
    <div class="snVerifyCode">
        <cell :title="title" value-align="left">
            <input ref="input" :style="inputStyle" :value="value" :placeholder="placeholder" v-on:input="inputFrtValue($event.target.value)">
            <div class="button-detail" :class="{fail:!canGetVerifyCode}" @click="sendVerifyCode">
                <span>{{verifyCodeTips}}</span>
            </div>
        </cell>
    </div>
</template>
<script>
import './SnVerifyCode.less';
import { getClass, cryptPost } from '../../../lib/common/base.js';
import { throttle, showToast } from '../../../lib/common/extend.js';
import { doPost } from "../../../lib/common/Net.js";

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
        phoneNum: { //组件的index
            type: Number
        },
        vType: { //组件的index
            type: Number
        },
        textAlign: {
            type: String,
            default: 'left'
        }
    },
    data: function () {
        return {
            value: '',
            canGetVerifyCode: true,//能否获取验证码
            verifyCodeTips: '获取验证码',
            vType: this.vType,
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
            if (!_this.canGetVerifyCode) {
                return;
            } else if ('' == _this.phoneNum || !!!_this.phoneNum) {
                showToast('请输入经办人手机号');
                return;
            } else if (!!_this.phoneNum && _this.phoneNum.length > 0 && _this.phoneNum.length < 11) {
                showToast('请输入正确的经办人手机号');
                return;
            }
            throttle(function () {
                doPost('openAccount/getVerifyCode.do', {
                    vType: _this.vType,
                    userPhone: _this.phoneNum
                }).then(function (result) {
                    if (!!result && 0 == result.code) {
                        showToast('验证码已发送', 'middle');
                        _this.$emit('getending', 'true');
                        _this.getRetCode(60);
                        _this.canGetVerifyCode = false;
                    } else {
                        showToast('获取验证码失败', 'middle');
                    }

                });
            }, this)
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
}
</script>