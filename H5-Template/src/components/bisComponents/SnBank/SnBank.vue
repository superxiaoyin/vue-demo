<template>
    <SnPopupList
        @onChange="onChange"
        @onSelect="onSelect"
        @beforePopup="beforePopup"
        @onHide="onHide"
        :defaultValue="current"
        :title="title"
        :list="dataList"
        :placeholder="placeholder"
        :textAlign="textAlign"
        :keyPropName="keyPropName"
        :valuePropName="valuePropName"
        :selectFlag="selectFlag"
        size="small"
        v-model="show"
    >
        <div class="sn-bank-nav">
            <div class="sn-bank-nav-con">
                <span
                    v-for="(item, index) in indexList"
                    :index="index"
                    :key="index"
                    :ref="item"
                    @mouseenter="scrollToAnchor(item)"
                    @touchstart="touchStart($event)"
                    @touchmove="touchMove($event)"
                    @touchend="touchEnd"
                >
                    {{ item }}
                </span>
            </div>
        </div>
        <div
            class="atozshow"
            v-show="atozshow && '' != atozText"
            v-text="atozText"
        >
            {{ atozText }}
        </div>
    </SnPopupList>
</template>
<script>
import { dateFormat } from 'vux';
import SnPopupList from "../../baseComponents/SnPopupList";
import { cryptPost } from '../../../lib/common/base.js';
import { getStorage, setStorage, deleteStorageByName, setTitleOnly, initTitleMenu, isPC, showToast } from '../../../lib/common/extend.js';
import { AmountLimit } from '../../../pages/approval/ApprovalConstantData.js';
export default {
    data() {
        return {
            indexList: [],
            dataList: [],
            valuePropName: 'dispValue',
            keyPropName: 'bankId',
            current: {},
            changeAccount: true,
            isPC: isPC(),
            throttleType: true,
            indextemp: -1,
            cardH: 0,
            startY: 0,
            show: false
        };
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        textAlign: {
            type: String,
            default: 'left',
        },
        hasDefault: {//默认值，默认为没有
            type: Boolean,
            required: true,
            default: false
        },
        isInDetailFlag: {//是否明细组件 默认为否
            type: Boolean,
            default: false
        },
        noTips: {//为空提示信息
            type: String,
            default: "暂无数据，请刷新重试"
        },
        bankName: {
            type: String,
            default: ''
        },
        payeeAccount: {
            type: String
        },
        selectFlag: {
            type: Object,
            default: { 'show': false }
        },
        subTitle: {
            type: Array,
            default() {
                return []
            }
        },
        relationFiledIds: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: ''
        }
    },

    components: { SnPopupList },

    computed: {
    },

    created() {
        let _this = this;
        _this.getIndexList();
    },
    mounted() {
        let _this = this;
        _this.getBanKData().then(dataList => {
            _this.dataList = dataList;
            if (_this.dataList.length > 0 && _this.hasDefault) {
                _this.setValue(_this.dataList[0]);
            }
            if (_this.bankName) {
                _this.setValue({
                    dispValue: _this.bankName,
                });
            }
            if (!!_this.value && !_this.bankName) {
                _this.dataList.some(function (item) {
                    if (item[_this.keyPropName] == _this.value) {
                        _this.setValue({
                            bankId: _this.value,
                            dispValue: item[_this.valuePropName]
                        })
                    }
                    return item[_this.keyPropName] == _this.value;
                })
            }
        });
    },

    methods: {
        getIndexList() {
            let _this = this;
            for (let i = 0; i < 26; i++) {
                _this.indexList.push(String.fromCharCode(65 + i));
            }
        },
        scrollToAnchor: function (item, behavior = 'smooth') {
            if (item) {
                // 找到锚点
                let anchorElement = document.getElementById(item);
                // 如果对应id的锚点存在，就跳转到锚点
                if (anchorElement) {
                    anchorElement.scrollIntoView({
                        block: 'start',
                        behavior: behavior
                    });
                }
            }

        },
        getBanKData() {
            let _this = this;
            let todayStr = dateFormat(new Date(), "YYYY_MM_DD");
            let bankKey = "newBankList" + todayStr;
            let bankJsonKey = "newBankJson" + todayStr;
            return new Promise(function (res, rej) {
                let bankfromStorage = getStorage(bankKey);
                if (bankfromStorage) {//缓存中存在银行列表
                    return res(JSON.parse(bankfromStorage));
                }
                deleteStorageByName("newBank");
                return cryptPost('approval/getBankList.do').then(function (data) {
                    let bankList = data.bankList;
                    let bankJson = {};
                    setStorage(bankKey, JSON.stringify(bankList));//设置银行列表缓存
                    for (var i = 0; i < bankList.length; i++) {
                        let bank = bankList[i];
                        bankJson[bank.bankId] = bank.bankName;
                    }
                    setStorage(bankJsonKey, JSON.stringify(bankJson));
                    res(bankList);
                });
            })
        },

        /**
         * 设置父组件content中的值
         * @param {Object} bankDisplay
         */
        setValue(item) {
            let _this = this;
            _this.current = item;
            _this.$emit('input', item[_this.keyPropName] || '');
            //如果在明细中，需要区分
            if (_this.isInDetailFlag) {//明细
                _this.$root.content.inDetail[_this.idx].bankDisplay = item[_this.valuePropName];//传递给服务器
            } else {
                _this.$root.content.bankDisplay = item[_this.valuePropName];//给content中另存一个bankDisplay的值
            }
        },
        beforePopup() {
            console.log("bank beforePopup")
            let _this = this;
            if (_this.changeAccount && _this.payeeAccount) {
                _this.queryCardBelongBank(_this.payeeAccount).then(res => {
                    if (!res || !res.bankMemberId) {
                        _this.openPopList();
                    }
                    _this.changeAccount = false;
                    _this.getBanKData().then(dataList => {
                        _this.dataList = dataList;
                        let i = 0;
                        for (; i < dataList.length; i++) {
                            if (dataList[i].bankId == res.bankMemberId) {
                                _this.setValue(dataList[i]);
                                _this.cleanBranch();
                                break;
                            }
                        }
                        if (i >= dataList.length) {
                            _this.openPopList();
                        }
                    })
                });
            } else {
                _this.openPopList();
            }

        },
        openPopList() {

            if (!this.dataList.length) {
                showToast(this.noTips);
                return;
            }
            console.log("bank openPopList")
            this.show = true;
            this.selectFlag.show = true;
            setTitleOnly("选择" + this.title);
        },
        onHide() {
            console.log("bank onHide")
            this.selectFlag.show = false;
        },
        onChange(item) {
            console.log("bank onChange")
            let _this = this;
            if (_this.hideBankId == item.bankId) {
                return;
            }
            if (!item.flag) return;
            _this.$root.content = _this.$root.content || {};
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

            _this.setValue(item);
            _this.cleanBranch();

        },
        onSelect() {
            console.log("bank onSelect")
            initTitleMenu(this.subTitle);//设置title及按钮
        },
        cleanBranch() {
            let _this = this;
            _this.$root.content = _this.$root.content || {};
            if (_this.relationFiledIds != 'branch') return;
            if (_this.isInDetailFlag) {//明细
                _this.$parent.$refs[_this.relationFiledIds][_this.idx].current = {};
                //需要清空content中的值，不然会被控件重新赋值
                _this.$root.content.inDetail[_this.idx].branchDisplay = '';
                _this.$parent.$refs[_this.relationFiledIds][_this.idx].$emit('input', '');
            } else {//非明细
                //需要清空content中的值，不然会被控件重新赋值
                _this.$root.content.branchDisplay = '';
                if (_this.$root.$refs[_this.relationFiledIds] && _this.$root.$refs[_this.relationFiledIds][0]) {
                    _this.$root.$refs[_this.relationFiledIds][0].current = {};
                    _this.$root.$refs[_this.relationFiledIds][0].$emit('input', '');
                }
                //后续操作中的控件值
                else if (_this.$parent.$refs[_this.relationFiledIds]) {
                    if (_this.$parent.$refs[_this.relationFiledIds][0]) {
                        _this.$parent.$refs[_this.relationFiledIds][0].current = {};
                    }
                    if (_this.$parent.$refs[_this.relationFiledIds]) {
                        _this.$parent.$refs[_this.relationFiledIds].current = {};
                    }
                    if (_this.$parent.nextOprData && _this.$parent.nextOprData[_this.relationFiledIds]) {
                        _this.$parent.nextOprData[_this.relationFiledIds] = '';
                    }
                }
            }
        },
        queryCardBelongBank(cardNo) {
            return cryptPost('approval/queryCardBelongBank.do', { cardNo: cardNo }).then(function (data) {
                return data;
            });
        },
        touchStart(e) {
            this.atozshow = true;
            this.atozText = e.target.innerText;
            this.scrollToAnchor(e.target.innerText, 'instant');
            this.cardH = this.$refs['A'][0].clientHeight;
            this.startY = this.$refs['A'][0].offsetTop;
        },
        touchMove(event) {
            let _this = this;
            if (!this.throttleType) return;

            var point = event.changedTouches ? event.changedTouches[0] : event;
            let ele = document.elementFromPoint(point.pageX, point.pageY);
            if (ele) {
                var group = ele.innerText;
                if (group && group.length == 1) {
                    this.scrollToAnchor(group)
                }
            }

            // let touchY = event.touches[0].clientY - this.cardH;
            // let index = Math.floor((touchY - this.startY) / this.cardH);

            // if (index >= 0 && index < this.indexList.length && this.indextemp != index) {
            //     this.indextemp = index;
            //     this.atozText = _this.indexList[index];
            //     this.scrollToAnchor(_this.indexList[index], 'instant');
            // }


            this.throttleType = false;

            setTimeout(() => {
                _this.throttleType = true;
            }, 150)
        },
        touchEnd() {
            this.atozshow = false;
            this.atozText = '';
        }
    },
    watch: {
        payeeAccount(newVal, oldVal) {
            if (newVal != oldVal) {
                //已变更,通知状态
                this.changeAccount = true;
            } else {
                //未变更
                this.changeAccount = false;
            }
        },
        /**
         * 父组件控件组件显示隐藏标识
         * @param {Object} newVal  新值
         * @param {Object} oldVal  旧值
         */
        'selectFlag.show': function (newVal, oldVal) {
            var _this = this;
            if (!newVal) {//父组件隐藏子组件
                this.show = false;
            }
        },
        /**
         * 数据显示 主要针对删除使用
         * @param {Object} newVal
         * @param {Object} oldVal
         */
        value: function (newVal, oldVal) {
            let _this = this;
            _this.getBanKData().then(dataList => {
                _this.dataList.some(function (item) {
                    if (item[_this.keyPropName] == _this.value) {
                        _this.setValue({
                            bankId: _this.value,
                            dispValue: item[_this.valuePropName]
                        })
                    }
                    return item[_this.keyPropName] == _this.value;
                })
            });
        },
    },


}


</script>
<style lang='less'>
@import (reference) "../../style/common.less";
.sn-bank-nav {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 600;
    background: #fff;
    .flex-box();
    .align-items(center);
    span {
        display: block;
        width: 0.3rem;
        height: 0.36rem;
        line-height: 15px;
        color: #7f7f7f;
        text-align: center;
        line-height: 0.36rem;
    }
}
@media screen and (min-width: @screen-xs-max) {
    .sn-bank-nav {
        right: 20px;
        span {
            cursor: pointer;
        }
    }
}
@media screen and (min-width: @screen-lg-min) {
    .sn-bank-nav {
        right: calc(~"50% - @{max-content-width}/2 + 20px");
    }
}
</style>