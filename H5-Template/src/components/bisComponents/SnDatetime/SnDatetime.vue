<template>
    <!--<group class="cssClass">-->
    <!--<datetime :title="title" :start-date="startDate" v-model="selectedDate" :format="format" @on-change="showC" value-text-align="left"></datetime>-->
    <div>
        <cell :title="title" value-align="left" @click.native="clickTimeFun">
            <input
                v-model="selectedDate"
                :placeholder="placeholder"
                v-if="hideInput"
                :style="inputStyle"
                @on-change="showC"
                readonly="readonly"
                class="color-blue"
            >
            <em v-if="readonly == 'true'" class="snDatetimeBut"></em>
        </cell>
        <div v-transfer-dom @touchmove.prevent>
            <popup
                v-model="showPopup"
                position="bottom"
                :show-mask="true"
                hide-on-blur
                style="min-height: 6.6rem;background: #ffffff "
                @on-hide="setBodysrcTop"
            >
                <!--                <scroll-lock lock="true" :bodyLock="showPopup">-->
                <div class="calendar">
                    <div class="position-vertical-demo">
                        <!--                            <calendar ref="Calendar" :displayMode='displayMode' @commitDate='commitDate'-->
                        <!--                                      @choseDay='choseDay' @changeDate='changeDate' :agoDayHide='agoDayHide'></calendar>-->
                        <DateTimePickerView
                            ref="DateTimePickerView"
                            v-if="forceUpdate"
                            v-model="currentValue"
                            :mode="mode"
                            @on-change="onChange"
                        />
                    </div>
                </div>
                <!--                </scroll-lock>-->
            </popup>
        </div>
    </div>
</template>
<script>
import './SnDatetime.less';
import { SelectTimeWidget } from '../../../lib/common/SnJsBridge.js';
import { showToast, isPC } from '../../../lib/common/extend.js';
import DatetimeHandler from './DatetimeHandler.js';
import AttendanceHandler from '../../../pages/attendance/AttendanceHandler.js';
import { Group, Datetime, Cell, dateFormat, Popup, TransferDom } from 'vux';
// import VueScrollLock from 'vue-scroll-lock'
import SnCalendar from "../../baseComponents/SnCalendar";

const { DateTimePickerView } = SnCalendar;
// Vue.use(VueScrollLock)
// Vue.use(ToastPlugin);
export default {
    directives: {
        TransferDom
    },
    components: {
        Group,
        Cell,
        Datetime,
        Popup,
        DateTimePickerView
    },
    data: function () {
        return {
            selectedDate: '',
            currentValue: '',
            format: "MM/DD EE",
            nativeTimestap: 0, //传递给native的时间戳
            showPopup: false,
            oldNativeTimestap: 0, //保存可以恢复的时间戳
            mode: 'date',
            forceUpdate: false,
        }
    },
    props: {
        title: {
            type: String,
            default: ""
        },
        funName: {//传递进来的方法名
            type: String,
            default: ""
        },
        formatDate: {
            type: Object
        },
        serverFormat: {
            type: String,
            default: ""
        },
        value: {
            type: String
        },
        placeholder: {
            type: String,
            default: "请选择签发日期"
        },
        flag: {
            type: Boolean,
            default: true
        },
        qfDateFlag: {
            type: Boolean,
            default: false
        },
        cssClass: {
            type: String,
            default: ""
        },
        isInDetailFlag: {//是否明细组件 默认为否
            type: Boolean,
            default: false
        },
        idx: { //组件的index
            type: Number
        },
        daterange: {
            type: String,
            default: null
        },
        relationFiledIds: {
            type: Array,
            default: function () {
                return []
            }
        },
        intervalhours: {
            type: Number,
            default: 0
        },
        fieldKey: {
            type: String,
            default: null
        },
        ssDiaryFlag: {//是否在二级明细组件 默认为否
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        defaultFlag: {//时间控件的默认显示时间，默认为true，并且显示为当前时间
            type: Boolean,
            default: true
        },
        // showPopup:{
        // 	type:Boolean,
        // default:false
        // },
        selectFlag: {
            type: Object,
            default: function () {
                return { 'show': false }
            }
        },
        displayMode: {
            type: Number,
            default: 3
        },
        hideInput: { //隐藏input输入框参数 0911 QiuSen
            type: Boolean,
            default: true
        },
        agoDayHide: {
            type: String,
            default: "0"
        },
        textAlign: {
            type: String,
            default: "left"
        }
    },
    beforeCreate: function () {
    },
    created: function () {
        var _this = this;
        //设置时间显示格式
        _this.getDataModel();

        if (_this.fieldKey == 'taxesReportDate') {
            _this.formatDate.format = 'YYYY年MM月';
        }
        _this.format = _this.formatDate.format;
        _this.serverFormat = _this.formatDate.serverFormat;
        if (!_this.value) {//如果有草稿或者再次申请的情况，此处不能在设置当天时间初始值  bug 22902
            if (_this.qfDateFlag) {//签发日期的初始值
                _this.selectedDate = dateFormat(new Date(), _this.format);//默认为当天   显示
                _this.nativeTimestap = new Date(new Date().toLocaleDateString()).getTime();//取当天零点
                _this.currentValue = dateFormat(new Date(), "YYYY/MM/DD");
                _this.showClick(_this.nativeTimestap);
            } else if (!!_this.daterange) { //开始和结束时间的初始值
                var defalutDateStr = '';
                if (_this.daterange == 'startDate') {
                    defalutDateStr = dateFormat(new Date(), "YYYY/MM/DD") + " 08:30";  //开始时间默认为当天的08:30显示
                    // 打卡异常模板,默认取当前时间前一天8:30
                    if (_this.fieldKey == 'date_842_noempty') {
                        defalutDateStr = dateFormat(new Date((_this.formatTimeHour() - 86400) * 1000), "YYYY/MM/DD") + " 08:30";
                    }
                } else if (_this.daterange == 'endDate') {
                    //根据intervalhours的数据来控制结束时间的默认值，需要优化
                    if (_this.intervalhours == '9') {
                        defalutDateStr = dateFormat(new Date(), "YYYY/MM/DD") + " 17:30";  //结束时间默认为当天的17:30显示
                    } else if (_this.intervalhours == '0.5') {
                        defalutDateStr = dateFormat(new Date(), "YYYY/MM/DD") + " 09:00";  //预约推拿的结束时间默认为当天的09:00显示
                    }
                }
                _this.nativeTimestap = new Date(defalutDateStr).getTime();
                _this.selectedDate = dateFormat(_this.nativeTimestap, _this.format);
                _this.currentValue = defalutDateStr;
                _this.showClick(_this.nativeTimestap);
            } else if (_this.defaultFlag) {
                _this.selectedDate = dateFormat(new Date(), _this.format);//默认为当天   显示
                _this.nativeTimestap = new Date().getTime();//取当前时间
                _this.currentValue = dateFormat(new Date(), _this.format);
                _this.showClick(_this.nativeTimestap);
            } else if (!_this.defaultFlag) {
                _this.nativeTimestap = new Date().getTime();//取当前时间
                _this.currentValue = new Date().getTime();
                //_this.showClick(_this.nativeTimestap);
            }
        }
        console.log('_this.selectedDate == ', _this.selectedDate);
    },
    computed: {
        inputStyle() {
            if (this.textAlign) {
                return {
                    textAlign: this.textAlign
                }
            }
        }
    },
    mounted: function () {//存在value,显示value  供存草稿使用
        var _this = this;
        if (this.value) {
            if (this.qfDateFlag && 'yyyymmdd' == this.serverFormat.toLowerCase()) {//签发模板 发送给服务器的格式为yyyyMMDD 例如20171112
                var val = this.value + '';
                _this.selectedDate = val.substring(0, 4) + '-' + val.substring(4, 6) + '-' + val.substring(6, 8);
                _this.nativeTimestap = new Date(_this.selectedDate).getTime();
            } else {//其他模板 发送给服务器的为时间戳
                this.selectedDate = dateFormat(this.value * 1000, this.format);
                _this.nativeTimestap = this.value * 1000;
                _this.currentValue = this.value * 1000;
                //修改bug 24203
                if (_this.daterange) {
                    //开始时间和结束时间的时机戳
                    _this.getStartEndDateTime();

                    if (_this.relationFiledIds.length > 1) {//需要计算天数的情况，有的模板不需要计算天数
                        var days = DatetimeHandler.datetimeCompute(_this.startDateTime, _this.endDateTime);
                        var daysObj = _this.getDaysObj();//天数组件对象
                        daysObj.computeDays = days;
                    }
                }
            }
        } else {
            //开始和结束天数的计算   有草稿的时候，优先草稿的天数显示，Bug 23750 
            _this.startEndDateCompute();
        }
    },
    methods: {
        showC() {//关联方法的调用
            var _this = this;
            var fName = _this.funName;
            _this[fName]();
        },
        /**
         * 传递给服务器的值
         * value 传递给服务器的时间
         */
        showClick(value) {
            var _this = this;
            var returnValue = new Date();
            if ("timestamp" == _this.serverFormat) {
                returnValue = parseInt(value / 1000);
            } else {
                returnValue = dateFormat(value, _this.serverFormat);
            }
            _this.$emit('input', returnValue);//发送服务器
        },
        /**
         * 点击时间选择事件
         */
        clickTimeFun: function () {
            //readonly
            if (this.readonly) {
                return;
            }

            this.newselectTime();
        },
        /**
         * 调用时间组件
         */
        newselectTime: function () {
            document.body.style.overflow = 'hidden';
            this.forceUpdate = true;
            this.$nextTick(() => {
                this.showPopup = true;
                this.selectFlag.show = true;
            });

            //打开二级页面记住一级页面滚动位 置
            // var bodyScrTop = $("body").scrollTop();
            // $("body").css({
            //     'overflow': 'hidden',
            //     'position': 'fixed',
            //     'top': bodyScrTop * -1
            // });
            // $("body").attr("bodyScrTop", bodyScrTop);

            // var times = this.nativeTimestap / 1000;
            // this.$refs.DateTimePickerView.render(times);
            /*				const Json = {
                                'year': myData.getFullYear(),
                                'month': myData.getMonth() + 1,
                                'day': myData.getDate()
                                  };
                                this.$refs.Calendar.createDate(Json);*/
        },
        commitDate: function (data) {
            console.log("commitDate = " + data);
            var _this = this;
            /* todo 这里有displayMode为5的情况记录 */
            if (_this.mode === 'datetime' || _this.mode === '5') {
                _this.setDateTime(new Date(data).getTime());
            }
        },
        changeDate: function (data) {
            if (this.showPopup && this.displayMode == '3') {
                console.log("changeDate = " + data);
                this.setDateTime(data * 1000);
            }
        },
        choseDay: function (data) {
            console.log("choseDay = " + data);
        },
        onChange: function (value) {
            console.log("onChange = " + value);
            const mode = this.mode;
            if (mode === 'datetime' || mode === 'date' || mode === 'year-month') {
                this.setDateTime(new Date(value).getTime());
            }
        },
        setDateTime: function (slTimeStamp) {
            var _this = this;
            if (_this.formatDate.format == 'YYYY/MM/DD') {
                if (!!_this.daterange) {
                    var timeTranStr = '';
                    if (_this.daterange == 'startDate') {
                        timeTranStr = dateFormat(slTimeStamp, "YYYY/MM/DD") + " 08:30";
                    }
                    if (_this.daterange == 'endDate') {
                        timeTranStr = dateFormat(slTimeStamp, "YYYY/MM/DD") + " 17:30";
                    }
                    slTimeStamp = new Date(timeTranStr).getTime();
                }
            }
            var selectTime = dateFormat(slTimeStamp, _this.format);
            if (_this.qfDateFlag && dateFormat(new Date(), 'YYYY/MM/DD') > selectTime) {
                showToast('签发日期不能早于当前日期', 'middle');
                return;
            }
            //保存还原时间戳，Bug 24169
            _this.oldNativeTimestap = _this.nativeTimestap;
            _this.nativeTimestap = slTimeStamp;
            //开始和结束时间的比较，
            if (!_this.startEndDateCheck()) {
                return;
            }

            _this.selectedDate = selectTime;
            _this.showClick(slTimeStamp);

            //开始和结束时间的计算，
            _this.startEndDateCompute();


            if (_this.formatDate.format == 'YYYY-MM') {
                _this.selectedDate = dateFormat(slTimeStamp, 'YYYY-MM');
            }
            _this.showPopup = false;
            setTimeout(() => {
                _this.forceUpdate = false;
            }, 150);

            _this.$nextTick(() => {
                _this.setBodysrcTop();
            })
        },
        /**
         * 获取时间显示格式
         */
        getDataModel: function () {
            /* 根据时间模式判断日历模式 */
            const displayMode = this.displayMode;
            if (displayMode === 1) {
                this.mode = 'datetime';
            } else if (displayMode === 3) {
                this.mode = 'date';
            } else if (displayMode === 5) {
                this.mode = 'year-month';
            }

            /* todo 为了维持原有业务逻辑，经常有display没传但是需要format找到对应的日历模式，这个需要后期修改业务传入的display值 */
            /* 根据format判定日历模式 */
            if (this.formatDate.format.toLocaleLowerCase().indexOf('hh:mm') > 0) {
                this.mode = 'datetime';
            }
            if (this.formatDate.format === 'YYYY-MM') {
                this.mode = 'year-month';
            }
        },
        /**
         * 调用平台的时间控件
         */
        pcSelectTime: function () {
            var _this = this;
            if (_this.readonly) {
                return;
            }
            console.log('selectTime start');
            //请求native选择时间
            var selectStartTime = _this.nativeTimestap;//取当前时间戳传递给native
            //var formatMap = ["mm/dd ee hh:mm",'yyyy-mm-dd hh:mm']
            var showModel = (0 < (_this.format.toLocaleLowerCase()).indexOf('hh:mm')) ? 2 : 1;
            //代发工资
            showModel = (0 < (_this.format.toLocaleLowerCase()).indexOf('dd')) ? showModel : 4;
            var selectTimeJson = {
                timeId: '1',// 控件ID
                showModel: showModel,// 显示模式 1：只有年月日的显示选择 2:显示年月日时分 3：显示开始结束时间 4:显示年月
                startTime: selectStartTime,// 初始化开始时间
                endTime: 0 // 初始化结束时间 showModel == 3 时 才有效
            };
            SelectTimeWidget(JSON.stringify(selectTimeJson)).then(function (data) {
                if ('' != data) {
                    //修改bug 24852和24851，
                    //如果是年月日格式的日期，ios返回的时间戳不会带上小时数，需要将返回的时间戳手动给开始和结束时间加上08:30和17:30再转成时间戳
                    if (_this.formatDate.format == 'YYYY/MM/DD') {
                        if (!!_this.daterange) {
                            var timeTranStr = '';
                            if (_this.daterange == 'startDate') {
                                timeTranStr = dateFormat(data.startTime, "YYYY/MM/DD") + " 08:30";
                            }
                            if (_this.daterange == 'endDate') {
                                timeTranStr = dateFormat(data.startTime, "YYYY/MM/DD") + " 17:30";
                            }
                            data.startTime = new Date(timeTranStr).getTime();
                        }
                    }
                    var selectTime = dateFormat(data.startTime, _this.format);
                    if (_this.qfDateFlag && dateFormat(new Date(), 'YYYY/MM/DD') > selectTime) {
                        showToast('签发日期不能早于当前日期', 'middle');
                        return;
                    }
                    //保存还原时间戳，Bug 24169
                    _this.oldNativeTimestap = _this.nativeTimestap;
                    _this.nativeTimestap = data.startTime;
                    //开始和结束时间的比较，
                    if (!_this.startEndDateCheck()) {
                        return;
                    }

                    _this.selectedDate = selectTime;
                    _this.showClick(data.startTime);

                    //开始和结束时间的计算，
                    _this.startEndDateCompute();
                }
            });
        },
        /**
         * 开始和结束时间的比较，结束时间会跟着开始时间变化
         */
        startEndDateCheck: function () {
            var _this = this;
            if (_this.daterange) {
                //开始时间和结束时间的时机戳
                _this.getStartEndDateTime();

                var showMsg = "结束时间要大于开始时间";
                if (_this.$root.templetType == '55') {
                    showMsg = '申请离职日期要大于入职时间';
                } else if (_this.$root.templetType == '56') {
                    showMsg = '续签合同的结束时间要大于开始时间';
                }
                var a = (_this.endDateTime - _this.startDateTime) / 3600 / 1000;
                if (a <= 0 && _this.daterange == 'endDate') {
                    showToast(showMsg, 'middle');
                    //还原时间戳，Bug 24169 
                    _this.nativeTimestap = _this.oldNativeTimestap;
                    return false;
                } else if (a <= 0 && _this.daterange == 'startDate') {
                    _this.endDateTime = _this.startDateTime + parseFloat(_this.intervalhours) * 1000 * 60 * 60;
                    var endDateTimeObj = {};
                    if (_this.isInDetailFlag) {//如果在明细里面 
                        endDateTimeObj = _this.$root.$refs.inDetail[0].$refs[_this.relationFiledIds[0]][_this.idx];
                    } else if (_this.ssDiaryFlag) {
                        endDateTimeObj = _this.$parent.$refs[_this.relationFiledIds[0]][_this.idx];
                    } else {
                        if (_this.$root.templetType == '56') {
                            endDateTimeObj = _this.$root.$refs.renewContract[0].$refs[_this.relationFiledIds[0]];
                        } else {
                            endDateTimeObj = _this.$root.$refs[_this.relationFiledIds[0]][0];
                        }
                    }
                    endDateTimeObj.selectedDate = dateFormat(_this.endDateTime, endDateTimeObj.format);
                    endDateTimeObj.showClick(_this.endDateTime);
                    endDateTimeObj.nativeTimestap = _this.endDateTime;
                } else {
                    //更新保存时间戳，Bug 24169
                    _this.oldNativeTimestap = _this.nativeTimestap;
                }
            }
            return true;
        },
        /**
         * 开始时间和结束时间的计算，如果是请假模板，还需要查询可用年假天数
         * relationFiledIds需要符合一定的规则，第一个元素是时间的id，第二个元素是天数的id
         */
        startEndDateCompute: function () {
            var _this = this;
            if (_this.daterange) {
                //获取开始时间和结束时间的时机戳 
                _this.getStartEndDateTime();

                if (_this.relationFiledIds.length > 1) {//需要计算天数的情况，有的模板不需要计算天数
                    var days = DatetimeHandler.datetimeCompute(_this.startDateTime, _this.endDateTime);
                    if (days) {
                        var daysObj = _this.getDaysObj();//天数组件对象 
                        var daysValue = 0
                        if (daysObj.pointlength == 1) {
                            daysValue = days * 10;
                        } else if (daysObj.pointlength == 0) {
                            daysValue = days;
                        }
                        daysObj.$emit('input', daysValue);
                        if (_this.ssDiaryFlag) {//如果是二级明细的话，需要手动的给这个天数组件的value赋值
                            daysObj.value = daysValue;
                        }
                        //computeDays的值是带了小数点了的
                        daysObj.computeDays = days;
                    }
                }
                //请假模板，如果选择了年假，又修改了时间，则需要重新查询可用年假
                if (_this.fieldKey == 'date_557_noempty' || _this.fieldKey == 'date_287_noempty') {
                    if (!!_this.$root.$refs.type_554 && _this.$root.$refs.type_554[0].selectedValue == '年假') {
                        AttendanceHandler.getannualLeave(true, _this);
                    }
                    //bug 23744
                    AttendanceHandler.showLeaveTips(_this);
                }
            }
            return true;
        },
        /**
         * 开始时间和结束时间的时机戳的获取方法
         * startDateTime 和 endDateTime是全局变量
         */
        getStartEndDateTime: function () {
            var _this = this;
            //开始或者结束时间关联的组件的时间戳 
            var relationValue = 0;
            if (_this.isInDetailFlag) {//如果在明细里面
                relationValue = _this.$root.content.inDetail[_this.idx][_this.relationFiledIds[0]];
            } else if (_this.ssDiaryFlag) {
                relationValue = _this.$parent.$refs[_this.relationFiledIds[0]][_this.idx].nativeTimestap / 1000;
            } else {
                relationValue = _this.$root.content[_this.relationFiledIds[0]];
                if (_this.$root.templetType == '56') {
                    relationValue = _this.$root.content.renewContract[_this.relationFiledIds[0]];
                }
            }
            if (_this.daterange == 'startDate') {
                _this.startDateTime = _this.nativeTimestap;
                _this.endDateTime = relationValue * 1000;
            } else if (_this.daterange == 'endDate') {
                _this.endDateTime = _this.nativeTimestap;
                _this.startDateTime = relationValue * 1000;
            }
        },
        /**
         * 获取关联的天数的组件对象
         */
        getDaysObj: function () {
            var _this = this;
            var daysObj = {};
            if (_this.isInDetailFlag) {//如果在明细里面 
                daysObj = _this.$root.$refs.inDetail[0].$refs[_this.relationFiledIds[1]][_this.idx];
            } else if (_this.ssDiaryFlag) {
                daysObj = _this.$parent.$refs[_this.relationFiledIds[1]][_this.idx];
            } else {
                daysObj = _this.$root.$refs[_this.relationFiledIds[1]][0];
            }
            return daysObj;
        },
        /*
         * 设置页面body滚动高度，用于显示隐藏二级页面时保持一级页面的高度
         * */
        setBodysrcTop: function () {
            document.body.style.overflow = '';
            setTimeout(() => {
                this.forceUpdate = false;
            }, 150);
            this.selectFlag.show = false;

            //关闭二级页面设置一级页面滚动位置
            // $("body").css({
            //     'overflow': 'auto',
            //     'position': 'static',
            //     'top': 'auto'
            // });
            // $("body").scrollTop($("body").attr("bodyScrTop"));
        },
        //  取当天的零点
        // 入参出参为10位时间戳
        formatTimeHour() {
            let nowTimeDate = new Date();
            nowTimeDate.setHours(0, 0, 0, 0);//设为当天0点0分0秒0毫秒。
            let realATime = nowTimeDate.getTime();//把nowTime的日期加到startTime上
            return realATime / 1000;
        },
    },
    watch: {
        /**
         * 数据显示 主要针对删除使用
         * @param {Object} newVal
         * @param {Object} oldVal
         */
        value: function (newVal, oldVal) {

            var _this = this;
            if (_this.value) {
                if (_this.qfDateFlag && 'yyyymmdd' == this.serverFormat.toLowerCase()) {//签发模板 发送给服务器的格式为yyyyMMDD 例如20171112
                    var val = _this.value + '';
                    _this.selectedDate = val.substring(0, 4) + '-' + val.substring(4, 6) + '-' + val.substring(6, 8);
                    _this.nativeTimestap = new Date(_this.selectedDate).getTime();
                    _this.currentValue = new Date(_this.selectedDate).getTime();
                } else {//其他模板 发送给服务器的为时间戳
                    _this.selectedDate = dateFormat(_this.value * 1000, _this.format);
                    _this.nativeTimestap = _this.value * 1000;
                    _this.currentValue = _this.value * 1000;
                }
            }
            //开始和结束天数的计算
            _this.startEndDateCompute();
        },
        /**
         * 父组件控件组件显示隐藏标识
         * @param {Object} newVal  新值
         * @param {Object} oldVal  旧值
         */
        'selectFlag.show': function (newVal, oldVal) {
            if (!this.selectFlag.show) {//父组件隐藏子组件
                this.showPopup = false;
            }
        }
    }
}
</script>
<style lang="less" scoped>
div.vux-popup-dialog {
    position: fixed !important;
    left: 0 !important;
    bottom: 0 !important;
    background: transparent !important;
    z-index: 501 !important;
    transition-property: transform !important;
    transition-duration: 300ms !important;
    max-height: 100% !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch;
    transform: initial !important;
}

div.vux-popup-dialog.vux-popup-animate-bottom-enter,
div.vux-popup-dialog.vux-popup-animate-bottom-leave-active {
    transform: translate3d(0, 100%, 0) !important;
}

@media screen and (min-width: 1080px) {
    div.vux-popup-dialog {
        left: calc(~"(100vw - 1080px) / 2") !important;
    }
}
</style>