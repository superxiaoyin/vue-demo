<template>
    <div class="snBankList">
        <cell :title="title" value-align="left" @click.native="openPopup">
            <input type="text" :style="inputStyle" class="popupInput sn-nowrap sn-pointer" maxlength="20" :placeholder="placeholder" readonly="readonly" ref="input">
        </cell>
        <div v-transfer-dom>
            <popup v-model="popupShowFlag" position="right" width="100%" class="bankListPopup">
                <div class="navTab" v-if="isPC">
                    <div :class="item" v-for="(item,index) in indexList" :index="index" :key="index" v-text="item" v-on:mouseenter="goIndex(item,$event)"></div>
                </div>
                <div class="navTab" v-else>
                    <div class="a2z" :class="item" v-for="(item,index) in indexList" :index="index" :key="index" v-text="item"></div>
                </div>
                <div class="position-horizontal-demo popupDebit snBankList">
                    <div class="atozshow" v-show="atozshow && ''!=atozText" v-text="atozText"></div>
                    <!-- list里面的参数为 src-图标  title-显示数据 value-返回数据-->
                    <!--<panel :list="dataList"  type="1" @on-click-item="choosedItem" @on-img-error="onImgError"></panel>-->
                    <div :id="item.href" v-for="(item,id) in dataList" @click.prevent="choosedItem(item)" :key="id" :class="{lineText:item.flag,lineTitle:!item.flag}">
                        <div class="lineBank sn-pointer" :class="{choosed:item.value==choosedBank}" :ref="item.value">
                            <!--<img v-if="item.src" :src="item.src" alt="" @error="onImgError(item)">-->
                            <span v-text="item.title" :class="hideBankId == item.bankId?'hideClass':''"></span>
                        </div>
                    </div>
                </div>
            </popup>
        </div>
    </div>
</template>
<style lang="less" src="./SnBankList.less"></style>
<script>
import { Group, Popup, TransferDom, PopupHeader, Panel, Cell, dateFormat } from 'vux';
import { cryptPost, getClass } from '../../../lib/common/base.js';
import { showToast, getStorage, setStorage, initTitleMenu, setTitleOnly, isPC, deleteStorageByName } from '../../../lib/common/extend.js';
import { AmountLimit } from '../../../pages/approval/ApprovalConstantData.js';
export default {
    directives: {
        TransferDom
    },
    components: {
        Group,
        Popup,
        PopupHeader,
        Panel,
        Cell
    },
    data: function () {
        return {
            popupShowFlag: false,
            dataList: [],
            indexList: [],
            atozshow: false,//触摸组件是否显示大文字
            atozText: '',//触摸组件大文字内容
            atozIndex: '',//触摸选中的id
            xTouch: {
                cardH: 0,//取卡片高度
                cardLength: 0,//卡片数量
                startX: 0,//touch事件起始点坐标
                startY: 0,//touch事件起始点坐标
                scrollY: 0,//touch事件Y轴移动距离
            },
            choosedBank: -1,
            selectedValue: '',
            isPC: isPC(),
            delayShow: 0,//等待键盘收起再弹出下拉框
            changeAccount: true, //根据账号是否变更，判断是否需要打开框
        }
    },
    props: {
        title: {//title
            type: String,
            default: ""
        },
        subTitle: {
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
            default: "暂无数据，请刷新重试"
        },
        //		    backUrl:{//点击返回时返回的url
        //		    	type:String,
        //              default: "yqt.do?active=1"//默认返回银企通首页
        //		    },
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
        disabledFlag: {//控件是否可点击选择  默认可以点击选择
            type: Boolean,
            default: false
        },
        relationFiledIds: {
            type: String,
            default: ''
        },
        isInDetailFlag: {//是否明细组件 默认为否
            type: Boolean,
            default: false
        },
        idx: { //组件的index
            type: Number
        },
        hideBankId: { //0814 北京银行需求 需要隐藏的银行id
            type: Number
        },
        bankName: {
            type: String,
            default: ''
        },
        payeeAccount: { //1128 增加卡bin判断
            type: String
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
    beforeCreate: function () {

    },
    created: function () {
        var _this = this;
        _this.getIndex();
        _this.getBankList().then(dataList => {
            _this.dataList = dataList;
            if (_this.dataList.length > 0 && _this.hasDefault) {
                _this.$refs.input.value = _this.dataList[0].dispValue || '';//给控件赋值默认值  控件显示值
                _this.$emit('input', _this.dataList[0].value || '');//控件返回值

                _this.setContentValue(_this.dataList[0].dispValue);
            }
        });

        _this.$nextTick(function () {//银行列表导航栏触摸事件
            setTimeout(function () {
                _this.initxTouch()
            }, 200)
        })
    },
    mounted: function () {//存在value,显示value  供存草稿使用   显示值需要修改为bankDi sp
        var _this = this;
        if (_this.bankName) {
            _this.$refs.input.value = _this.bankName;
            _this.selectedValue = _this.$refs.input.value;
        }
        if (!!_this.value) {
            /*        		if(_this.isInDetailFlag){//明细
                                this.$refs.input.value = _this.$root.content.inDetail[_this.idx].bankDisplay || '' ;//值显示
                            } else if (_this.isInBisFlag) {
                                this.$refs.input.value =  _this.$root.content.bisData.data.bankDisplay || '' ;//值显示
                            } else {
                                this.$refs.input.value =  _this.$root.content.bankDisplay || '' ;//值显 示
                            }*/
            if (!_this.bankName) {
                _this.getBankList().then(dataList => {
                    _this.dataList = dataList;
                    for (var i = 0; i < _this.dataList.length; i++) {
                        if (_this.dataList[i].bankId == _this.value) {
                            _this.$refs.input.value = _this.dataList[i].bankName;
                            break;
                        }
                    }
                    _this.selectedValue = _this.$refs.input.value;
                });
            }
        }
        if (this.hasDefault) {
            this.setDisplayValue(_this.dataList[0].bankId);
            this.$emit('input', this.dataList[0].bankId || '');//控件返回值
        }
        this.choosedBank = this.value;
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
        getIndex: function () {
            var _this = this;
            for (var i = 0; i < 26; i++) {
                _this.indexList.push(String.fromCharCode(65 + i));
            }
        },
        /**
         * 获取银行列表
         */
        getBankList: function () {
            var _this = this;
            //var localVersion = getStorage(["cacheVersionOA"], false);
            var todayStr = dateFormat(new Date(), "YYYY_MM_DD");
            var bankKey = "newBankList" + todayStr;
            var bankJsonKey = "newBankJson" + todayStr;
            //使用localstorage存储数据
            return new Promise(function (res) {
                if (getStorage(bankKey)) {//缓存中存在银行列表
                    var dataList = JSON.parse(getStorage(bankKey));
                    res(dataList);
                } else {
                    deleteStorageByName("newBank");
                    return cryptPost('approval/getBankList.do', {}).then(function (data) {
                        _this.dataList = data.bankList;
                        setStorage(bankKey, JSON.stringify(_this.dataList));//设置银行列表缓存
                        var bankJson = {};
                        for (var i = 0; i < data.bankList.length; i++) {
                            var bank = data.bankList[i];
                            bankJson[bank.bankId] = bank.bankName;
                        }
                        setStorage(bankJsonKey, JSON.stringify(bankJson));
                        res(data.bankList);
                    });
                }
            })
        },
        /**
         * 打开选择页面
         */
        openPopup: function () {

            if (this.disabledFlag) {//禁止选择
                return;
            }
            var _this = this;

            if (_this.payeeAccount && _this.changeAccount) { //传入payeeAccount，有账号或者已变更，查询卡bin，执行处理

                _this.queryCardBelongBank(_this.payeeAccount).then(function (res) {
                    if (!!res && !!res.bankMemberId) {
                        let item = {
                            bankId: res.bankMemberId,
                            //dispValue:res.bankMemberName,
                            value: res.bankMemberId
                        };
                        _this.changeAccount = false;
                        _this.getBankList().then(dataList => {
                            _this.dataList = dataList;
                            for (var i = 0; i < _this.dataList.length; i++) {
                                if (_this.dataList[i].bankId == item.bankId) {
                                    item.dispValue = _this.dataList[i].bankName;
                                    _this.$refs.input.value = item.dispValue;//控件显示值
                                    _this.selectedValue = _this.$refs.input.value;
                                    _this.cleanBranch();//清空支行信息
                                    _this.$nextTick(() => {
                                        _this.choosedBank = item.value;
                                        _this.$emit('input', item.value);//控件返回值
                                        _this.setContentValue(item.dispValue);
                                    })
                                    //break;
                                    return false; //不继续打开选择框，其他清空打开选择框
                                }
                            }

                        });

                    } else {
                        _this.openPopList()
                    }

                })

            } else { //无账号，打开银行选择列表

                _this.openPopList()
            }

        },
        openPopList() {
            let _this = this;
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
                setTitleOnly("选择" + _this.title);
            } else {
                _this.selectFlag.show = false;
                showToast(this.noTips);
            }
        },
        choosedItem: function (item) {
            var _this = this;
            //北京银行0814 需求
            if (_this.hideBankId == item.bankId) {
                return false;
            }
            if (item.flag) {
                _this.setBodysrcTop();
                _this.selectFlag.show = false;
                _this.$refs.input.value = item.dispValue;//控件显示值
                _this.selectedValue = _this.$refs.input.value;
                //非超级网银需要选择支行
                if (undefined != item.joinSuperOnlineBank && false == item.joinSuperOnlineBank) {
                    _this.$emit('interBankValue', true);
                    _this.$root.superBank = false;
                    _this.$root.content.superBank = false;
                } else {
                    if (2 == _this.$root.subTransMethod && parseFloat(_this.$root.content.amount | 0 + _this.$root.content.totalMoney | 0) <= AmountLimit) {//实时
                        _this.$emit('interBankValue', false);
                    }
                    _this.$root.superBank = true;
                    _this.$root.content.superBank = true;
                }
                setTimeout(() => {
                    _this.choosedBank = item.value;
                    _this.$emit('input', item.value);//控件返回值
                    _this.setContentValue(item.dispValue);
                    initTitleMenu(_this.subTitle);//设置title及按钮
                }, 500)
            }
            _this.cleanBranch();

        },
        //清空支行信息
        cleanBranch() {
            let _this = this;
            if (_this.relationFiledIds == 'branch') {//分行下拉框的选择值清空
                if (_this.isInDetailFlag) {//明细
                    _this.$parent.$refs[_this.relationFiledIds][_this.idx].selectedValue = '';
                    //需要清空content中的值，不然会被控件重新赋值
                    _this.$root.content.inDetail[_this.idx].branchDisplay = '';
                    _this.$parent.$refs[_this.relationFiledIds][_this.idx].$emit('input', '');
                } else {//非明细
                    //需要清空content中的值，不然会被控件重新赋值
                    _this.$root.content.branchDisplay = '';
                    if (_this.$root.$refs[_this.relationFiledIds]) {
                        _this.$root.$refs[_this.relationFiledIds][0].selectedValue = '';
                        _this.$root.$refs[_this.relationFiledIds][0].$emit('input', '');
                    }
                    //后续操作中的控件值
                    else if (_this.$parent.$refs[_this.relationFiledIds]) {
                        if (_this.$parent.$refs[_this.relationFiledIds][0]) {
                            _this.$parent.$refs[_this.relationFiledIds][0].selectedValue = '';
                        }
                        if (_this.$parent.$refs[_this.relationFiledIds]) {
                            _this.$parent.$refs[_this.relationFiledIds].selectedValue = '';
                        }
                        if (_this.$parent.nextOprData && _this.$parent.nextOprData[_this.relationFiledIds]) {
                            _this.$parent.nextOprData[_this.relationFiledIds] = '';
                        }
                    }
                }
            }
        },
        /**
         * 图片加载失1败
         */
        onImgError: function (item) {
            item.src = item.fallbackSrc;
        },
        goIndex: function (item, e) {
            var _this = this;
            var itemOffset = $(e.target).parents(".bankListPopup").find('#' + item).offset();
            var aOffset = $(e.target).parents(".bankListPopup").find('#A').offset();
            if (_this.isPC) {
                $(e.target).parents(".bankListPopup").find('.popupDebit').stop().animate({
                    scrollTop: itemOffset.top - aOffset.top
                }, 200);
            }
        },
        goIndexTouch: function (item, e) {
            var itemOffset = $(e).find('#' + item).offset();
            var aOffset = $(e).find('#A').offset();
            if (undefined != itemOffset) {
                $(e).find('.popupDebit').stop().animate({
                    scrollTop: itemOffset.top - aOffset.top
                }, 200);
            }
        },
        /**
         * 设置父组件content中的值
         * @param {Object} bankDisplay
         */
        setContentValue: function (bankDisplay) {
            var _this = this;
            //如果在明细中，需要区分
            if (_this.isInDetailFlag) {//明细
                _this.$root.content.inDetail[_this.idx].bankDisplay = bankDisplay;//传递给服务器
            } else {
                _this.$root.content.bankDisplay = bankDisplay;//给content中另存一个bankDisplay的值
            }
        },
        //初始化xtouch
        initxTouch: function () {
            var _this = this;
            var atozMap = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
            _this.xTouch.cardH = $(".a2z").height();
            _this.xTouch.cardLength = $(".a2z").length;
            $(document).on("touchstart", ".a2z", function (e) {
                _this.xTouch.startY = e.originalEvent.changedTouches[0].pageY;
                _this.goIndexTouch($(this).text(), $(this).parents(".bankListPopup"));
                _this.atozText = $(this).text();
                _this.atozshow = true;
                _this.atozIndex = parseInt($(this).attr("index"));
            });
            $(document).on("touchmove", ".a2z", function (e) {
                e.preventDefault();//阻止默认滚动事件
                _this.xTouch.moveEndY = e.originalEvent.changedTouches[0].pageY;
                _this.xTouch.scrollY = _this.xTouch.moveEndY - _this.xTouch.startY;
                var showAtozIndex = _this.atozIndex + parseInt(_this.xTouch.scrollY / _this.xTouch.cardH);
                if (25 >= showAtozIndex && 0 <= showAtozIndex) {
                    _this.atozText = atozMap[showAtozIndex];
                    _this.goIndexTouch(atozMap[showAtozIndex], $(this).parents(".bankListPopup"));
                } else {
                    _this.atozText = '';
                }
            });
            $(document).on("touchend", ".a2z", function (e) {
                _this.atozshow = false;
                _this.atozText = '';
            });
        },
        /**
         * 根据id设置name
         * @param {Object} bankId
         */
        setDisplayValue: function (bankId) {
            var displayVal = '';
            //          	var localVersion = getStorage(["cacheVersionOA"], false);
            var todayStr = dateFormat(new Date(), "YYYY_MM_DD");
            var bankJsonKey = "newBankJson" + todayStr;
            if (getStorage(bankJsonKey)) {
                if (bankId) {
                    displayVal = JSON.parse(getStorage(bankJsonKey))[bankId];
                } else {
                    displayVal = '';
                }
            }
            if (!!displayVal) {
                this.$refs.input.value = displayVal;
            } else {
                //如果在明细中，需要区分
                if (this.isInDetailFlag) {//明细
                    this.$refs.input.value = this.$root.content.inDetail[this.idx].bankDisplay;
                } else {
                    this.$refs.input.value = this.$root.content.bankDisplay;
                }
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
        queryCardBelongBank(cardNo) {
            return cryptPost('approval/queryCardBelongBank.do', { cardNo: cardNo }).then(function (data) {
                return data;
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
            if (!this.selectFlag.show) {//父组件隐藏子组 件
                this.popupShowFlag = false;
            }
        },
        /**
         * 数据显示 主要针对删除使用
         * @param {Object} newVal
         * @param {Object} oldVal
         */
        value: function (newVal, oldVal) {

            this.setDisplayValue(this.value);
        },
        /**
         * 是否可编辑 默认为是
         * @param {Object} newVal
         * @param {Object} oldVal
         */
        disabledFlag: function (newVal, oldVal) {
            if (newVal) {
                //显示选择箭头
            } else {
                //隐藏选择箭头
            }
        },
        /**
         * 卡号是否变更
         * @param {Object} newVal
         * @param {Object} oldVal
         */
        payeeAccount: function (newVal, oldVal) {
            if (newVal && newVal != '') {
                //已变更,通知状态
                this.changeAccount = true;
            } else {
                //未变更
                this.changeAccount = false;
            }

        }

    }
}
</script>