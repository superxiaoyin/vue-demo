<!--明细控件-->
<template>
    <div class="detailBox">
        <div class="button_box" v-if="inDetailList.length>0">
            <div v-for="(item,idx) in inDetailValue" :key="idx">
                <div class="comp detail" :detailIndex="idx">
                    <div class="tit" v-if="inDetailValue[idx].displayDetailFlag">
                        <em class="button-icon"></em>
                        <label>{{title+(idx+1)}}</label>
                        <em
                            v-show="!inDetailValue[idx].deletFlag"
                            class="del-button-icon-detail"
                            @click.stop="delDetail(idx)"
                            v-if="inDetailValue.length>1"
                        ></em>
                    </div>
                    <div class="tit" v-else-if="!inDetailValue[idx].displayDetailFlag">
                        <em class="button-icon up"></em>
                        <label>{{title+(idx+1)}}</label>
                        <em
                            v-show="!inDetailValue[idx].deletFlag"
                            class="del-button-icon-detail"
                            @click.stop="delDetail(idx)"
                            v-if="inDetailValue.length>1"
                        ></em>
                    </div>
                </div>
                <div class="inDetailWrap" v-show="inDetailValue[idx].displayDetailFlag">
                    <div v-for="(field,index) in inDetailList" :key="index" class="detailLine">
                        <div v-if="field.dataType =='date'">
                            <!--日期-->
                            <SnDatetime
                                :title="field.fieldname"
                                :ref="field.fieldKey"
                                v-model="inDetailValue[idx][field.fieldKey]"
                                :selectFlag="selectFlag"
                                :formatDate="field.formatDate"
                                :intervalhours="field.intervalhours"
                                :daterange="field.daterange"
                                :relationFiledIds="field.relationFiledIds"
                                :isInDetailFlag="true"
                                :idx="idx"
                                funName="showClick"
                            ></SnDatetime>
                        </div>
                        <div v-else-if="field.dataType =='contacts'">
                            <!--通讯录-->
                            <SnContacts
                                :title="field.fieldname"
                                :chooseType="0"
                                :delFlag="false"
                                v-model="inDetailValue[idx][field.fieldKey]"
                                :salaryRelationFlag="true"
                                :isInDetailFlag="true"
                                :relationFields="field.relationFiledIds"
                                :idx="idx"
                                :placeholder="field.placeholder"
                            ></SnContacts>
                        </div>
                        <div v-else-if="field.dataType =='money'">
                            <!--金额-->
                            <SnMoney
                                :title="field.fieldname"
                                :ref="field.fieldKey"
                                :noMoney="field.noMoney"
                                v-model="inDetailValue[idx][field.fieldKey]"
                                :placeholder="field.placeholder"
                                :isInDetailFlag="true"
                                :unitprice="field.unitprice"
                                :idx="idx"
                                v-bind:readonly="(field.frt||{}).readonly?(field.frt||{}).readonly:false"
                                :fieldKey="field.fieldKey"
                                :templetType="templetType"
                                :ssDiaryFlag="ssDiaryFlag"
                                :batchFlag="batchFlag"
                                :relationFiledIds="field.relationFiledIds"
                                :summationFlag="field.summationFlag"
                                :totalFlag="field.totalFlag"
                            ></SnMoney>
                        </div>
                        <div v-else-if="field.dataType=='number'">
                            <!--数值 需要给出校验-->
                            <SnNumber
                                :title="field.fieldname"
                                :ref="field.fieldKey"
                                :fieldkey="field.fieldKey"
                                v-model="inDetailValue[idx][field.fieldKey]"
                                :isInDetailFlag="true"
                                :autocomp="field.autocomp"
                                :pointlength="field.pointlength"
                                :unit="field.unit"
                                v-bind:readonly="field.frt.readonly?field.frt.readonly:false"
                                :placeholder="field.placeholder"
                                :relationFiledIds="field.relationFiledIds"
                                :idx="idx"
                                :disabledFlag="null"
                                :maxlength="field.maxlength||30"
                            ></SnNumber>
                        </div>
                        <div v-else-if="field.dataType=='bankList'&&inDetailValue[idx].displayFlag">
                            <!--银行列表-->
                            <SnBank
                                :title="field.fieldname"
                                :ref="field.fieldKey"
                                v-model="inDetailValue[idx][field.fieldKey]"
                                :subTitle="subTitle"
                                :placeholder="field.placeholder"
                                :relationFiledIds="field.relationFiledIds"
                                :idx="idx"
                                :isInDetailFlag="true"
                                :selectFlag="selectFlag"
                                :disabledFlag="false"
                                :maxlength="field.maxlength||30"
                            />
                        </div>
                        <div v-else-if="field.dataType=='radio'">
                            <!--单选框-->
                            <SnRadio
                                :title="field.fieldname"
                                :ref="field.fieldKey"
                                :isInDetailFlag="true"
                                :idx="idx"
                                :fieldKey="field.fieldKey"
                                :readonly="(field.frt||{}).readonly?(field.frt||{}).readonly:false"
                                :bsreadonly="readonly"
                                :displayFlag="displayFlag"
                                :radioList="field.radioList"
                                :defaultIndex="field.defaultIndex"
                                @change="onRadioChange"
                                v-model="inDetailValue[idx][field.fieldKey]"
                            ></SnRadio>
                        </div>
                        <div v-else-if="field.dataType=='usedAccount'">
                            <!--常用-->
                            <SnUsedAccount
                                :title="field.fieldname"
                                :ref="field.fieldKey"
                                :subTitle="subTitle"
                                v-model="inDetailValue[idx][field.fieldKey]"
                                :isInDetailFlag="true"
                                :idx="idx"
                                :templetType="templetType"
                                :placeholder="field.placeholder"
                                :maxlength="field.maxlength"
                                :selectFlag="selectFlag"
                                :displayKeys="field.displayKeys"
                                :relationFiledIds="field.relationFiledIds"
                                :divFlag="field.divFlag"
                            ></SnUsedAccount>
                        </div>
                        <div v-else-if="field.dataType=='usedDiv'">
                            <!--常用-->
                            <SnUsedDiv
                                :title="field.fieldname"
                                :ref="field.fieldKey"
                                :subTitle="subTitle"
                                :isInDetailFlag="true"
                                :idx="idx"
                                :maxlength="field.maxlength"
                                v-model="inDetailValue[idx][field.fieldKey]"
                                :fieldKey="field.fieldKey"
                                :templetType="templetType"
                                :placeholder="field.placeholder"
                                :displayKeys="field.displayKeys"
                                :usedSaveFlag="usedSaveFlag"
                                :selectFlag="selectFlag"
                            ></SnUsedDiv>
                        </div>
                        <div v-else-if="field.dataType=='attach'">
                            <!--附件-->
                            <SnAttach
                                :title="field.fieldname"
                                :ref="field.fieldKey"
                                :idx="idx"
                                :isInDetailFlag="true"
                                v-model="inDetailValue[idx][field.fieldKey]"
                            ></SnAttach>
                        </div>
                        <div v-else-if="field.dataType=='IDCard'">
                            <!--身份证-->
                            <SnIDCard
                                :title="field.fieldname"
                                :ref="field.fieldKey"
                                v-model="inDetailValue[idx][field.fieldKey]"
                                :placeholder="field.placeholder"
                            ></SnIDCard>
                        </div>
                        <div v-else-if="field.dataType=='subsidiary'">
                            <!--二级明细-->
                            <SnSubsidiary
                                :title="field.fieldname"
                                :ref="field.fieldKey"
                                :relationFiledIds="field.relationFiledIds"
                                :placeholder="field.placeholder"
                                v-model="inDetailValue[idx][field.fieldKey]"
                                :travelStartDate="inDetailValue[idx]['travelStartDate']"
                                :travelEndDate="inDetailValue[idx]['travelEndDate']"
                                :travelDays="inDetailValue[idx]['travelDays']"
                                :detailTitle="subTitle"
                                :idx="idx"
                                :isInDetailFlag="true"
                                :addSubDesc="field.addSubDesc"
                                :subsidiaryFlag="subsidiaryFlag"
                                :templetType="templetType"
                                :usedSaveFlag="usedSaveFlag"
                                :selectUsedFlag="selectUsedFlag"
                                :subTemplet="subTemplet"
                                :fieldKey="field.fieldKey"
                            ></SnSubsidiary>
                        </div>
                        <div v-else-if="field.dataType=='select'">
                            <div
                                v-if="(field.fieldKey=='branch'&&inDetailValue[idx].displayFlag) || (field.fieldKey!='branch')"
                            >
                                <SnPopupPicker
                                    :title="field.fieldname"
                                    :dataList="field.selectList"
                                    :subTitle="subTitle"
                                    :hasDefault="field.hasDefault"
                                    noTips="没有可用账号"
                                    :ref="field.fieldKey"
                                    :isInDetailFlag="true"
                                    :idx="idx"
                                    :placeholder="field.placeholder"
                                    v-model="inDetailValue[idx][field.fieldKey]"
                                    value-text-align="left"
                                    :selectFlag="selectFlag"
                                    :selectType="field.selectType"
                                    :relationFiledIds="field.relationFiledIds"
                                    funName="showClick"
                                    columns="1"
                                ></SnPopupPicker>
                            </div>
                        </div>
                        <div v-else-if="field.dataType=='projectSelect'">
                            <!--所属项目-->
                            <SnProject
                                :title="field.fieldname"
                                :subTitle="subTitle"
                                :hasDefault="field.hasDefault"
                                :isInDetailFlag="true"
                                :idx="idx"
                                noTips="暂无项目信息"
                                :ref="field.fieldKey"
                                @change="change"
                                :placeholder="field.placeholder"
                                v-model="inDetailValue[idx][field.fieldKey]"
                                value-text-align="left"
                                :selectFlag="selectFlag"
                                :fieldKey="field.fieldKey"
                                :relationFiledIds="field.relationFiledIds"
                            ></SnProject>
                        </div>
                        <div v-else-if="field.dataType=='cityList'&&inDetailValue[idx].displayFlag">
                            <!--省市列表-->
                            <SnCityList
                                :title="field.fieldname"
                                :ref="field.fieldKey"
                                :relationFiledIds="field.relationFiledIds"
                                :subTitle="subTitle"
                                :isInDetailFlag="true"
                                :idx="idx"
                                :placeholder="field.placeholder"
                                v-model="inDetailValue[idx][field.fieldKey]"
                            ></SnCityList>
                        </div>
                        <div v-else-if="field.dataType=='text'">
                            <!--内容-->
                            <SnText
                                :title="field.fieldname"
                                :class="field.frt.class"
                                :maxlength="field.maxlength"
                                :ref="field.fieldKey"
                                :isInDetailFlag="true"
                                :idx="idx"
                                :fieldKey="field.fieldKey"
                                v-bind:readonly="field.frt.readonly?field.frt.readonly:false"
                                :placeholder="field.placeholder"
                                v-model="inDetailValue[idx][field.fieldKey]"
                                :relationFiledIds="field.relationFiledIds"
                            ></SnText>
                        </div>
                        <div v-else-if="field.dataType=='balance'">
                            <SnBalance
                                :acctStatus="inDetailValue[idx]['acctStatus']"
                                :ref="field.fieldKey"
                                :subDetailKey="subDetailKey"
                                @subDetailKeyChange="subDetailKeyChange"
                                v-model="inDetailValue[idx][field.fieldKey]"
                                :subsidiaryFlag="subsidiaryFlag"
                                :readonly="readonly"
                                :detailTitle="subTitle"
                                :account="inDetailValue[idx]['account']"
                            ></SnBalance>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="addDetail" class="wrap">
                <!--银企对账的模板不显示动态添加-->
                <div class="detailAdd" @click="addDetailFun()">{{addDesc}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import './SnInDetail.less';
import { getClass, nativeInfo } from '../../../lib/common/base.js';
import { prefixInteger, showToast } from '../../../lib/common/extend.js';
import SnContacts from '../SnContacts/SnContacts.vue';
import SnDatetime from '../SnDatetime/SnDatetime.vue';
import SnMoney from '../SnMoney/SnMoney.vue';
import SnNumber from '../SnNumber/SnNumber.vue';
import SnBank from '../SnBank/SnBank.vue';
import SnRadio from '../SnRadio/SnRadio.vue';
import SnCityList from '../SnCityList/SnCityList.vue';
import SnPopupPicker from '../SnPopupPicker/SnPopupPicker.vue';
import SnAttach from '../SnAttach/SnAttach.vue';
import SnUsedAccount from '../SnUsedAccount/SnUsedAccount.vue';
import SnUsedDiv from '../SnUsedDiv/SnUsedDiv.vue';
import SnIDCard from '../SnIDCard/SnIDCard.vue';
import SnText from '../SnText/SnText.vue';
import SnSubsidiary from '../SnSubsidiary/SnSubsidiary.vue';//二级明细
import SnBalance from '../SnBalance/SnBalance.vue';
import SnProject from '../SnPopupPickerProject/SnPopupPickerProject.vue';

import UsedManagment from '../../../lib/UsedHandler.js';
export default {
    components: {
        SnDatetime,
        SnMoney,
        SnNumber,
        SnContacts,
        SnBank,
        SnRadio,
        SnCityList,
        SnPopupPicker,
        SnAttach,
        SnUsedAccount,
        SnUsedDiv,
        SnText,
        SnSubsidiary,
        SnBalance,
        SnIDCard,
        SnProject
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
        readonly: {
            type: Boolean,
            default: false,
        },
        addDetail: {
            type: Boolean,
            default: true,
        },
        inDetailList: {
            type: Array,
            default: []
        },
        relationFiledIds: {//主要针对总计
            type: String,
            default: ''
        },
        conType: {
            type: String,
            default: ''
        },
        addDesc: {
            type: String,
            default: '+增加项目'
        },
        placeholder: {
            type: String
        },
        value: {
            type: Array,
            default: [{}]

        },
        selectFlag: {
            type: Object
        },
        templetType: {
            type: String,
            default: "9"
        },
        maxSize: {
            type: Number,
            default: 9
        },
        ssDiaryFlag: {//二级明细标识
            type: Boolean,
            default: false
        },
        subsidiaryFlag: {
            type: Object,
            default: { 'show': false }
        },
        usedSaveFlag: {//是否保存常用 默认为否
            type: Boolean,
            default: false
        },
        selectUsedFlag: {
            type: Object,
            default: () => { return { 'show': false } }
        },
        subTemplet: { //历史常用需要
            type: Number,
            default: -1
        },
        batchFlag: {//是否批量转账
            type: Boolean,
            default: false
        },
        subDetailKey: {
            type: String,
            default: ""
        }
    },
    data: function () {
        return {
            inDetailValue: [{ displayDetailFlag: true }],//默认值为0
            delInDetailFlag: false,//明细删除标识
            usedFlag: { index: -1 },
            displayFlag: { show: false },//显示标识 默认为false 行内   增加/删除 需要控制    方案有问题 不能全局控制
        }
    },
    created: function () {
        this.$emit('input', this.value);
        this.inDetailValue = this.value;
        if (this.templetType == 36) {//代发工资最多增加20个项目
            this.maxSize = 19;
        }
        if (!this.inDetailValue[0].displayDetailFlag) {
            this.inDetailValue[0].displayDetailFlag = true;
        }
    },
    mounted: function () {
        var _this = this;
        if (this.value.length > 0) {
            this.inDetailValue = this.value;
            this.$emit('input', this.inDetailValue);//传递给父  组件
            if (this.templetType == 36) {
                this.$root.$refs.totalNum[0].$emit('input', this.inDetailValue.length + '笔');
            }
        }
        $(document).on("click", ".detail", function () {
            $(this).find(".button-icon").toggleClass("up");
            $(this).next(".inDetailWrap").stop().slideToggle();
            var index = $(this).attr("detailIndex");
            var displayDetailFlag = _this.inDetailValue[index].displayDetailFlag;
            if (displayDetailFlag) {
                setTimeout(function () {
                    _this.inDetailValue[index].displayDetailFlag = false;
                }, 400)
            } else {
                _this.inDetailValue[index].displayDetailFlag = true;
            }
        });

    },
    updated: function () {
    },
    methods: {
    	/**
    	 * 银企对账的模板里面，在相符合不相符之间切换的时候，需要将acctNeqList清空
    	 * @param {Object} data
    	 */
    	onRadioChange: function(data){  
    		if(data.value == 1 &&  'acctStatus' == data.fieldKey){
    			if(this.inDetailValue[data.idx]['acctNeqList']) {
    				this.inDetailValue[data.idx]['acctNeqList'] = {};
    			}
    		}
    	},
        subDetailKeyChange: function (val) {
            this.$emit("subDetailKeyChange", val);
        },
        /**
         * 元素点击事件，删除
         * @param {Object} field
         * @param {Object} index
         */
        itemClick: function (item, index) {
            var _this = this;
        },
        /**
         * 增加明细
         * @param {Object} item   控件
         */
        addDetailFun: function () {
            var ms = this.addDesc.split('增加')[1] || '项目	';
            if (this.maxSize < this.inDetailValue.length) {
                showToast('最多只能添加' + (this.maxSize + 1) + '个' + ms);
                return;
            }

            //返回该索引
            this.inDetailValue.push({ displayDetailFlag: true });
            this.delInDetailFlag = false;
            if (this.templetType == 36) {
                this.$root.$refs.totalNum[0].$emit('input', this.inDetailValue.length + '笔');
            }
        },
        /**
         * 删除明细
         * @param {Object} index  控件索引
         */
        delDetail: function (index) {
            var _this = this;
            _this.delInDetailFlag = true;
            var size = _this.inDetailValue.length;
            _this.inDetailValue.splice(index, 1);//删除当前item-value 

            $(".detailBox .detail").each(function () {
                var index = $(this).attr("detailIndex");
                var displayDetailFlag = false;
                if (_this.inDetailValue[index]) {
                    displayDetailFlag = _this.inDetailValue[index].displayDetailFlag;
                }
                if ($(this).find(".button-icon up") && displayDetailFlag) {
                    //      				$(this).find(".button-icon").toggleClass("up");
                    $(this).next(".inDetailWrap").show();
                }
            });

            //需要重新计算总计
            _this.calSummation(index, size, true);
            if (this.templetType == 36) {//代发工资增加总笔数字段
                this.$root.$refs.totalNum[0].$emit('input', this.inDetailValue.length + '笔');
            }
        },
        /**
         * 删除明细时重新计算总计
         * @param {Object} index
         * @param {Object} size
         * @param {Object} delFlag  删除标识
         */
        calSummation: function (index, size, delFlag) {
            var length = this.$children.length;
            for (var i = 0; i < length; i++) {
                console.log(i + " : " + this.$children[i].relationFiledIds);
                if (this.$children[i].relationFiledIds == this.relationFiledIds) {
                    this.$children[i].summation(index, size, delFlag);//调用累加方法
                    break;
                }
            }
        },
        saveSubUsed: function () {
            var _this = this;
            //var storageKey = 'UAId' + nativeInfo.UAId + 'cpyId' + nativeInfo.cpyId + 'storageKey';
            //UsedManagment.saveSubUsed('tempTempletType'+_this.templetType+storageKey,'templetType'+_this.templetType+storageKey);
            UsedManagment.saveSubUsed(nativeInfo.UAId, nativeInfo.cpyId, _this.templetType, 'tempTempletType');
        }
    },
    watch: {
        'usedFlag.index': function () {
            this.inDetailValue.push({ displayDetailFlag: true });
            this.inDetailValue.splice(this.inDetailValue.length - 1, 1);
        },
        usedSaveFlag: function (newVal, oldVal) {
            var _this = this;
            if (_this.usedSaveFlag) {
                _this.saveSubUsed();
            }
        },
    }
}
</script>