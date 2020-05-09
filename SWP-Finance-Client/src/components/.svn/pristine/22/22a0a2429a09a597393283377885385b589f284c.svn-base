<template>
    <div class="sn-calendar">
        <div class="sn-calendar-header">
            <div class="sn-calendar-tabs">
                <div
                        v-show="showCalender && (mode === 'date' || mode === 'datetime')"
                        class="sn-calendar-tabs-arrow"
                        @click="!minDate ? prev() : null"
                >
                    <span class="arrow left"></span>
                </div>
                <div
                        class="sn-calendar-tabs-item"
                        :class="{
                            active: (mode === 'date' || mode === 'datetime') && showMonthSelect
                        }"
                        @click="(mode === 'date' || mode === 'datetime') ? switchView('date') : null"
                >{{panelTitle}}
                </div>
                <div
                        v-if="showCalender && (mode === 'date' || mode === 'datetime')"
                        class="sn-calendar-tabs-arrow"
                        @click="!maxDate ? next() : null"
                >
                    <span class="arrow right"></span>
                </div>
                <div
                        v-if="mode === 'datetime'"
                        class="sn-calendar-tabs-item"
                        :class="{active: showTimeSelect, 'replace-arrow-seat': showMonthSelect || showTimeSelect}"
                        @click="switchView('time')"
                >{{currentTime}}
                </div>
            </div>
            <div class="sn-calendar-btn" v-show="!quickToday" @click="submit" :class="{onlyTime:onlyTime}">确定</div>
            <div class="sn-calendar-btn" v-if="quickToday && !showMonthSelect" @click="setToday"
                 :class="{onlyTime:onlyTime}">今天
            </div>
        </div>
        <div class="sn-calendar-weekday" :style="{visibility: showCalender ? 'visible' : 'hidden'}">
            <div class="sn-calendar-weekday-item" v-for="week in weekList">
                <div>{{week}}</div>
            </div>
        </div>
        <!-- 由于view视图切换高度会丢失，那么需要在pane上也要定义高度，防止闪动问题出现 -->
        <div class="sn-calendar-pane" :style="{height: height}">
            <swiper
                    :show-dots="false"
                    direction="vertical"
                    :height="height"
                    v-model="swiperItemIndex"
                    :duration="400"
                    :threshold="80"
                    :min-moving-distance="80"
                    @on-index-change="onCalendarChange"
                    loop
                    v-show="showCalender"
            >
                <swiper-item v-for="(swiperItem, k0) in swiperList" :key="k0">
                    <div v-for="(month, k1) in swiperItem">
                        <div class="sn-calendar-pane-date">{{`${month.year}年${month.month_str}月`}}</div>
                        <div class="sn-calendar-pane-month">
                            <div class="month-row" v-for="(row, k2) in month.days">
                                <div class="day" v-for="(item, k3) in row">
                                    <div class="day-pack" v-if="item.isCurMonth" @click="select(k1, k2, k3, item)">
                                        <div :class="{today:item.isToday, active: item.isCurrent}">
                                            <div class="day-pack-cell">
                                                <div class="header">
                                                    <span v-if="item.isToday">今天</span>
                                                </div>
                                                <div class="middle"
                                                     v-bind:class="{isHoliday:item.isHoliday,hidden:item.dayHide}">
                                                    {{item.day}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </swiper-item>
            </swiper>
            <div
                    class="date-select"
                    :class="{'single-col': mode === 'year' || mode === 'month'}"
                    v-show="showMonthSelect"
                    :style="{height: height}"
            >
                <picker :data="yearAndMonthList" v-model="selectedDate" @on-change="onYearAndMonthChange"></picker>
            </div>
            <div
                    class="time-select"
                    v-show="showTimeSelect"
                    :style="{height: height}"
            >
                <picker :data="times" v-model="selectedTime" @on-change="onTimeChange"></picker>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        Popover,
        Tab,
        TabItem,
        Swiper,
        Picker,
        ToastPlugin,
        SwiperItem,
        dateFormat
    } from "vux";
    import Vue from "vue";
    import {getDays, zeroComplete, getPrevTime, getNextTime} from './util';

    Vue.use(ToastPlugin);

    export default {
        name: "dateTimePickerView",
        components: {
            Popover,
            Tab,
            Picker,
            TabItem,
            Swiper,
            SwiperItem
        },
        data() {
            return {
                height: '',
                panelTitle: '',
                times: [],
                selectedDate: [],
                selectedTime: [],
                weekList: ["日", "一", "二", "三", "四", "五", "六"],
                onlyDate: false,
                onlyTime: false,
                yearAndMonthList: [],
                showCalender: true,
                showMonthSelect: false,
                showTimeSelect: false,
                year: 0,
                month: 0,
                today: dateFormat(new Date(), 'YYYY/MM/DD'),
                currentValue: '',
                currentDate: '',
                currentTime: "08:30",
                swiperList: [],
                swiperItemIndex: 0,
                quickToday: true,
                minDate: false,
                maxDate: false
            };
        },
        props: {
            value: [String, Number],
            monthSwiperMode: {default: "vertical"}, //月份滑动的方式，左右还是上下滑动
            /* 时间控件模式
            * 1) 'date':         选择日期
            * 2) 'datetime':     选择时间
            * 3) 'year-month':   选择年月
            * 4） 'year':        选择年份
            * 5） 'month':       选择月份
            * 6)  'time':        选择时分
            * */
            mode: {default: "date"},
        },

        created() {
            /* 动态计算swiper高度 */
            this.getHeight();

            this.currentValue = this.value;
            const mode = this.mode;
            const date = (this.currentValue && new Date(this.currentValue)) || new Date();
            const year = date.getFullYear(), month = date.getMonth();
            const fullYear = `${year}`, fullMonth = zeroComplete(month + 1);
            if (mode === 'date') {
                this.currentValue = dateFormat(date, 'YYYY/MM/DD');
                this.quickToday = true;
                this.selectedDate = [fullYear, fullMonth];
                this.render(year, month);
                this.renderYearAndMonth(year, month);
            } else if (mode === 'datetime') {
                try {
                    this.currentDate = dateFormat(date, 'YYYY/MM/DD');
                } catch (e) {
                    throw Error('[dateTimePickerView] 时间格式不正确');
                }
                this.currentValue = dateFormat(date, 'YYYY/MM/DD');
                this.quickToday = false;
                this.selectedDate = [fullYear, fullMonth];
                this.render(year, month);
                this.renderYearAndMonth(year, month);
                this.renderTime(date.getHours(), date.getMinutes());
            } else if (mode === 'year-month') {
                this.showCalender = false;
                this.showMonthSelect = true;
                this.quickToday = false;
                this.selectedDate = [fullYear, fullMonth];
                this.renderYearAndMonth(year, month);
            } else if (mode === 'year') {
                this.showCalender = false;
                this.showMonthSelect = true;
                this.quickToday = false;
                this.selectedDate = [fullYear];
                this.renderYearAndMonth(year);
            } else if (mode === 'month') {
                this.showCalender = false;
                this.showMonthSelect = true;
                this.quickToday = false;
                this.selectedDate = [fullMonth];
                this.renderYearAndMonth(null, month);
            } else if (mode === 'time') {
                this.showCalender = false;
                this.showMonthSelect = false;
                this.quickToday = false;
                this.showTimeSelect = true;
                this.renderTime(this.currentValue.split(':')[0], this.currentValue.split(':')[1]);
            }
        },
        mounted() {
        },
        methods: {
            getHeight() {
                const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                this.height = windowWidth < 480 ? `${windowWidth * 1.065}px` : '360px';
            },
            render(year, month, force = false) {
                const value = this.currentValue;
                // if (this.year === year && this.month === month && !force) {
                //     return;
                // }
                this.year = year;
                this.month = month;

                /* 注入滑动数组 */
                this.renderSwiper(year, month, value);
            },
            /* 渲染单页两个月数据 */
            renderSwiper(year, month, value) {
                let preSwiper, curSwiper, nextSwiper;
                /* 生成总共需要的四个月数据 */
                const prevTime = getPrevTime(year, month);
                const nextTime = getNextTime(year, month);
                const next2Time = getNextTime(nextTime.year, nextTime.month);
                const prevMonth = getDays({...prevTime, value});
                const curMonth = getDays({year, month, value});
                const nextMonth = getDays({...nextTime, value});
                const next2Month = getDays({...next2Time, value});

                /* 填充第一页两个月数据 */
                curSwiper = [curMonth, nextMonth];
                /* 填充下一页两个月数据 */
                nextSwiper = [nextMonth, next2Month];
                /* 填充上一页两个月数据 */
                preSwiper = [prevMonth, curMonth];
                this.swiperList = [];
                this.swiperList = [curSwiper, nextSwiper, preSwiper];
                this.swiperItemIndex = 0;
            },
            /* 根据指定日期生成上下20年年月数据 */
            renderYearAndMonth(year, month) {
                const mode = this.mode;
                const _date = new Date();
                let _year = _date.getFullYear();
                const yearList = [], monthList = [];
                // 加载前后20年数据
                for (let i = _year - 20; i <= _year + 20; i++) {
                    yearList.push({
                        name: `${i}年`,
                        value: `${i}`
                    });
                }
                // 加载12个月份
                for (let i = 1; i <= 12; i++) {
                    const month = zeroComplete(i);
                    monthList.push({
                        name: `${month}月`,
                        value: month
                    });
                }

                if (mode === 'date' || mode === 'datetime' || mode === 'year-month') {
                    this.yearAndMonthList = [yearList, monthList];
                    this.selectedDate = [`${year}`, `${zeroComplete(month + 1)}`];
                } else if (mode === 'year') {
                    this.yearAndMonthList = [yearList];
                    this.selectedDate = [`${year}`];
                } else if (mode === 'month') {
                    this.yearAndMonthList = [monthList];
                    this.selectedDate = [`${zeroComplete(month + 1)}`];
                }
            },
            /* 渲染时分选择 */
            renderTime(hour, min) {
                let now = new Date();

                const hours = [];
                const minutes = [];
                for (let i = 0; i < 60; i++) {
                    if (i < 24) {
                        hours.push(`${zeroComplete(i)}`);
                    }
                    minutes.push(`${zeroComplete(i)}`);
                }
                this.times = [hours, minutes];
                this.selectedTime = [zeroComplete(!isNaN(hour) ? hour : now.getHours()), zeroComplete(!isNaN(min) ? min : now.getMinutes())];
                this.currentTime = this.selectedTime.join(':');
            },
            prev() {
                const swiperItemIndex = this.swiperItemIndex;
                const goIndex = (swiperItemIndex - 1) >= 0 ? (swiperItemIndex - 1) : 2;
                this.onCalendarChange(goIndex);
                this.$nextTick(() => {
                    this.swiperItemIndex = goIndex;
                });
            },
            next() {
                const swiperItemIndex = this.swiperItemIndex;
                const goIndex = (swiperItemIndex + 1) <= 2 ? (swiperItemIndex + 1) : 0;
                this.onCalendarChange(goIndex);
                this.$nextTick(() => {
                    this.swiperItemIndex = goIndex;
                });
            },
            go(year, month) {
                this.render(year, month, true)
            },
            /* 选择日期 */
            select(k1, k2, k3, data) {
                const mode = this.mode;
                if (data.isLastMonth && !this.showLastMonth) {
                    return;
                }
                if (data.isNextMonth && !this.showNextMonth) {
                    return;
                }
                // if (!this.isBetween(data.formatedDate)) {
                //     return;
                // }
                // if (this.isDisabled(data)) {
                //     // not in range
                //     if (!this.isBetween(data.formatedDate)) {
                //         return
                //     } else { // in range but disabled by disableDateFunction
                //         if (this.disableDateFunction && this.disableDateFunction(data)) {
                //             return
                //         }
                //         if (data.isWeekend && this.disableWeekend) {
                //             return
                //         }
                //     }
                // }
                let _currentValue = data.formatedDate;
                if (!data.isLastMonth && !data.isNextMonth) {
                    const swiperItem = this.swiperList[this.swiperItemIndex];
                    for (let i = 0; i < swiperItem.length; i++) {
                        const month = swiperItem[i];
                        const days = month.days;
                        for (let row = 0; row < days.length; row++) {
                            for (let day = 0; day < days[row].length; day++) {
                                if (i === k1 && row === k2 && day === k3) {
                                    this.swiperList[this.swiperItemIndex][k1].days[k2][k3].isCurrent = true;
                                } else {
                                    this.swiperList[this.swiperItemIndex][i].days[row][day].isCurrent = false;
                                }
                            }
                        }
                    }
                }
                this.currentValue = _currentValue;
                this.currentDate = _currentValue;
                if (mode === 'date') {
                    this.$emit('on-change', this.currentValue);
                }

                if (this.renderOnValueChange) {
                    this.render(null, null);
                }
            },
            /* 选择当天 */
            setToday() {
                const now = new Date();
                const year = now.getFullYear(), month = now.getMonth();
                this.currentValue = dateFormat(now, 'YYYY/MM/DD');
                this.selectedDate = [`${year}`, `${zeroComplete(month + 1)}`];
                this.render(year, month);
                this.$emit('on-change', this.currentValue);
            },
            /* 设置选中的天 */
            setSelectedDay() {
                let currentDate = new Date(this.currentValue);
                const day = currentDate.getDate();
                /* 当前月最大日期 */
                const selectedMonthMaxDate = new Date(this.year, this.month + 1, 0).getDate();
                const selectedDay = dateFormat(new Date(this.year, this.month, day < selectedMonthMaxDate ? day : selectedMonthMaxDate), 'YYYY/MM/DD');
                this.currentValue = selectedDay;
                this.currentDate = selectedDay;
                console.log('setSelectedDay currentValue = ', this.currentValue);
                for (let t = 0; t < this.swiperList.length; t++) {
                    const swiperItem = this.swiperList[t];
                    for (let i = 0; i < swiperItem.length; i++) {
                        const month = swiperItem[i];
                        const days = month.days;
                        for (let row = 0; row < days.length; row++) {
                            for (let day = 0; day < days[row].length; day++) {
                                if (days[row][day].formatedDate === selectedDay) {
                                    this.swiperList[t][i].days[row][day].isCurrent = true;
                                } else {
                                    this.swiperList[t][i].days[row][day].isCurrent = false;
                                }
                            }
                        }
                    }
                }
            },
            /* 确认日期 */
            submit() {
                const mode = this.mode;
                if (mode === 'datetime') {
                    if (!this.currentDate || this.currentDate === '') {
                        this.$vux.toast.text('请选择日期', 'middle');
                        return;
                    } else {
                        this.currentValue = this.currentDate + ' ' + this.currentTime;
                    }
                } else if (mode === 'year-month') {
                    this.currentValue = this.selectedDate[0] + '-' + this.selectedDate[1];
                } else if (mode === 'year' || mode === 'month') {
                    this.currentValue = this.selectedDate[0];
                } else if (mode === 'time') {
                    this.currentValue = this.selectedTime[0] + ':' + this.selectedTime[1];
                }
                this.$emit('on-change', this.currentValue);
            },
            /* 日历onChange回调 */
            onCalendarChange(currentIndex) {
                // console.log('onCalendarChange currentIndex = ', currentIndex);
                // console.log('onCalendarChange swiperItemIndex = ', this.swiperItemIndex);
                // console.log('onCalendarChange currentValue = ', this.currentValue);
                const _year = this.year,
                    _month = this.month,
                    _swiperItemIndex = this.swiperItemIndex,
                    _currentValue = this.currentValue;

                if (_swiperItemIndex !== currentIndex) {
                    this.year = this.swiperList[currentIndex][0].year;
                    this.month = this.swiperList[currentIndex][0].month;
                    this.selectedDate = [`${this.year}`, `${zeroComplete(this.month + 1)}`];
                    const prevTime = getPrevTime(_year, _month);
                    const prev2Time = getPrevTime(prevTime.year, prevTime.month);
                    const nextTime = getNextTime(_year, _month);
                    const next2Time = getNextTime(nextTime.year, nextTime.month);
                    const next3Time = getNextTime(next2Time.year, next2Time.month);

                    const prevMonth = getDays({...prevTime, value: _currentValue});
                    const prev2Month = getDays({...prev2Time, value: _currentValue});
                    const curMonth = getDays({year: _year, month: _month, value: _currentValue});
                    const nextMonth = getDays({...nextTime, value: _currentValue});
                    const next2Month = getDays({...next2Time, value: _currentValue});
                    const next3Month = getDays({...next3Time, value: _currentValue});

                    setTimeout(() => {
                        /* 当前页为第一页 */
                        if (_swiperItemIndex === 0) {
                            /* 下滑，进入第二页; 开始顺序 => [cur, next, prev], 结束顺序 => [cur, next, next2] */
                            if (currentIndex === 1) {
                                this.$set(this.swiperList, 2, [next2Month, next3Month]);
                            } else {
                                /* 上滑，进入第三页; 开始顺序 => [cur, next, prev], 结束顺序 => [cur, prev2, prev] */
                                this.$set(this.swiperList, 1, [prev2Month, prevMonth]);
                            }
                        }
                        /* 当前页为第二页 */
                        else if (_swiperItemIndex === 1) {
                            /* 下滑，进入第三页; 开始顺序 => [prev, cur, next], 结束顺序 => [next2, cur, next] */
                            if (currentIndex === 2) {
                                this.$set(this.swiperList, 0, [next2Month, next3Month]);
                            } else {
                                /* 上滑，进入第一页; 开始顺序 => [prev, cur, next], 结束顺序 => [prev, cur, prev2] */
                                this.$set(this.swiperList, 2, [prev2Month, prevMonth]);
                            }
                        }
                        /* 当前页为第三页 */
                        else if (_swiperItemIndex === 2) {
                            /* 下滑，进入第一页; 开始顺序 => [next, prev, cur], 结束顺序 => [next, next2, cur] */
                            if (currentIndex === 0) {
                                this.$set(this.swiperList, 1, [next2Month, next3Month]);
                            } else {
                                /* 上滑，进入第二页; 开始顺序 => [next, prev, cur], 结束顺序 => [prev2, prev, cur] */
                                this.$set(this.swiperList, 0, [prev2Month, prevMonth]);
                            }
                        }

                        /* 滑动结束后执行选中滑动前选中的天 */
                        this.$nextTick(() => {
                            this.setSelectedDay();
                        });
                    });
                }
            },
            /* 年月onChange回调 */
            onYearAndMonthChange(value) {
                console.log('onYearAndMonthChange = ', value);
                if (value && value instanceof Array) {
                    const mode = this.mode;
                    const date = value;
                    if (mode === 'date' || mode === 'datetime' || mode === 'year-month') {
                        const year = date[0];
                        const month = date[1];
                        this.panelTitle = `${year}年${month}月`;
                        if (mode !== 'year-month') {
                            const day = new Date(this.currentValue).getDate();
                            /* 当前月最大日期 */
                            const selectedMonthMaxDate = new Date(year, month, 0).getDate();
                            const selectedDay = dateFormat(new Date(year, month - 1, day < selectedMonthMaxDate ? day : selectedMonthMaxDate), 'YYYY/MM/DD');
                            this.currentValue = selectedDay;
                            this.currentDate = selectedDay;
                            this.render(parseInt(year), parseInt(month - 1), true);
                        }
                    } else if (mode === 'year') {
                        const year = date[0];
                        this.panelTitle = `${year}年`;
                    } else if (mode === 'month') {
                        const month = date[0];
                        this.panelTitle = `${month}月`;
                    }
                }
            },
            /* 时间onChange回调 */
            onTimeChange(time) {
                this.currentTime = time[0] + ":" + time[1];
            },
            /* 切换视图 */
            switchView(type) {
                const that = this;
                if (type === "date") {
                    if (that.showMonthSelect) {
                        that.showMonthSelect = false;
                        that.showCalender = true;
                    } else if (that.showTimeSelect) {
                        that.showCalender = true;
                        that.showTimeSelect = false;
                    } else {
                        that.showCalender = false;
                        that.showMonthSelect = true;
                    }
                } else if (type == "time") {
                    that.showCalender = false;
                    that.showMonthSelect = false;
                    that.showTimeSelect = true;
                }
            },
        },
        watch: {
            value(val) {
                this.currentValue = val;
            },
            currentValue(val, oldVal) {

            },
            selectedDate(val) {
                const {mode, selectedDate} = this;
                if (mode === 'date' || mode === 'datetime' || mode === 'year-month') {
                    const now = new Date();
                    this.panelTitle = `${selectedDate[0]}年${selectedDate[1]}月`;
                    if(parseInt(selectedDate[0]) === (now.getFullYear() - 20) && parseInt(selectedDate[1]) === 1) {
                        this.minDate = true;
                    }
                    if(parseInt(selectedDate[0]) === (now.getFullYear() + 20) && parseInt(selectedDate[1]) === 12) {
                        this.maxDate = true;
                    }
                } else if (mode === 'year') {
                    this.panelTitle = `${selectedDate[0]}年`;
                } else if (mode === 'month') {
                    this.panelTitle = `${selectedDate[0]}月`;
                }
            },
            selectedTime(val) {
                const {mode, selectedTime} = this;
                if (mode === 'time') {
                    this.panelTitle = `${selectedTime[0]}:${selectedTime[1]}`;
                }
            }
        }
    };
</script>
<style lang="less">
    @import "./index.less";
</style>