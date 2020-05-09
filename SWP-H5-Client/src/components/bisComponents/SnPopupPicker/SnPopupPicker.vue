<template>
    <div class="snPopupPicker">
        <div v-if="detailFlag">
            <!--<cell :title="title+(titleIndex?titleIndex:'')" :value="selectedValue"  value-align="left"> </cell>-->
            <account-number
                :title="title + (titleIndex ? titleIndex : '')"
                :value="selectedValue"
                :showFlag="false"
            ></account-number>
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
                    :style="inputStyle"
                    class="popupInput sn-pointer"
                    maxlength="20"
                    :placeholder="placeholder"
                    readonly="readonly"
                    ref="input"
                    :value="selectedValue"
                />
                <i class="loading" v-show="isLoading">&nbsp;&nbsp;</i>
            </cell>
            <div v-transfer-dom>
                <popup
                    class="full-s"
                    v-model="popupShowFlag"
                    position="right"
                    width="100%"
                >
                    <div class="sn-main-con">
                        <div class="position-horizontal-demo popupDebit">
                            <!-- list里面的参数为 src-图标  title-显示数据 value-返回数据-->
                            <panel
                                :list="dataList"
                                type="1"
                                @on-click-item="choosedItem"
                            ></panel>
                        </div>
                    </div>
                </popup>
            </div>
        </div>
    </div>
</template>

<script>
import { getBankType } from '../../../lib/common/SnJsBridge.js';
import { cryptPost } from '../../../lib/common/base.js';
import PayHandler from '../../../lib/PayHandler.js';
import AttendanceHandler from '../../../pages/attendance/AttendanceHandler.js';
import {
    showToast,
    initTitleMenu,
    setTitleOnly,
    isPC,
    getBankConfig,openPage,showConfirm
} from '../../../lib/common/extend.js';
import { Group, Popup, PopupHeader, Panel, Cell, TransferDom } from 'vux';
import AccountNumber from '../AccountNumber/AccountNumber.vue';

export default {
    directives: {
        TransferDom
    },
    components: {
        Group,
        Popup,
        PopupHeader,
        Panel,
        Cell,
        AccountNumber
    },
    data: function () {
        return {
            selectedValue: '',
            popupShowFlag: false,
            appBankType: '',
            delayShow: 0,//等待键盘收起再弹出下拉框
            bankName: '',
            iconImg: '',//银行图标路径
            nonDisplayValue: '',
        }
    },
    props: {
        title: {//title
            type: String,
            default: ""
        },
        titleIndex: {//titleIndex
            type: Number,
        },
        subTitle: {
            type: Array,
            default() {
                return []
            }
        },
        dataList: {//list数据
            type: Array,
            default() {
                return []
            }
        },
        value: {
            type: Number
        },
        funName: {//传递进来的方法名
            type: String,
            default: ""
        },
        columns: {
            type: Number,
            default: 1
        },
        placeholder: {//控件提示
            type: String,
            default: ""
        },
        noTips: {//为空提示信息
            type: String,
            default: "数据为空"
        },
        hasDefault: {//默认值，默认为没有
            type: Boolean,
            required: false,
            default: false
        },
        selectFlag: {
            type: Object,
            default: { 'show': false }
        },
        flag: {
            type: Boolean,
            default: true
        },
        cssClass: {
            type: String,
            default: ""
        },
        selectType: {//下来框的类型，根据类型获取不同的下拉框值
            type: String,
            default: ""
        },
        relationFiledIds: {
            type: Array,
            default: function () {
                return []
            }
        },
        isInDetailFlag: {//是否明细组件 默认为否
            type: Boolean,
            default: false
        },
        isInNextOprFlag: {//是否后续操作组件 默认为否
            type: Boolean,
            default: false
        },
        idx: { //组件的index
            type: Number
        },
        fieldKey: {
            type: String,
            default: null
        },
        disabledFlag: {//申请填了支付方式  后续的需要不让选
            type: Boolean
        },
        detailFlag: {//详情入口
            type: Boolean
        },
        bisBranchDisplay: {//支行在转账业务组件中的显示值
            type: String,
            default: null
        },
        isLoading: {
            type: Boolean,
            default: false
        },
        textAlign:{
            type:String,
            default:'left'
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
    beforeCreate: function () {
        var _this = this;
        getBankType(_this); //获取银行type
    },
    created: function () {
        var _this = this;
        _this.getDataList().then((res) => {
            _this.dataList = res;
            if (_this.dataList.length > 0 && _this.hasDefault) {
                _this.selectedValue = _this.dataList[0].dispValue || '';//给控件赋值默认值  控件显示值
                _this.$emit('input', _this.dataList[0].value || '');//控件返回值
                _this.$emit('change', _this.selectedValue);
                _this.nonDisplayValue = _this.dataList[0].item.nonDisplay || '';
            }
        });
    },
    mounted: function () {//存在value,显示value  供存草稿使用
        var _this = this;
        if (_this.value || _this.value == 0) {
            var text = _this.value;
            var nonDisplay = '';
            if (_this.selectType == "branch") {//如果是支行，则在content中的存储branchDisplay来显示
                if (_this.isInDetailFlag) {//明细
                    text = _this.$root.content.inDetail[_this.idx].branchDisplay || '';//值显示
                } else if (_this.isInNextOprFlag) {//在业务组件中的显示值
                    text = _this.bisBranchDisplay;
                } else {
                    text = _this.$root.content.branchDisplay || '';//值显示
                }
                _this.selectedValue = text;
                _this.nonDisplayValue = nonDisplay;
            } else {
                _this.getDataList().then((res) => {
                    _this.dataList = res;
                    if (!!_this.dataList && _this.dataList.length > 0) {
                        _this.dataList.forEach(function (item) {
                            if (_this.value == item.value) {
                                text = item.dispValue;
                                nonDisplay = item.nonDisplay;
                            }
                        });
                        _this.selectedValue = text;
                        _this.nonDisplayValue = nonDisplay;
                    }
                });
            }

            //如果请假模板保存草稿的时候，查询剩余的年假逻辑处 理
            if (_this.fieldKey == 'type_554' && _this.selectedValue == '年假') {
                AttendanceHandler.holidaySet(_this.selectedValue, _this);
            }
        }
        //检测键盘是否弹起并设置下拉框弹出延时
        $(document).on("focus", "input,textarea", function () {
            _this.delayShow = 450;
        })
        $(document).on("blur", "input,textarea", function () {
            setTimeout(function () {
                _this.delayShow = 0;
            }, 500)
        })
    },
    methods: {
        /**
         * 打开选择页面
         */
        openPopup: function () {
            var _this = this;
            if (_this.selectType == "branch") {
                _this.showBranch();
            } else {
                if (!_this.detailFlag) {
                    _this.selectShowControl();
                }
            }

            initTitleMenu([`选择${this.title}`, {
                name: 'true',
                type: 4,
                menuId: 'returnBtn'
            }]);
        },
        /**
         * 选中点击事件
         * @param {Object} item
         */
        choosedItem: function (item) {
            var _this = this;
            _this.setBodysrcTop();
            this.selectFlag.show = false;
            _this.selectedValue = item.dispValue;//控件显示值
            _this.nonDisplayValue = item.nonDisplay;
            setTimeout(() => {
                _this.$emit('input', item.value);//控件返回值
                _this.$emit('change', { 'select': item.dispValue });
                if (_this.selectType == "branch") {//如果是支行，则在content中的存储branchDisplay来显示
                    _this.setContentValue('branchDisplay', item.dispValue);
                }
                initTitleMenu(_this.subTitle);//设置title及按钮
            }, 500)
            //查询剩余的年假逻辑处理，年假是后续操作，页面没有后续操作列表，只能在此处写判断条件
            if (_this.fieldKey == 'type_554') {
                AttendanceHandler.holidaySet(_this.selectedValue, _this);
            }
        },
        /**
         * 设置父组件content中的值
         * @param {Object} key   数据中的key
         * @param {Object} value 数据中的value
         */
        setContentValue: function (key, value) {
            var _this = this;
            //如果在明细中，需要区分
            if (_this.isInDetailFlag) {//明细
                _this.$root.content.inDetail[_this.idx][key] = value;//传递给服务器
            } else {
                _this.$root.content[key] = value;//给content中另存一个bankDisplay的值
            }
        },
        /**
         * 查询结算卡数据
         */
        getDebitcardList: function () {
            var _this = this;
            var debitcardList = [];
            _this.isLoading = true;
            return cryptPost('approval/queryCpyDebitCardList.do', {}).then(function (result) {
                _this.isLoading = false;
                debitcardList = result.debitCardList;
                _this.debitcard = debitcardList[0];
                return new Promise(function (res, rej) {
                    res(debitcardList.map(function (item) {
                        return {
                            // src:_this.iconImg, //取消显示icon 和银行名
                            // title:_this.bankName+'('+item.substring(item.length - 4, item.length)+')',
                            title: item,
                            value: item,
                            dispValue: item
                        }
                    }))
                });
                // return _this.dataList = debitcardList.map(function(item){
                // 	return {
                // 		src:_this.iconImg,
                // 		title:_this.bankName+'('+item.substring(item.length - 4, item.length)+')',
                // 		value:item,
                // 	    dispValue:item
                //     }
                // });
            }, function () {
                _this.isLoading = false;
            });
        },
        /**
         * 获取密码器模板 付方账号
         */
        getAccountList: function (syncAcct) {
            var _this = this;
            _this.isLoading = true;
                if(syncAcct == 1){
                    // 转账不需要密码器同步的账号
                        return cryptPost('approval/getAccountList.do', {includeSyncAcct:syncAcct}).then(function (result) {
                        _this.isLoading = false;
                        return new Promise(function (res, rej) {
                            res(result.accountList.map(function (item) {
                                return {
                                    title: item.account,
                                    value: item.account,
                                    dispValue: item.account,
                                    nonDisplay: item.name
                                }
                            }));
                        });
                    }, function () {
                        _this.isLoading = false;
                    });
                }else{
                return PayHandler.getPubAcc().then(function (result) {
                _this.isLoading = false;
                return new Promise(function (res, rej) {
                    res(result.accountList.map(function (item) {
                        return {
                            title: item.account,
                            value: item.account,
                            dispValue: item.account,
                            nonDisplay: item.name
                        }
                    }));
                });
            }, function () {
                _this.isLoading = false;
            });
                }
        },
        /**
         * 查询分行信息
         */
        showBranch: function () {
            var _this = this;
            var branchList;
            var branchDataList;
            //var branchValue = _this.branchValue;
            var bankId = '';
            var cityId = '';

            for (var i = 0; i < _this.relationFiledIds.length; i++) {
                var refKey = _this.relationFiledIds[i];
                if (refKey == 'cityName') {
                    //判断是否明细
                    if (this.isInDetailFlag) {
                        //      					cityId = this.$parent.$refs[refKey][this.idx].cityValue;
                        cityId = this.$parent.inDetailValue[this.idx][refKey];
                    } else if (this.isInNextOprFlag) { //判断是否后续操作组件
                        cityId = this.$parent.nextOprData[refKey];
                    } else {
                        cityId = this.$root.$refs[refKey][0].cityValue;
                    }

                    _this.cityId = cityId;
                }
                if (refKey == 'bankValue') {
                    //判断是否明细
                    if (this.isInDetailFlag) {
                        bankId = this.$parent.inDetailValue[this.idx][refKey];
                    } else if (this.isInNextOprFlag) {//判断是否后续操作组件
                        bankId = this.$parent.nextOprData[refKey];
                    } else {
                        if (this.$root.$refs[refKey]) {
                            if (!!this.$root.$refs[refKey][0].choosedBank) {
                                bankId = this.$root.$refs[refKey][0].choosedBank;
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
            if (!bankId || '' == bankId || !cityId || '' == cityId) {
                var msg = '请先选择银行和所在省市！';
                if (_this.$root.templetType == 37) {
                    msg = '请先选择开户地区！';
                }
                showToast(msg);
                return false;
            }
            cryptPost('approval/getBranchList.do', { bankId: bankId, cityId: cityId }).then(function (result) { //根据已选银行，省市，请求支行
                branchList = result.branchList;
                if (branchList.length < 1) {
                    showToast('暂无支行信息，请重新选择');
                    return false;
                }
                _this.dataList = branchList.map(function (item) {
                    return {
                        title: item.branchName,
                        value: item.branchId,
                        dispValue: item.branchName
                    }
                });
                _this.selectShowControl();
            });
        },
        /**
         * 下拉框显示隐藏控制
         */
        selectShowControl: function () {
            var _this = this;
            if (0 < this.dataList.length) {
                //等待键盘收起再弹出下拉 框
                if (isPC()) {
                    _this.popupShowFlag = true;
                } else {
                    setTimeout(function () {
                        _this.popupShowFlag = true;
                        _this.delayShow = 0;
                    }, _this.delayShow);
                }
                //打开二级页面记住一级页面滚动位 置
                var bodyScrTop = $("body").scrollTop();
                $("body").css({
                    'overflow': 'hidden',
                    'position': 'fixed',
                    'top': bodyScrTop * -1
                });
                $("body").attr("bodyScrTop", bodyScrTop);
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
        setBodysrcTop: function () {
            //关闭二级页面设置一级页面滚动位置
            $("body").css({
                'overflow': 'auto',
                'position': 'static',
                'top': 'auto'
            });
            $("body").scrollTop($("body").attr("bodyScrTop"));
        },
        getDataList: function () {
            var _this = this;
            return new Promise(function (res) {
                if (_this.dataList && 0 < _this.dataList.length) {
                    res(_this.dataList);
                } else {
                    if (_this.selectType == "debitcard") {//取结算卡列表数据
                        //从服务器获取结算卡的数据
                        return _this.getDebitcardList().then(data => {
                            res(data);
                        });
                    } else if (_this.selectType == "payerAccount") {//票据模板 付方账号     后续需要优化
                        //从服务器获取密码器模板 付方账号
                        return _this.getAccountList(_this.accountFrom).then(data => {
                            res(data);
                        });
                    } else if (_this.selectType == "orgCode") {//获取电子缴税记账机构号及税单所属地区
                        return _this.getAcctOrgList().then(data => {
                            res(data);
                        })
                    }
                }
            });

        },
        getAcctOrgList() {
            var _this = this;
            _this.isLoading = true;
            return cryptPost('epaytax/queryAcctOrgList.do').then(function (result) {
                _this.isLoading = false;
                return new Promise(function (res, rej) {
                    res(result.acctOrgList.map(function (item) {
                        return {
                            value: item.orgCode,
                            dispValue: item.orgName,
                            title: item.orgName
                        }
                    }));
                });
            }, function () {
                _this.isLoading = false;
            });
        }
    },
    watch: {
        /**
         * 父组件控件组件显示隐藏标识
         * @param {Object} newVal  新值
         * @param {Object} oldVal  旧值
         */
        'selectFlag.show': function (newVal, oldVal) {
            var _this = this;
            if (!this.selectFlag.show) {//父组件隐藏子组件
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
                if (_this.selectType == "branch") {//如果是支行，则在content中的存储branchDisplay来显示
                    if (_this.isInDetailFlag) {//明细
                        _this.selectedValue = _this.$root.content.inDetail[_this.idx].branchDisplay || '';//值显示
                    } else {
                        _this.selectedValue = _this.$root.content.branchDisplay || '';//值显示
                    }
                } else {
                    if (!!_this.dataList && _this.dataList.length > 0) {
                        var valueFlag = false;
                        _this.dataList.forEach(function (item) {
                            if (_this.value == item.value) {
                                _this.selectedValue = item.dispValue;
                                valueFlag = true;
                            }
                        });
                        if (!valueFlag) {//针对自增下拉
                            _this.selectedValue = '';
                            _this.nonDisplayValue = '';
                        }
                    }
                }
            } else {
                _this.selectedValue = '';
                _this.nonDisplayValue = '';
            }
        },
    }
}
</script>

<style lang="less">
@import (reference) "../../style/common.less";

.snPopupRight {
    position: relative;

    i.loading {
        display: inline-block;
        width: 0.5rem;
        height: 0.5rem;
        background: url(../resource/img/loading.gif) no-repeat center;
        position: absolute;
        right: 0.25rem;
        top: 50%;
        margin-top: -12px;
        background-size: contain;
    }
}

.snPopupRight .weui-cell__ft {
    .flex-box();

    &:after {
        content: "";
        width: 0.42rem;
        height: 0.42rem;
        background: url(../resource/img/icon_narrow_right.png) no-repeat center;
        background-size: 0.42rem 0.42rem;
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
    }
}

@media screen and (min-width: @pc-width) {
    .snPopupRight .weui-cell__ft {
        height: 30px;

        &:after {
            width: 20px;
            height: 30px;
            background-size: 22px 22px;
        }
    }

    .snPopupRight {
        i.loading {
            right: 55px;
        }

        .weui-cell__ft {
            padding: 0 0 0 10px;
        }
    }

    .snPopupPicker .weui-media-box {
        padding: 9px 15px;
        position: relative;
    }

    .snPopupPicker .weui-media-box__title {
        font-weight: normal;
        font-size: 14px;
    }
}
</style>