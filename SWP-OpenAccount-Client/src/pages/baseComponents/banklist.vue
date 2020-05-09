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
        v-model="show">
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
                    @touchend="touchEnd">
                    {{ item }}
                </span>
            </div>
        </div>
        <div
            class="atozshow"
            v-show="atozshow && '' != atozText"
            v-text="atozText">
            {{ atozText }}
        </div>
    </SnPopupList>
</template>
<script>
import { dateFormat } from 'vux';
import { SnPopupList } from "components";
import { getStorage, setStorage, deleteStorageByName, setTitleOnly, initTitleMenu, isPC, showToast } from 'sslib/common/extend.js';
import { getServerData,getServerDataH5 } from '../handler/handler';
export default {
    data() {
        return {
            indexList: [],
            dataList: [],
            valuePropName: 'dispValue',
            keyPropName: 'bankId',
            current: {},
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
        noTips: {//为空提示信息
            type: String,
            default: "暂无数据，请刷新重试"
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
        value: {
            type: String,
            default: ''
        },
        phone: {
            type: String
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
            if (!!_this.value) {
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
            let bankbinkey = "newBankBinList";
            return new Promise(function (res, rej) {
                let bankfromStorage = getStorage(bankKey);
                if (bankfromStorage) {//缓存中存在银行列表
                    return res(JSON.parse(bankfromStorage));
                }
                deleteStorageByName("newBank");
                // textUrl+'/yqt/user/user.queryCertificationInfo'
                let param = {phone:_this.phone};
                return getServerDataH5(textUrl+"/yqt/accountMgr/home/account/queryCardBin.do",param,'POST').then(result => {
                    if(result.code === 0){
                        let bankList = result.bankList;
                        let bankJson = {};
                        setStorage(bankKey, JSON.stringify(bankList));//设置银行列表缓存
                        for (var i = 0; i < bankList.length; i++) {
                            let bank = bankList[i];
                            if(!!bank.binList){
                               for(var j = 0; j<bank.binList.length; j++){
                                   let bin = bank.binList[j];
                                   if(bin.length >= 5 && !bankJson[bin]){
                                        bankJson[bin] = {bankId:bank.bankId,bankName:bank.bankName};
                                   }
                               } 
                            }
                        }
                        setStorage(bankbinkey, JSON.stringify(bankJson));
                        res(bankList);                        
                    }
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
        },
        beforePopup() {
            console.log("bank beforePopup")
            let _this = this;
            _this.openPopList();
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
            if (!item.flag) return;
            _this.setValue(item);
        },
        onSelect() {
            console.log("bank onSelect")
            initTitleMenu(this.subTitle);//设置title及按钮
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
            let _this = this;
            let testFlag = false;
            if(newVal.length<5){
                _this.setValue({
                    bankId: "",
                    dispValue: ""
                })
            }
            if(newVal.length === 16 || newVal.length === 19){
                if(!!getStorage("newBankBinList")){
                    const binData = JSON.parse(getStorage("newBankBinList"));
                    for(var key in binData){
                        const testBin = newVal.substr(0,key.length);
                        if(!!binData[testBin]){
                            _this.setValue({
                                bankId: binData[testBin].bankId,
                                dispValue: binData[testBin].bankName
                            })
                            break;
                        }
                    }

                }
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
@import (reference) "~components/style/common.less";
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