<template>
    <div class="snPopupPicker">
        <cell :title="initData.title+(titleIndex?titleIndex:'')" value-align="left" class="snPopupRight"
            @click.native="openPopup">
            <input type="text" class="popupInput" maxlength="20" :placeholder="initData.placeholder" readonly="readonly"
                ref="input" :value="selectedValue">
            <i class="loading" v-show="isLoading">&nbsp;&nbsp;</i>
        </cell>
        <popup v-model="popupShowFlag" position="right" width="100%">
            <div class="position-horizontal-demo popupDebit">
                <!-- list里面的参数为 src-图标  title-显示数据 value-返回数据-->
                <panel :list="dataList" type="1" @on-click-item="choosedItem"></panel>
            </div>
        </popup>
    </div>
</template>

<script>
    import './SnPopupPicker.less';
    import { showToast, getStorage, initTitleMenu, setTitleOnly, isPC } from '../../lib/common/extend.js';
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
                delayShow: 0,//等待键盘收起再弹出下拉框
                nonDisplayValue: '',
            }
        },
        props: {
            titleIndex: {//titleIndex
                type: Number,
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
            columns: {
                type: Number,
                default: 1
            },
            selectFlag: {
                type: Object,
                default: { 'show': false }
            },
            initData: {
                type: Object,
                default: {
                    title: '请选择',
                    placeholder: "请选择(必填)",
                    noTips: '数据为空',
                    subTitle: ['选择'],
                }
            },
            flag: {
                type: Boolean,
                default: true
            },
            selectType: {//下来框的类型，根据类型获取不同的下拉框值
                type: String,
                default: ""
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
        },
        mounted: function () {//存在value,显示value  供存草稿使用
            var _this = this;
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
                this.selectShowControl();
            },
            choosedItem: function (item) {
                var _this = this;
                _this.setBodysrcTop();
                this.selectFlag.show = false;
                _this.selectedValue = item.dispValue;//控件显示值
                _this.nonDisplayValue = item.nonDisplay;
                setTimeout(() => {
                    _this.$emit('input', item.value);//控件返回值
                    initTitleMenu(_this.initData.subTitle);//设置title及按钮
                }, 500)
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
                    setTitleOnly("选择" + _this.initData.subTitle[0]);
                } else {
                    this.selectFlag.show = false;
                    showToast(this.initData.noTips);
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
            content: ' ';
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
        .snPopupRight {
            i.loading {
                right: 55px;
            }

            .weui-cell__ft {
                height: 30px;
                padding: 0 20px 0 10px;

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