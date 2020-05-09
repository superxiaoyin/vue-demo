<template>
    <div class="snBranch">
        <cell
            :title="title + (titleIndex ? titleIndex : '')"
            value-align="left"
            class="sn-popup-right"
            @click.native="openPopup"
        >
            <input
                type="text"
                :style="inputStyle"
                class="popupInput sn-nowrap"
                maxlength="20"
                :placeholder="placeholder"
                readonly="readonly"
                ref="input"
                :value="selectedValue"
            />
        </cell>
        <div v-transfer-dom>
            <popup v-model="popupShowFlag" position="right" width="100%">
                <div class="scrollDiv" ref="aping">
                    <SnSearch @searchInfo="searchBranch"></SnSearch>
                    <!-- <div class="searchWrap" v-show="searchShowFlag">
                    <div class="searchLeft">
                        <div class="inputWrap">
                            <input type="text" class="searchInput" value="" placeholder="请输入支行名称" maxlength="30" v-model="searchValue">
                            <i class="cleansearchInput" v-show="searchValue == '' ?  false : true " @click="cleanSearch"></i>
                        </div>
                    </div>
                    <div class="searchRight" @click="searchBranch">搜索</div>
                    </div>-->
                    <div
                        v-show="nostatis"
                        class="position-horizontal-demo popupDebit sn-brank-list"
                        v-on:scroll="showMore"
                        ref="apingUl"
                    >
                        <div>
                            <!-- list里面的参数为 src-图标  title-显示数据 value-返回数据-->
                            <a
                                href="javascript:void(0);"
                                v-for="item in dataList"
                                :key="item.branchId"
                                @click="choosedItem(item)"
                            >
                                <span>{{ item.branchName }}</span>
                            </a>
                        </div>
                        <Loading v-show="loadingCtrl"></Loading>
                        <div
                            v-show="loadendingCtrl && !loadingCtrl"
                            class="loadending"
                        >
                            <span>已经到底了</span>
                        </div>
                    </div>
                    <Empty icon="no-search" :isShow="!nostatis"></Empty>
                </div>
            </popup>
        </div>
    </div>
</template>

<script>
import "./SnBranchList.less";
import { getBankType } from "../../../lib/common/SnJsBridge.js";
import { cryptPost } from "../../../lib/common/base.js";
import Empty from '../Empty/Empty.vue';
import Loading from '../../baseComponents/SnLoading/SnLoading.vue'
import SnSearch from '../../baseComponents/SnSearch/SnSearch.vue';
import {
    showToast,
    getStorage,
    setStorage,
    deleteStorage,
    initTitleMenu,
    setTitleOnly,
    isPC
} from "../../../lib/common/extend.js";
import { Popup, Cell, TransferDom } from "vux";
export default {
    directives: {
        TransferDom
    },
    components: {
        Loading,
        Popup,
        Cell,
        Empty,
        SnSearch
    },
    data: function () {
        return {
            selectedValue: "",
            popupShowFlag: false,
            delayShow: 0, //等待键盘收起再弹出下拉框
            nonDisplayValue: "",
            searchShowFlag: false, //搜索框默认隐藏
            cleanSearchShow: false, //清除搜索按钮默认隐藏
            listSearchShow: true, //搜索按钮默认显示
            searchValue: "",
            canAddpage: true,
            loadingCtrl: true,
            loadendingCtrl: false,
            pageIndex: 1, //分页默认从1开始
            pageNum: 20, //默认显示20条
            nostatis: true,
            dataList: []
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
            default: { show: false }
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
        textAlign: {
            type: String,
            default: 'left',
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
        let _this = this;
        if (_this.dataList.length > 0 && _this.hasDefault) {
            _this.selectedValue = _this.dataList[0].branchName || ""; //给控件赋值默认值  控件显示值
            _this.$emit("input", _this.dataList[0].branchId || ""); //控件返回值
            _this.nonDisplayValue = _this.dataList[0].item.nonDisplay || "";
        }
    },
    mounted: function () {
        //存在value,显示value  供存草稿使用
        var _this = this;
        if (_this.value || _this.value == 0) {
            var text = _this.value;
            if (_this.isInDetailFlag) {
                //明细
                text = _this.$root.content.inDetail[_this.idx].branchDisplay || ""; //值显示
            } else if (_this.isInNextOprFlag) {
                //在业务组件中的显示值
                text = _this.bisBranchDisplay;
            } else {
                text = _this.$root.content.branchDisplay || ""; //值显示
            }
            _this.selectedValue = text;
        }
        //检测键盘是否弹起并设置下拉框弹出延时
        $(document).on("focus", "input,textarea", function () {
            _this.delayShow = 450;
        });
        $(document).on("blur", "input,textarea", function () {
            setTimeout(function () {
                _this.delayShow = 0;
            }, 500);
        });
    },
    methods: {
        /**
         * 打开选择页面
         */
        openPopup: function () {
            var _this = this;
            _this.searchValue = "";
            _this.pageIndex = 1;
            _this.dataList = [];

            //打开二级页面记住一级页面滚动位置
            var bodyScrTop = $("body").scrollTop();
            $("body").css({
                overflow: "hidden",
                position: "fixed",
                top: bodyScrTop * -1
            });
            $("body").attr("bodyScrTop", bodyScrTop);

            var bankId = "";




            for (var i = 0; i < _this.relationFiledIds.length; i++) {
                var refKey = _this.relationFiledIds[i];
                if (refKey == "bankValue") {
                    //判断是否明细
                    if (this.isInDetailFlag) {
                        bankId = this.$parent.inDetailValue[this.idx][refKey];
                    } else if (this.isInNextOprFlag) {
                        //判断是否后续操作组件
                        bankId = this.$parent.nextOprData[refKey];
                    } else {
                        if (this.$root.$refs[refKey]) {
                            if (!!this.$root.$refs[refKey][0].current['bankId']) {
                                bankId = this.$root.$refs[refKey][0].current['bankId'];
                            } else {
                                bankId = this.$root.$refs[refKey][0].value;
                            }
                        } else {
                            bankId = this.$root.content.bankId;
                        }
                    }

                    _this.bankId = bankId;
                }
            }


            if (_this.$root.templetType == 37) {
                _this.bankId = this.$root.content.bankId;
                bankId = _this.bankId;
            }
            if (!bankId || "" == bankId) {
                var msg = "请先选择银行！";
                showToast(msg);
                return false;
            }

            _this.searchShowFlag = true;
            _this.showBranch(false);
        },
        choosedItem: function (item) {
            var _this = this;
            _this.setBodysrcTop();
            $(".scrollDiv").scrollTop(0);
            this.selectFlag.show = false;
            _this.selectedValue = item.branchName; //控件显示值
            _this.nonDisplayValue = item.nonDisplay;
            setTimeout(() => {
                _this.$emit("input", item.branchId); //控件返回值
                _this.setContentValue("branchDisplay", item.branchName);
                //做出选择后清空搜索框
                _this.searchValue = "";
                _this.cleanSearchShow = false;
                initTitleMenu(_this.subTitle); //设置title及按钮
            }, 500);
        },
        /**
         * 设置父组件content中的值
         * @param {Object} key   数据中的key
         * @param {Object} value 数据中的value
         */
        setContentValue: function (key, value) {
            var _this = this;
            //如果在明细中，需要区分
            if (_this.isInDetailFlag) {
                //明细
                _this.$root.content.inDetail[_this.idx][key] = value; //传递给服务器
            } else {
                _this.$root.content[key] = value; //给content中另存一个bankDisplay的值
            }
        },
        /**
         * 查询分行信息
         */
        showBranch: function (isMore) {
            var _this = this;
            _this.selectShowControl();
            _this.nostatis = true;
            let branchList;
            //var branchValue = _this.branchValue;
            //翻页处理
            if (isMore) {
                _this.pageIndex++;
            }
            var param = {
                bankId: _this.bankId,
                pageIndex: _this.pageIndex,
                pageNum: _this.pageNum
            };
            if (!!_this.searchValue) {
                param["searchKeys"] = _this.searchValue;
            } else {
                param["searchKeys"] = "";
            }
            _this.loadingCtrl = true;
            cryptPost("approval/getBranchList.do", param).then(function (result) {
                //根据已选银行，请求支行
                _this.loadingCtrl = false;
                branchList = result.branchList;
                if (branchList.length < 1 && !isMore && !_this.searchValue) {
                    showToast("暂无支行信息，请重新选择");
                    return false;
                }
                _this.dataList.push.apply(_this.dataList, branchList);
                if (_this.pageNum > branchList.length) {
                    _this.loadendingCtrl = true;
                }
                if (_this.dataList.length < 1) {
                    _this.nostatis = false;
                }
            });
        },
        /**
         * 下拉框显示隐藏控制
         */
        selectShowControl: function () {
            var _this = this;
            //等待键盘收起再弹出下拉 框
            if (isPC()) {
                _this.popupShowFlag = true;
            } else {
                setTimeout(function () {
                    _this.popupShowFlag = true;
                    _this.delayShow = 0;
                }, _this.delayShow);
            }
            // //打开二级页面记住一级页面滚动位置
            // var bodyScrTop = $("body").scrollTop();
            // $("body").css({
            //   overflow: "hidden",
            //   position: "fixed",
            //   top: bodyScrTop * -1
            // });
            // $("body").attr("bodyScrTop", bodyScrTop);
            _this.selectFlag.show = true;
            setTitleOnly("选择" + this.title);
        },
        /*             
        * 设置页面body滚动高度，用于显示隐藏二级页面时保持一级页面的高度
        * */
        setBodysrcTop: function () {
            //关闭二级页面设置一级页面滚动位置
            $("body").css({
                overflow: "auto",
                position: "static",
                top: "auto"
            });
            $("body").scrollTop($("body").attr("bodyScrTop"));
        },
        searchBranch: function (key) {
            var _this = this;
            _this.pageIndex = 1;
            _this.dataList = [];
            _this.searchValue = key;
            _this.showBranch();
        },
        cleanSearch: function () {
            var _this = this;
            _this.searchValue = "";
            _this.cleanSearchShow = false;
            _this.showBranch();
        },
        /**
         * 滚动事件
         */
        showMore: function () {
            var _this = this;
            requestAnimationFrame(function () {
                var scrollHeight = _this.$refs.apingUl.scrollHeight;
                var clientHeight = _this.$refs.apingUl.clientHeight;
                var scrollTop = _this.$refs.apingUl.scrollTop;
                if (scrollHeight - scrollTop < clientHeight + 1) {
                    console.log("yyuuu");
                    _this.showBranch(true);
                }
            });
        }
    },
    watch: {
        /**
         * 父组件控件组件显示隐藏标识
         * @param {Object} newVal  新值
         * @param {Object} oldVal  旧值
         */
        "selectFlag.show": function (newVal, oldVal) {
            var _this = this;
            if (!this.selectFlag.show) {
                //父组件隐藏子组件
                this.popupShowFlag = false;
            }
        },
        /**
         * 数据显示 主要针对删除使用
         * @param {Object} newVal
         * @param {Object} oldVal
         */
        value: function (newVal, oldVal) {
            var _this = this;
            if (_this.value || _this.value == 0) {
                if (_this.isInDetailFlag) {
                    //明细
                    _this.selectedValue =
                        _this.$root.content.inDetail[_this.idx].branchDisplay || ""; //值显示
                } else {
                    _this.selectedValue = _this.$root.content.branchDisplay || ""; //值显示
                }
            } else {
                _this.selectedValue = "";
                _this.nonDisplayValue = "";
            }
        }
    }
};
</script>
