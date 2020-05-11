<!--单选-->
<template>
	<div>
	    <div class="sn-radio" v-bind:class="{ bigRadio: isBigRadio, oneline: isOneline }">
	        <div class="label" v-if="title">{{ title }}</div>
	        <!--title-->
	        <div class="radioRight">
	            <span
	                v-bind:class="btn.cls"
	                @click="radioClick(btn)"
	                v-if="radioList.length > 0"
	                v-for="(btn, index) in radioList"
	            >
	                <span class="leftIcoBox" v-bind:class="{ radioCheck: btn.id == checkedIndex }">
	                    <span class="leftIco"></span>
	                </span>
	                <span class="radioText" v-text="btn.text"></span>
	            </span>
	        </div>
	    </div>
	    <div v-if='tipsFlag' class="applyUserTipsDiv">
	    	<span class="tipsImg"></span>
	        <span class="applyUserTips magleft">该业务为非实时到账业务</span>
	    </div>
    </div>
</template>
<style lang="less" src="./SnRadio.less"></style>
<script>
import { TempletTypeData, AmountLimit } from '../../../pages/approval/ApprovalConstantData.js';
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        radioList: {
            type: Array,
            default: () => { return [] }
        },
        relationFiledIds: {
            type: String
        },
        placeholder: {
            type: String
        },
        value: {
            type: Number
        },
        defaultIndex: {//默认值index  不能直接赋值默认值 有些场景不需要默认值
            type: String
        },
        maxlength: {
            type: Number
        },
        readonly: {
            type: Boolean,
            default: false
        },
        bsreadonly: {//临时使用变量，单选框的readonly在模板转换中OK后，该变量需要删除  zc
            type: Boolean,
            default: false
        },
        isBigRadio: {
            type: Boolean,
            default: false
        },
        fieldKey: {
            type: String
        },
        displayFlag: {
            type: Object,
            default: () => { return { show: true } }
        },
        isInDetailFlag: {//是否明细组件 默认为否
            type: Boolean,
            default: false
        },
        idx: { //组件的index
            type: Number
        },
        isOneline: {
            type: Boolean,
            default: false
        },
        tipsFlag:{
        	type:Boolean,
        	default:false
        }
    },
    data: function () {
        return {
            checkedIndex: -1,//选中raido索引  默认值为-1  不能直接赋值默认值 有些场景不需要默认值
            selectedText: ''
        }
    },
    created: function () {
        if (0 <= this.defaultIndex) {//默认选中    - 默认值存在则赋值默认值
            this.checkedIndex = this.defaultIndex;
            this.$emit('input', this.checkedIndex);
        }
    },
    mounted: function () {
        var _this = this;
        if (0 <= this.value) {
            this.checkedIndex = this.value;
            this.$emit('input', this.checkedIndex);
        }
    },
    methods: {
        /**
         * 单选框点击事件
         * @param {Object} btn  选择的raido索引
         */
        radioClick: function (btn) {
            var _this = this;
            if (_this.bsreadonly) {
                return;
            }
            //返回该索引
            this.checkedIndex = btn.id; //选中
            this.$emit('input', btn.id);
            this.$emit('change',{
            	value: btn.id,
				idx: this.idx,
				fieldKey:this.fieldKey
            })
            this.selectedText = btn.text;
            //判断关联组件处理
            if (this.fieldKey == 'transType' && 2 == btn.id) {//行内跨行
                if (this.isInDetailFlag) {//明细
                    _this.$root.content.inDetail[_this.idx].displayFlag = true;
                    _this.$root.content.inDetail[_this.idx].templetType = TempletTypeData.OUTERTRANSFER_TEMPLETTYPE;
                    _this.$parent.templetType = TempletTypeData.OUTERTRANSFER_TEMPLETTYPE;
                }
            } else if (this.fieldKey == 'transType' && 1 == btn.id) {
                if (this.isInDetailFlag) {//明细
                    _this.$root.content.inDetail[_this.idx].displayFlag = false;
                    _this.$root.content.inDetail[_this.idx].templetType = TempletTypeData.INNERTRANSFER_TEMPLETTYPE;
                    _this.$parent.templetType = TempletTypeData.INNERTRANSFER_TEMPLETTYPE;
                }
            }
            //跨行新增判断
            if (_this.fieldKey == 'payType') {
                if (2 == _this.$root.subTransMethod && _this.$root.superBank && parseFloat(_this.$root.content.amount | 0 + _this.$root.content.totalMoney | 0) <= AmountLimit) {//实时
                    _this.$root.interBankFlag = false;
                } else {
                    _this.$root.interBankFlag = true;
                }
            }
            if (_this.fieldKey == 'transMethod') {
                //将后续操作中的选择放到根节点方便进行判断
                _this.$root.subTransMethod = btn.id;
                if (2 == btn.id && _this.$root.superBank && parseFloat(_this.$root.content.amount | 0 + _this.$root.content.totalMoney | 0) <= AmountLimit) {//实时
                    _this.$root.interBankFlag = false;
                } else {
                    _this.$root.interBankFlag = true;
                }
            }
            //银企对账 相符不相符
            if ('acctStatus' == this.fieldKey) {
                //_this.balanceRender(btn);  银企对账前后端分离后，this.$root的写法不适用
            }
            //转账业务里面，选择了普通或者次日，显示提示信息
            if (_this.fieldKey == 'transMethod' ) {
	            if (this.checkedIndex == '1' || this.checkedIndex == '3') {
	            	_this.tipsFlag = true; 
	            } else {
	            	_this.tipsFlag = false;
	            }
            }
        },
        /**
         * 对账处理
         * @param {Object} btn
         */
        balanceRender: function (btn) {
            var _this = this;
            //不相符
            if (1 == btn.id) {
                //_this.$parent.balanceView = 'SnNoMatch';
                if (_this.$root.content.inDetail[_this.idx].acctNeqList) {
                    _this.$root.content.inDetail[_this.idx]['acctNeqList'] = {};
                }
            }
        }
    },
    watch: {
        /**
         * 数据显示 主要针对删除使用
         * @param {Object} newVal
         * @param {Object} oldVal
         */
        value: function (newVal, oldVal) {
            if (!this.$parent.delInDetailFlag) {
                return
            }

            this.checkedIndex = this.value;
        },
    }
}
</script>