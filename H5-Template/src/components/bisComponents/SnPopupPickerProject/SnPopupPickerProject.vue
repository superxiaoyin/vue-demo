<template>
    <div class="snPopupPicker">
        <div v-if="detailFlag">
            <!--<cell :title="title+(titleIndex?titleIndex:'')" :value="selectedValue"  value-align="left"> </cell>-->
            <account-number :title="title+(titleIndex?titleIndex:'')" :value="selectedValue" :showFlag="false">
            </account-number>
        </div>
        <div v-else>
            <cell :title="title+(titleIndex?titleIndex:'')" value-align="left" class="snPopupRight"
                @click.native="openPopup">
                <input type="text" class="popupInput" maxlength="20" :placeholder="placeholder" readonly="readonly"
                    ref="input" :value="selectedValue">
                <i class="loading" v-show="isLoading">&nbsp;&nbsp;</i>
            </cell>
            <popup class="full-s" v-model="popupShowFlag" position="right" width="100%">
                <div class="sn-main-con">
                    <div class="position-horizontal-demo popupDebit">
                        <!-- list里面的参数为 src-图标  title-显示数据 value-返回数据-->
                        <panel :list="dataList" type="1" @on-click-item="choosedItem"></panel>
                    </div>
                </div>
            </popup>
        </div>
    </div>
</template>

<script>
    import './SnPopupPickerProject.less';
    import { cryptPost } from '../../../lib/common/base.js';
    import PayHandler from '../../../lib/PayHandler.js';
    import AttendanceHandler from '../../../pages/attendance/AttendanceHandler.js';
    import { showToast, getStorage, setStorage, deleteStorage, initTitleMenu, setTitleOnly, isPC, getBankConfig } from '../../../lib/common/extend.js';
    import { Group, Popup, PopupHeader, Panel, Cell } from 'vux';
    export default {
        components: {
            Group,
            Popup,
            PopupHeader,
            Panel,
            Cell,
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
                required: true,
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
                default: []
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
            }
        },
        beforeCreate: function () {
            var _this = this;
        },
        created: function () {
            var _this = this;
            _this.getProjectDataList().then((res) => {
                _this.dataList = res;
                if (_this.dataList && _this.dataList.length > 0 && _this.hasDefault) {
                    _this.selectedValue = _this.dataList[0].dispValue || '';//给控件赋值默认值  控件显示值
                    _this.$emit('input', _this.dataList[0].value || '');//控件返回值
                    _this.$emit('change', _this.selectedValue);
                    _this.nonDisplayValue = _this.dataList[0].item.nonDisplay || '';
                }
            });
            //_this.getBankInfo();
        },
        mounted: function () {//存在value,显示value  供存草稿使用
            var _this = this;
            if (_this.value || _this.value == 0) {
                var text = "";
                var nonDisplay = '';
                _this.getProjectDataList().then((res) => {
                    _this.dataList = res;
                    if (!!_this.dataList && _this.dataList.length > 0) {
                        _this.dataList.forEach(function (item) {
                            if (_this.value == item.value) {
                                text = item.dispValue;
                                nonDisplay = item.nonDisplay;
                                _this.setContentValue(text);
                            }
                        });
                        _this.selectedValue = text;
                        _this.nonDisplayValue = nonDisplay;
                    }
                });
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
            },
            choosedItem: function (item) {
                var _this = this;
                _this.setBodysrcTop();
                this.selectFlag.show = false;
                _this.selectedValue = item.dispValue;//控件显示值
                _this.nonDisplayValue = item.nonDisplay;
                setTimeout(() => {
                    _this.$emit('input', item.value);//控件返回值
                    _this.$emit('change', { 'select': item.dispValue });
                    _this.setContentValue(item.dispValue);
                    initTitleMenu(_this.subTitle);//设置title及按钮
                }, 500)
                //查询剩余的年假逻辑处理，年假是后续操作，页面没有后续操作列表，只能在此处写判断条件
                if (_this.fieldKey == 'type_554') {
                    AttendanceHandler.holidaySet(_this.selectedValue, _this);
                }
            },
            /**
             * 设置父组件content中的值
             * @param {Object} value 数据中的value
             */
            setContentValue: function (value) {
                var _this = this;
                //如果在明细中，需要区分
                if (_this.isInDetailFlag) {//明细
                    _this.$root.content.inDetail[_this.idx]['projectName'] = value;//传递给服务器
                } else {
                    _this.$root.content["projectName"] = value;//给content中另存一个bankDisplay的值
                }
            },
            /**
             * 获取项目管理数据
             */
            getProjectList: function () {
                var _this = this;
                _this.isLoading = true;
                return cryptPost('approval/queryCompanyProject.do').then(function (result) {
                    _this.isLoading = false;
                    return new Promise(function (res, rej) {
                        res(result.projList.map(function (item) {
                            return {
                                value: item.projId,
                                dispValue: item.projName,
                                title: item.projName
                            }
                        }));
                    });
                }, function () {
                    _this.isLoading = false;
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
            /**
             * 获取项目管理的项目数据
             */
            getProjectDataList: function () {
                var _this = this;
                return new Promise(function (res) {
                    if (_this.dataList && 0 < _this.dataList.length) {
                        res(_this.dataList);
                    } else {
                        //从服务器获取密码器模板 付方账号
                        return _this.getProjectList().then(data => {
                            res(data);
                        });
                    }
                });

            },
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
                } else {
                    _this.selectedValue = '';
                    _this.nonDisplayValue = '';
                }
            },
        }
    }
</script>

<style lang="less">
    @import '../../style/common.less';

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
            content: '';
            position: absolute;
            width: 0.9rem;
            height: 0.9rem;
            top: 50%;
            /*    right: 0.06rem;*/
            margin-top: -0.45rem;
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
                content: '';
                position: absolute;
                width: 20px;
                height: 30px;
                top: 50%;
                right: 90px;
                margin-top: -15px;
                background: url(../resource/img/icon_narrow_right.png) no-repeat center;
                background-size: 22px 22px;
                display: inline-block;
                vertical-align: middle;
                cursor: pointer;
            }
        }

        .snPopupRight {
            i.loading {
                right: 55px;
            }

            .weui-cell__ft {
                padding: 0 20px 0 10px;
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