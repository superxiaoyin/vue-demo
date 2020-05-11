<template>
    <SnPopupList
        @onChange="onChange"
        @onSelect="onSelect"
        @beforePopup="beforePopup"
        @onHide="onHide"
        @loadMore="loadMore"
        :defaultValue="current"
        :title="title"
        :list="dataList"
        :placeholder="placeholder"
        :textAlign="textAlign"
        :keyPropName="keyPropName"
        :valuePropName="valuePropName"
        :selectFlag="selectFlag"
        :hasMore="hasMore"
        size="small"
        v-model="show"
    >
        <!-- <SnSearch @searchInfo="searchBranch" v-model="searchKeys"></SnSearch> -->
        <SnEmpty icon="no-search" :isShow="isEmpty"></SnEmpty>
    </SnPopupList>
</template>

<script>
import SnSearch from '../../baseComponents/SnSearch/SnSearch.vue';
import SnPopupList from "../../baseComponents/SnPopupList";
import SnEmpty from '../../baseComponents/SnEmpty/SnEmpty.vue';
import {
    setTitleOnly,
    showToast,
    initTitleMenu
} from "../../../lib/common/extend.js";
import { cryptPost } from '../../../lib/common/base.js';
import { setTimeout } from 'timers';
export default {
    components: {
        SnSearch,
        SnPopupList,
        SnEmpty
    },
    data() {
        return {
            current: {},
            dataList: [],
            valuePropName: 'branchName',
            keyPropName: 'branchId',
            canShowPop: false,
            searchValue: "",
            pageIndex: 0,
            pageNum: 20, //默认显示20条
            bankId: 0,
            cityId: 0,
            bankChange: true,
            cityChange: true,
            searchKeys: "",
            hasMore: true,
            isEmpty: false,
            show: false
        };
    },

    props: {
        title: {
            type: String,
            default: ''
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
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
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
        isInDetailFlag: {
            //是否明细组件 默认为否
            type: Boolean,
            default: false
        },
        relationFiledIds: {
            type: Array,
            default: []
        },
        idx: {
            //组件的index
            type: Number
        },
        isInNextOprFlag: {
            //是否后续操作组件 默认为否
            type: Boolean,
            default: false
        },
        textAlign: {
            type: String,
            default: 'left',
        },
        selectFlag: {
            type: Object,
            default: { 'show': false }
        },
        bisBranchDisplay: {
            type: String,
            default: ''
        },
    },

    computed: {},

    mounted() {
        let _this = this;
        if (!_this.value && _this.value != 0) return;
        let branchName = _this.value;
        if (_this.isInDetailFlag) {
            //明细
            branchName = _this.$root.content.inDetail[_this.idx].branchDisplay || ""; //值显示
        } else if (_this.isInNextOprFlag) {
            //在业务组件中的显示值
            branchName = _this.bisBranchDisplay;
        } else {
            branchName = _this.$root.content.branchDisplay || ""; //值显示
        }
        _this.setValue({ branchName: branchName, branchId: _this.value });
    },

    methods: {
        onHide() {
            this.selectFlag.show = false;
        },

        onSelect(item) {
            this.setValue(item);
            initTitleMenu(this.subTitle);//设置title及按钮
        },
        beforePopup() {
            let _this = this;
            _this.getBankId()
            if (!_this.bankId) return;
            _this.show = true;
            _this.selectFlag.show = true;
            setTitleOnly("选择" + _this.title);
            if (_this.searchKeys != "" || _this.bankChange || _this.cityChange) {
                _this.searchKeys = "";
                _this.pageIndex = 0;
                _this.dataList = [];
                _this.getBranch();
            }
        },
        loadMore() {
            this.getBranch();
        },
        searchBranch: function (key) {
            var _this = this;
            _this.pageIndex = 0;
            _this.dataList = [];
            _this.getBranch();
        },
        getBranch() {
            let _this = this;
            _this.pageIndex++;
            console.log("============bankId", _this.bankId)
            var param = {
                bankId: _this.bankId,
                pageIndex: _this.pageIndex,
                pageNum: _this.pageNum,
                searchKeys: _this.searchKeys
            }
            if(!!_this.cityId){
                param['cityId'] = _this.cityId;
            }
            _this.isEmpty = false;
            cryptPost("approval/getBranchList.do", param).then(function (result) {
                //根据已选银行，请求支行
                let branchList = result.branchList;
                _this.dataList.push.apply(_this.dataList, branchList);
                if (_this.dataList.length < 1 && !_this.searchKeys) {
                    showToast("暂无支行信息，请重新选择");
                } else if (_this.dataList.length < 1 && _this.searchKeys) {
                    _this.isEmpty = true;
                }
                if (_this.pageIndex * _this.pageNum < result.total) {
                    _this.hasMore = true;
                } else {
                    _this.hasMore = false;
                }
            });

        },

        getBankId() {
            let bankId = "";
            let cityId = "";
            for (var i = 0; i < this.relationFiledIds.length; i++) {
                var refKey = this.relationFiledIds[i];
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
                }else if(refKey == 'cityName') {
                    //判断是否明细
                    if (this.isInDetailFlag) {
                        cityId = this.$parent.inDetailValue[this.idx][refKey];
                    } else if (this.isInNextOprFlag) {
                        //判断是否后续操作组件
                        cityId = this.$parent.nextOprData[refKey];
                    } else {
                        if (this.$root.$refs[refKey]) {
                            if (!!this.$root.$refs[refKey][0].cityValue) {
                                cityId = this.$root.$refs[refKey][0].cityValue;
                            }
                        } else {
                            cityId = this.$root.content.cityName;
                        }
                    }
                }

            }
            if (this.$root.templetType == 37) {
                bankId = this.$root.content.bankId;
            }
            if (!bankId || "" == bankId) {
                var msg = "请先选择银行！";
                showToast(msg);
                return false;
            }
            if (this.bankId == bankId) {
                this.bankChange = false;
            } else {
                this.bankChange = true;
            }
            if (this.cityId == cityId) {
                this.cityChange = false;
            } else {
                this.cityChange = true;
            }
            this.bankId = bankId;
            this.cityId = cityId;
            return true;
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
                _this.$root.content.inDetail[_this.idx].branchDisplay = item[_this.valuePropName];//传递给服务器
            } else {
                _this.$root.content.branchDisplay = item[_this.valuePropName];//给content中另存一个bankDisplay的值
            }
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
            var _this = this;
            let branchName = _this.$root.content.branchDisplay || ""; //值显示
            _this.setValue({ branchName: branchName, branchId: _this.value });
        }
    }
}

</script>
<style lang="less">
.empty-comp {
    top: 1rem;
}
</style>

