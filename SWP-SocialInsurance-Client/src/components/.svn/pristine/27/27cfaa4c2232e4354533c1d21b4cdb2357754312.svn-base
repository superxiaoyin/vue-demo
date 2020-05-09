<template>
    <div class="snPopupPicker">
        <div v-if="detailFlag">
            <cell
                :title="title + (titleIndex ? titleIndex : '')"
                :value="selectedValue"
                value-align="left"
            >
            </cell>
        </div>
        <div v-else>
            <cell
                :title="title + (titleIndex ? titleIndex : '')"
                value-align="left"
                class="snPopupRight"
                @click.native="openPopup"
            >
                <input
                    type="text"
                    class="popupInput"
                    maxlength="20"
                    :placeholder="placeholder"
                    readonly="readonly"
                    ref="input"
                    :value="selectedValue"
                />
            </cell>
            <popup v-model="popupShowFlag" position="right" width="100%">
                <div class="position-horizontal-demo popupDebit">
                    <group title="">
                        <cell
                            v-for="data in dataList"
                            :title="data.dispValue"
                            @click.native="choosedItem(data)"
                        >
                            <div class="checker" style="width:1rem">
                                <img
                                    v-if="data.isCheck"
                                    src="../../../resource/img/company/checkbox-selected.png"
                                />
                            </div>
                        </cell>
                    </group>
                </div>
            </popup>
        </div>
    </div>
</template>

<script>
import "./SnPopupRadioCompany.less";
import { getBankType } from "../../../lib/common/SnJsBridge.js";
import { cryptPost } from "../../../lib/common/base.js";
import {
    showToast,
    getStorage,
    setStorage,
    deleteStorage,
    initTitleMenu,
    setTitleOnly,
    isPC,
    getBankConfig
} from "../../../lib/common/extend.js";
import { Group, Popup, PopupHeader, Radio, Cell } from "vux";
export default {
    components: {
        Group,
        Popup,
        PopupHeader,
        Radio,
        Cell
    },
    data: function() {
        return {
            selectedValue: "",
            popupShowFlag: false,
            appBankType: "",
            delayShow: 0, //等待键盘收起再弹出下拉框
            bankName: "",
            radioList: [],
            bankId: 0,
            iconImg: "", //银行图标路径
            periodList: [], //预约网点时段信息
            orderDate: this.orderDate //申请日期
        };
    },
    props: {
        title: {
            //title
            type: String,
            default: ""
        },
        titleIndex: {
            //titleIndex
            type: Number
        },
        subTitle: {
            type: Array,
            default() {
                return [];
            }
        },
        dataList: {
            //list数据
            type: Array,
            default() {
                return [];
            }
        },
        value: {
            type: Number
        },
        funName: {
            //传递进来的方法名
            type: String,
            default: ""
        },
        columns: {
            type: Number,
            default: 1
        },
        placeholder: {
            //控件提示
            type: String,
            default: ""
        },
        noTips: {
            //为空提示信息
            type: String,
            default: "数据为空"
        },
        hasDefault: {
            //默认值，默认为没有
            type: Boolean,
            required: true,
            default: false
        },
        selectFlag: {
            type: Object,
            default: {
                show: false
            }
        },
        flag: {
            type: Boolean,
            default: true
        },
        cssClass: {
            type: String,
            default: ""
        },
        selectType: {
            //下来框的类型，根据类型获取不同的下拉框值
            type: String,
            default: ""
        },
        relationFiledIds: {
            type: Array,
            default: []
        },
        isInDetailFlag: {
            //是否明细组件 默认为否
            type: Boolean,
            default: false
        },
        isInNextOprFlag: {
            //是否后续操作组件 默认为否
            type: Boolean,
            default: false
        },
        idx: {
            //组件的index
            type: Number
        },
        fieldKey: {
            type: String,
            default: null
        },
        disabledFlag: {
            //申请填了支付方式  后续的需要不让选
            type: Boolean
        },
        detailFlag: {
            //详情入口
            type: Boolean
        },
        bisBranchDisplay: {
            //支行在转账业务组件中的显示值
            type: String,
            default: null
        },
        cityId: {
            type: Number,
            default: 0
        },
        branchId: {
            type: Number,
            default: 0
        },
        orderDate: {
            type: Number
        }
    },
    beforeCreate: function() {
        var _this = this;
        getBankType(_this); //获取银行type
    },
    created: function() {
        var _this = this;
        if (this.dataList.length > 0 && this.hasDefault) {
            this.selectedValue = this.dataList[0].dispValue || ""; //给控件赋值默认值  控件显示值
            this.$emit("input", this.dataList[0].value || ""); //控件返回值
        }
    },
    mounted: function() {
        //存在value,显示value  供存草稿使用
        var _this = this;
        // if (_this.value || _this.value == 0) {
        //     var text = _this.value;
        //     if (!!_this.dataList && _this.dataList.length > 0) {
        //         _this.dataList.forEach(function(item) {
        //             if (_this.value == item.value) {
        //                 text = item.dispValue;
        //             }
        //         });
        //     } else if (_this.selectType == "branch") {
        //         //如果是支行，则在content中的存储branchDisplay来显示
        //         if (_this.isInDetailFlag) {
        //             //明细
        //             text =
        //                 _this.$root.content.inDetail[_this.idx].branchDisplay ||
        //                 ""; //值显示
        //         } else if (_this.isInNextOprFlag) {
        //             //在业务组件中的显示值
        //             text = _this.bisBranchDisplay;
        //         } else {
        //             text = _this.$root.content.branchDisplay || ""; //值显示
        //         }
        //     }
        //     _this.selectedValue = text;
        // }
        setTimeout(() => {
            _this.updateRadioList(_this.dataList);
        }, 500);

        //检测键盘是否弹起并设置下拉框弹出延时
        $(document).on("focus", "input,textarea", function() {
            _this.delayShow = 0;
        });
        $(document).on("blur", "input,textarea", function() {
            setTimeout(function() {
                _this.delayShow = 0;
            }, 500);
        });
    },
    methods: {
        /**
         * 打开选择页面
         */
        openPopup: function() {
            var _this = this;

            if (!_this.detailFlag) {
                _this.selectShowControl();
            }
        },
        choosedItem: function(item) {
            var _this = this;
            _this.setBodysrcTop();
            this.selectFlag.show = false;

            _this.dataList.forEach(value => {
                if (value.value == item.value) {
                    value.isCheck = !value.isCheck;
                    if (value.isCheck) {
                        _this.selectedValue = item.dispValue; //控件显示值
                        setTimeout(() => {
                            _this.$emit("input", item.value); //控件返回值
                            initTitleMenu(_this.subTitle); //设置title及按钮
                        }, 500);
                    } else {
                        _this.selectedValue = ""; //控件显示值
                        setTimeout(() => {
                            _this.$emit("input", ""); //控件返回值
                            initTitleMenu(_this.subTitle); //设置title及按钮
                        }, 500);
                    }
                } else {
                    value.isCheck = false;
                }
            });
        },

        /**
         * 下拉框显示隐藏控制
         */
        selectShowControl: function() {
            var _this = this;
            if (0 < this.dataList.length) {
                //等待键盘收起再弹出下拉 框
                if (isPC()) {
                    _this.popupShowFlag = true;
                } else {
                    setTimeout(function() {
                        _this.popupShowFlag = true;
                        _this.delayShow = 0;
                    }, _this.delayShow);
                }
                //打开二级页面记住一级页面滚动位 置
                var bodyScrTop = $("body").scrollTop();
                $("body").css({
                    overflow: "hidden",
                    position: "fixed",
                    top: bodyScrTop * -1
                });
                $("body").attr("bodyScrTop", bodyScrTop);
                setTimeout(function() {
                    $("body").addClass("setTop0");
                }, 200);
                _this.selectFlag.show = true;
                setTitleOnly("选择" + this.title);
            } else {
                this.selectFlag.show = false;
                showToast(this.noTips);
            }
        },
        /*
         * 设置页面body滚动高度，用于显示隐藏二级页面时保持一级页面的高度
         * */
        setBodysrcTop: function() {
            //关闭二级页面设置一级页面滚动位置
            $("body").css({
                overflow: "auto",
                position: "static",
                top: "auto"
            });
            $("body").scrollTop($("body").attr("bodyScrTop"));
            $("body").removeClass("setTop0");
        },
        /**
         * 根据日期字符串获取星期几
         * @param dateString 日期字符串（如：2016-12-29），为空时为用户电脑当前日期
         * @returns {String}
         */
        getWeek: function(dateString) {
            var date;
            var dateArray = dateString.split("-");
            date = new Date(
                dateArray[0],
                parseInt(dateArray[1] - 1),
                dateArray[2]
            );
            return "6012345".charAt(date.getDay());
        },
        updateRadioList(newVal) {
            var _this = this;
            console.log(newVal);
            if (!!newVal && newVal.length > 0) {
                _this.radioList = newVal.map(val => {
                    return val.dispValue;
                });
            }
        }
    },
    watch: {
        /**
         * 监听datalist更新改变radio数据
         *  */
        dataList: function(newVal, oldVal) {
            var _this = this;
            _this.updateRadioList();
        },

        /**
         * 父组件控件组件显示隐藏标识
         * @param {Object} newVal  新值
         * @param {Object} oldVal  旧值
         */
        "selectFlag.show": function(newVal, oldVal) {
            var _this = this;
            if (!this.selectFlag.show) {
                //父组件隐藏子组件
                this.popupShowFlag = false;
            }
        }
    }
};
</script>
<style lang='less'>
@import "./SnPopupRadioCompany.less";
.popupDebit{
    .vux-cell-primary{
        flex: 4;
    }
    .vux-label{
        max-width: 6rem!important;
        min-width: 4rem!important;
    }
}
</style>