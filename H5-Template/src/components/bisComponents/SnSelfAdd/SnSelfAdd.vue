<!--自增-->
<template>
    <div>
        <div></div>
        <!--title-->
        <div class="button_box" v-if="selfAddList.length>0">
            <div v-for="(selfValue,index) in selfAddValue">
                <div class="selfAddWrap">
                    <div v-for="(field,idx) in selfAddList">
                        <div v-if="field.dataType =='date'">
                            <!--日期-->
                            <div v-if="selfAddValue.length>1">
                                <SnDatetime
                                    :title="field.fieldname+(index+1)"
                                    :ref="field.fieldKey"
                                    :daterange="field.daterange"
                                    v-model="selfAddValue[index]"
                                    :formatDate="field.formatDate"
                                    :fieldKey="field.fieldKey"
                                    funName="showClick"
                                ></SnDatetime>
                                <!-- 名字加序号 -->
                            </div>
                            <div v-else-if="selfAddValue.length==1">
                                <SnDatetime
                                    :title="field.fieldname"
                                    :ref="field.fieldKey"
                                    :daterange="field.daterange"
                                    v-model="selfAddValue[index]"
                                    :formatDate="field.formatDate"
                                    :fieldKey="field.fieldKey"
                                    funName="showClick"
                                    :readonly="dateReadonly"
                                ></SnDatetime>
                            </div>
                        </div>
                        <div v-else-if="field.dataType =='select'">
                            <div v-if="selfAddValue.length>1">
                                <SnPopupPicker
                                    :title="field.fieldname"
                                    :dataList="field.selectList"
                                    :titleIndex="index+1"
                                    :subTitle="subTitle"
                                    noTips="没有可用账号"
                                    :ref="field.fieldKey"
                                    :placeholder="field.placeholder"
                                    v-model="selfAddValue[index]"
                                    value-text-align="left"
                                    :selectFlag="selectFlag"
                                    funName="showClick"
                                    columns="1"
                                ></SnPopupPicker>
                                <!-- 名字加序号 -->
                            </div>
                            <div v-else-if="selfAddValue.length==1">
                                <SnPopupPicker
                                    :title="field.fieldname"
                                    :dataList="field.selectList"
                                    noTips="没有可用账号"
                                    :subTitle="subTitle"
                                    :ref="field.fieldKey"
                                    :placeholder="field.placeholder"
                                    v-model="selfAddValue[index]"
                                    value-text-align="left"
                                    :selectFlag="selectFlag"
                                    funName="showClick"
                                    columns="1"
                                ></SnPopupPicker>
                            </div>
                        </div>
                        <div v-else-if="field.dataType =='text'">
                            <SnNumber
                                :title="title"
                                :placeholder="placeholder"
                                v-model="selfAddValue[index]"
                            />
                        </div>
                        <span
                            v-bind:class="index==selfAddValue.length-1?'snselfadd':'snselfdel'"
                            @click="itemClick(field,index)"
                            v-if="showSelfAddBtn"
                        ></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import './SnSelfAdd.less';
import { getClass } from '../../../lib/common/base.js';
import { prefixInteger, showToast } from '../../../lib/common/extend.js';
import SnDatetime from '../SnDatetime/SnDatetime.vue';
import SnPopupPicker from '../SnPopupPicker/SnPopupPicker.vue';
import { Cell } from 'vux';
export default {
    components: {
        SnDatetime,
        SnPopupPicker
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        subTitle: {
            type: Array,
            default() {
                return []
            }
        },
        conType: {
            type: String,
            default: ''
        },
        selectFlag: {
            type: Object,
            default: { 'show': false }
        },
        selfAddList: {
            type: Array,
            default: [{ fieldname: '时间', dataType: 'date' }]
        },
        value: {
            type: Array
        },
        placeholder: {
            type: String
        }
    },
    data: function () {
        return {
            selfAddValue: [''],//默认值为''
            showSelfAddBtn: true, //是否显示自增按钮
            dateReadonly: false //时间是否可编辑
        }
    },
    created: function () {
    },
    mounted: function () {//存在value,显示value  供存草稿使用
        var _this = this;
        if (_this.value) {
            _this.selfAddValue = _this.value;
        }
        _this.selfAddList.forEach(item => {
            if (item.timeStr > 0) { //考勤-打卡异常跳转时间处理
                _this.selfAddValue = [];
                _this.selfAddValue.push(item.timeStr);
                _this.showSelfAddBtn = false;
                _this.dateReadonly = true;
            }
        })
    },
    methods: {
        /**
         * 元素点击事件
         * @param {Object} item
         * @param {Object} index
         */
        itemClick: function (item, index) {
            var _this = this;
            if (index == _this.selfAddValue.length - 1) {//最后一个元素  增加
                if (index < 8) {
                    _this.selfAddValue.push("");
                } else {
                    showToast('最多只能添加9个' + item.fieldname, 'middle');
                }
            } else { //其他元素 删除
                _this.selfAddValue.splice(index, 1);
                //      			_this.delItem(index);
            }
            _this.selfAddValue = JSON.parse(JSON.stringify(_this.selfAddValue));
            //数据传递出去
            _this.$emit('input', this.selfAddValue);//传递给父组件
        },
        /**
         * 增加控件
         * @param {Object} item   控件
         */
        addItem: function (item) {
            //返回该索引

        },
        /**
         * 删除控件
         * @param {Object} index  控件索引
         */
        delItem: function (index) {

        }
    },
    watch: {
        /**
         * 自增组件值
         * @param {Object} newVal  新值
         * @param {Object} oldVal  旧值
         */
        selfAddValue: function (newVal, oldVal) {
            //
            this.$emit('input', this.selfAddValue);
        }
    }
}
</script>