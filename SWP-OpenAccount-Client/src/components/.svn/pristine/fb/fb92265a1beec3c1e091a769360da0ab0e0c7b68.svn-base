<!--附属/二级明细控件-->
<template>
    <div class="sn-balance">
        <!-- v-if='inDetailValue.acctStatus == 2' <SnRadio title="状态" ref="acctStatus" :radioList='radioList' defaultIndex='1' v-model='inDetailValue.acctStatus' fieldKey='acctStatus'  ></SnRadio> -->
        <div class="snSubsidiaryTit" v-if="acctStatus == 2">
            <span>不符明细</span>
            <span class="sidiaryBut" @click="openDetail">
                明细
                <span class="colorGray">
                    (
                    <span>{{ssdLength}}</span>)
                </span>
            </span>
        </div>
        <div v-if="ssdFlag" class="subsidiaryDetail full-s">
            <div class="subsidiaryMain sn-main-con">
                <SnNomatch
                    :title="subTitle"
                    :addDesc="addSubDesc"
                    v-model="nomatch.inDetail"
                    :maxSize="19"
                    :ref="fieldKey"
                    :inDetailList="inDetailList"
                    :account="account"
                    :readonly="readonly"
                    :subTitle="subUsedTitle"
                    :ssDiaryFlag="true"
                    @setinDetailValue="setinDetailValue"
                ></SnNomatch>
                <div class="subButton">
                    <span class="leftBut" @click="cancel">取消</span>
                    <span v-if="!readonly" class="rightBut" @click="ok">确定</span>
                </div>
            </div>
        </div>
    </div>
</template> 
<script>
import './SnBalance.less';
import { registerHandler, notifyAppBackEvent } from '../../../lib/common/SnJsBridge.js';
import { showToast, isEmptyObject, sumStrings, showConfirm, moneyStringFixTwo, getClass, moneyUppercase, initTitleMenu, setTitleOnly } from '../../../lib/common/extend.js';
import SnMoney from '../SnMoney/SnMoney.vue';
import SnRadio from '../SnRadio/SnRadio.vue';
import SnNomatch from './SnNomatch.vue';
import SnSubsidiaryHandler from '../SnSubsidiary/SnSubsidiaryHandler.js';
export default {
    components: {
        SnMoney,
        SnRadio,
        SnNomatch
    },
    props: {
        title: {
            type: String,
            default: '不符明细'
        },
        subTitle: {
            type: String,
            default: '不符明细'
        },
        detailTitle: {
            type: Array,
            default() {
                return []
            }
        },
        subUsedTitle: {
            type: Array,
            default: () => {
                return []
            }
        },
        readonly: {//外面传递进来的 readonly，控制snNomatch在不同页面需要控制只读状态
            type: Boolean,
            default: false,
        },
        addSubDesc: {
            type: String,
            default: '+增加项目'
        },
        value: {
            type: Object,
            default: () => { return {} }
        },
        selectFlag: {
            type: Object
        },
        fieldKey: {
            type: String,
            default: 'acctNeqList'
        },
        subsidiaryFlag: {//二级明细是否显示
            type: Object,
            default: () => { return { 'show': false } }
        },
        account: {//银企兑账的账号
            type: String,
            default: ''
        },
        acctStatus: {
            type: Number,
            default: ''
        },
        subDetailKey: {
            type: String,
            default: ''
        }
    },
    data: function () {
        return {
            radioList: [{ "id": "1", "text": "相符", "cls": "radio" }, { "id": "2", "text": "不相符", "cls": "radio" }],
            inDetailList: [{
                "displayorder": 1,
                "fieldId": "account",
                "placeholder": "请输入账号（必填）",
                "fieldDispValue": "",
                "fieldname": "账号",
                "fieldKey": "account",
                "displayFlag": true,
                "dataType": "text",
                "frt": {
                    "readonly": 'readonly'
                }
            },
            {                "displayorder": 2,
                "fieldId": "dealTime", "fieldDispValue": "",
                "fieldname": "发生日期",
                "fieldKey": "dealTime",
                "validate": {},
                "displayFlag": true,
                "dataType": "date",
                "formatDate": { "format": "YYYY/MM/DD", "serverFormat": "timestamp" }            },

            {
                "displayorder": 3,
                "fieldId": "voucherNo",
                "placeholder": "请输入凭证号码（可选填）",
                "fieldDispValue": "",
                "fieldname": "凭证号",
                "fieldKey": "voucherNo",
                "displayFlag": true,
                "dataType": "text",
            },
            {                "displayorder": 4,
                "fieldDispValue": "",
                "defaultIndex": "0",
                "dataType": "radio",
                "displayFlag": true,
                "fieldId": "type",
                "validate": { "notEmpty": true },
                "fieldKey": "type",
                "fieldname": "项目类型",
                "radioList": [{ "id": "0", "text": "我单位账无以下款项", "cls": "radio" }, { "id": "1", "text": "你行账无以下款项", "cls": "radio" }]
            },
            {
                "displayorder": 5,
                "fieldId": "debitAmount",
                "placeholder": "请填写借方金额",
                "fieldDispValue": "",
                "fieldname": "借方",
                "fieldKey": "debitAmount",
                "validate": {
                },
                "displayFlag": true,
                "dataType": "money",
            },
            {
                "displayorder": 6,
                "fieldId": "creditAmount",
                "placeholder": "请填写贷方金额",
                "fieldDispValue": "",
                "fieldname": "贷方",
                "fieldKey": "creditAmount",
                "validate": {
                },
                "displayFlag": true,
                "dataType": "money",
            }],//二级明细字段  
            ssdFlag: false,//二级明细显示
            subTotal: '',
            clickBtnFlag: false,//点击cancel或者ok动作标识
            nomatch: { inDetail: [] },
            openTravel: {},
            ssdLength: 0,//明细长度
        }
    },
    created: function () {
        var _this = this;
        var fieldKey = this.fieldKey;
        if (this.nomatch.inDetail) {
            this.ssdLength = this.nomatch.inDetail.length;
        }
        this.subUsedTitle.push(this.title);
    },
    mounted: function () {
        //不为空对象则赋值
        if (!isEmptyObject(this.value)) {
            this.nomatch = JSON.parse(JSON.stringify(this.value));

            if (this.nomatch.inDetail) {
                this.ssdLength = this.nomatch.inDetail.length;
            }
            this.$emit('input', this.nomatch);//传递给父组件
        }
    },
    updated: function () {
    },
    methods: {
        setinDetailValue: function (inDetailValue) {
            this.nomatch.inDetail = inDetailValue;
        },

        /**
         * 打开二级明细 
         */
        openDetail: function () {
            var _this = this;
            //打开二级页面记住一级页面滚动位 置
            var bodyScrTop = $("body").scrollTop();
            $("body").css({
                'overflow': 'hidden',
                'position': 'fixed',
                'top': bodyScrTop * -1
            });
            $("body").attr("bodyScrTop", bodyScrTop);
            this.subsidiaryFlag.show = true;
            this.ssdFlag = true;
            this.clickBtnFlag = false;
            setTitleOnly(this.title);
            _this.$root.subDetailKey = _this.fieldKey;
            _this.$emit("subDetailKeyChange", _this.fieldKey);
            this.openTravel = JSON.parse(JSON.stringify(this.nomatch));
        },
        /** 
         * 取消    
         */
        cancel: function () {
            var _this = this;
            //点击取消的时候的二级明细的数据内容
            var lastInDetailValue = JSON.stringify(this.nomatch.inDetail);
            //打开二级明细的时候的数据内容
            var openInDetailValue = JSON.stringify(_this.$refs[_this.fieldKey].openInDetailValue);
            //如果两个数据相等，则说明数据没有变化，不对用户做确认框提示
            if (lastInDetailValue == openInDetailValue) {
                _this.cancelSet();
            } else {
                //确定框弹框      
                showConfirm('你确定关闭吗？', function () {
                    _this.cancelSet();
                });
            }
        },
        /**
         * 取消操作的时候的处理
         */
        cancelSet: function () {
            var _this = this;
            _this.setBodysrcTop();
            _this.clickBtnFlag = true;//不能写到_this.subsidiaryFlag.show后面，否则watch里面的数据会出错  	  
            _this.subsidiaryFlag.show = false;
            _this.ssdFlag = false;

            //取消时 不对二级明细inDetail赋值
            _this.nomatch = JSON.parse(JSON.stringify(_this.value));
            _this.nomatch.inDetail = _this.value.inDetail || [];

            //将acctStatus手动赋值给nomatch
            //_this.nomatch.acctStatus = _this.$refs.acctStatus.value;

            initTitleMenu(_this.detailTitle);//设置title及按钮
        },
        /**
         * 确定     
         */
        ok: function () {
            var _this = this;
            var okFlag = true;
            //借方和贷方的输入校验，全部填写和全部不填写，都给提示
            if (this.nomatch.inDetail && this.nomatch.inDetail.length > 0) {
                this.nomatch.inDetail.forEach(function (item) {
                    if (!item.debitAmount && !item.creditAmount) {
                        okFlag = false;
                    }
                    if (item.debitAmount && item.creditAmount) {
                        okFlag = false;
                    }
                })
            }
            if (okFlag == false) {
                showToast('请正确的填写对账信息');
                
                //按照取消时操作 不对二级明细inDetail赋值
            	_this.nomatch = JSON.parse(JSON.stringify(_this.value));
            	_this.nomatch.inDetail = _this.value.inDetail || [];
                return;
            }
            //取值
            this.ssdLength = this.nomatch.inDetail.length;
            this.clickBtnFlag = true;//不能写到this.subsidiaryFlag.show后面，否则watch里面的数据会出错

            _this.setBodysrcTop();
            this.subsidiaryFlag.show = false;
            this.ssdFlag = false;
            this.$emit('input', this.nomatch);//传递给父组件

            initTitleMenu(this.detailTitle);//设置title及按钮
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
        }
    },
    watch: {
        /** 
         * 监听值变化 删除明细时使用
         * @param {Object} newVal
         * @param {Object} oldVal 
         */
        value: function (newVal, oldVal) {
            this.nomatch = JSON.parse(JSON.stringify(newVal));
            if (this.nomatch.inDetail) {
                this.ssdLength = this.nomatch.inDetail.length;
            } else {
                this.ssdLength = 0;
            }
        },
        /**
         * 父组件控件组件显示隐藏标识      
         * @param {Object} newVal  新值
         * @param {Object} oldVal  旧值
         */
        'subsidiaryFlag.show': function (newVal, oldVal) {
            var _this = this;
            if (!this.subsidiaryFlag.show) {//父组件隐藏子组件
                if (this.ssdFlag && !this.clickBtnFlag) {//点击回退按钮   yg  
                    this.nomatch = JSON.parse(JSON.stringify(this.value));
                    this.nomatch.inDetail = this.value.inDetail || [];
                }
                this.ssdFlag = false;
            }
        },
    }
}
</script>