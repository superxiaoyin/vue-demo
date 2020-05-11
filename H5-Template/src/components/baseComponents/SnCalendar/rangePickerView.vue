<template>
    <div class="sn-calendar">
        <div class="sn-calendar-header">
            <div class="sn-calendar-tabs range-date">
                <div
                        class="sn-calendar-tabs-item highlight"
                        :class="{
                            active: beginDateSelect
                        }"
                        @click="switchView('begin')"
                >{{beginDate ? valueFormat(beginDate) : '请选择起始日期'}}
                </div>
                <div class="sn-calendar-tabs-separator">—</div>
                <div
                        class="sn-calendar-tabs-item highlight"
                        :class="{active: endDateSelect}"
                        @click="switchView('end')"
                >{{endDate ? valueFormat(endDate) : '请选择结束日期'}}
                </div>
            </div>
            <div class="sn-calendar-btn" @click="submit">确定</div>
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
                <swiper-item v-for="(month, k0) in swiperList" :key="k0">
                    <div class="sn-calendar-pane-date">{{`${month.year}年${month.month_str}月`}}</div>
                    <div class="sn-calendar-pane-month">
                        <div class="month-row" v-for="(row, k1) in month.days">
                            <div class="day" v-for="(item, k2) in row">
                                <div class="day-pack"
                                     :class="{'last-month':item.isLastMonth, 'next-month': item.isNextMonth}"
                                     @click="select(k1, k2, item)">
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
                </swiper-item>
            </swiper>
            <div
                    class="date-select"
                    v-show="showMonthSelect"
                    :style="{height: height}"
            >
                <picker :data="yearAndMonthList" v-model="selectedDate" @on-change="onYearAndMonthChange"></picker>
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
        SwiperItem,
        dateFormat
    } from "vux";
    import {getDays, zeroComplete, getPrevTime, getNextTime} from './util';
    import {showToast} from 'sslib/common/extend.js';

    export default {
        name: "rangePickerView",
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
                beginDate: '',
                endDate: '',
                beginDateSelect: true,
                endDateSelect: false,
                selectedDate: [],
                selectedDay: '',
                weekList: ["日", "一", "二", "三", "四", "五", "六"],
                yearAndMonthList: [],
                showCalender: true,
                showMonthSelect: false,
                year: 0,
                month: 0,
                currentValue: '',
                currentDate: '',
                swiperList: [],
                swiperItemIndex: 0
            };
        },
        props: {
            value: {
                type: Array
            },
            monthSwiperMode: {default: "vertical"}, //月份滑动的方式，左右还是上下滑动
        },

        created() {
            /* 动态计算swiper高度 */
            this.getHeight();

            this.currentValue = this.value || [dateFormat(new Date(), 'YYYY/MM/DD'), dateFormat(new Date(), 'YYYY/MM/DD')];

            if (this.currentValue instanceof Array) {
                if (this.currentValue.length === 1) {
                    let beginDate = this.currentValue[0];
                    if (isNaN(beginDate) && !isNaN(Date.parse(beginDate))) {
                        beginDate = dateFormat(beginDate, 'YYYY/MM/DD');
                    } else {
                        beginDate = dateFormat(new Date(), 'YYYY/MM/DD');
                    }

                    this.beginDate = beginDate;
                    this.endDate = beginDate;
                    this.selectedDay = beginDate;
                } else if (this.currentValue.length === 2) {
                    let beginDate = this.currentValue[0];
                    let endDate = this.currentValue[1];
                    if (beginDate && isNaN(beginDate) && !isNaN(Date.parse(beginDate))) {
                        beginDate = dateFormat(beginDate, 'YYYY/MM/DD');
                    } else {
                        beginDate = dateFormat(new Date(), 'YYYY/MM/DD');
                    }
                    if (endDate && isNaN(endDate) && !isNaN(Date.parse(endDate))) {
                        endDate = dateFormat(endDate, 'YYYY/MM/DD');
                    } else {
                        endDate = dateFormat(new Date(), 'YYYY/MM/DD');
                    }

                    this.beginDate = beginDate;
                    this.endDate = endDate;
                    this.selectedDay = this.beginDate;
                }
            }
            const date = new Date(this.beginDate);
            const year = date.getFullYear(), month = date.getMonth();
            this.render(year, month);
            this.renderYearAndMonth(year, month);
        },
        mounted() {
        },
        methods: {
            getHeight() {
                const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                this.height = windowWidth < 480 ? `${windowWidth * 1.065}px` : '360px';
            },
            render(year, month, force = false) {
                this.year = year;
                this.month = month;

                /* 注入滑动数组 */
                this.renderSwiper(year, month, this.selectedDay);
            },
            /* 渲染单页两个月数据 */
            renderSwiper(year, month, value) {
                let preSwiper, curSwiper, nextSwiper;
                /* 生成总共需要的3个月数据 */
                const prevTime = getPrevTime(year, month);
                const nextTime = getNextTime(year, month);
                const prevMonth = getDays({...prevTime, value, returnSixRows: true});
                const curMonth = getDays({year, month, value, returnSixRows: true});
                const nextMonth = getDays({...nextTime, value, returnSixRows: true});

                /* 填充第一页两个月数据 */
                curSwiper = curMonth;
                /* 填充下一页两个月数据 */
                nextSwiper = nextMonth;
                /* 填充上一页两个月数据 */
                preSwiper = prevMonth;
                this.swiperList = [];
                this.swiperList = [curSwiper, nextSwiper, preSwiper];
                this.swiperItemIndex = 0;
            },
            /* 根据指定日期生成上下20年年月数据 */
            renderYearAndMonth(year, month) {
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

                this.yearAndMonthList = [yearList, monthList];
                this.selectedDate = [`${year}`, `${zeroComplete(month + 1)}`];
            },
            prev() {
                if (this.month === 0) {
                    this.month = 11
                    this.year = this.year - 1
                } else {
                    this.month = this.month - 1
                }
                this.render(this.year, this.month);
            },
            next() {
                if (this.month === 11) {
                    this.month = 0
                    this.year = this.year + 1
                } else {
                    this.month = this.month + 1
                }
                this.render(this.year, this.month);
            },
            go(year, month) {
                this.render(year, month, true)
            },
            /* 选择日期 */
            select(k1, k2, data) {
                let _currentValue = data.formatedDate;
                const index = this.swiperItemIndex;
                const month = this.swiperList[index];
                const days = month.days;
                for (let row = 0; row < days.length; row++) {
                    for (let day = 0; day < days[row].length; day++) {
                        if (row === k1 && day === k2) {
                            days[k1][k2].isCurrent = true;
                        } else {
                            days[row][day].isCurrent = false;
                        }
                    }
                }

                this.selectedDay = data.formatedDate;
                /* 如果当前选择的为上一月日期或者是下一月日期，重绘日历 */
                if (data.isLastMonth || data.isNextMonth) {
                    const date = new Date(data.formatedDate);
                    this.render(date.getFullYear(), date.getMonth());
                }
            },
            /* 设置选中的天 */
            setSelectedDay() {
                let currentDate = new Date(this.selectedDay);
                const day = currentDate.getDate();
                /* 当前月最大日期 */
                const selectedMonthMaxDate = new Date(this.year, this.month + 1, 0).getDate();
                const selectedDay = dateFormat(new Date(this.year, this.month, day < selectedMonthMaxDate ? day : selectedMonthMaxDate), 'YYYY/MM/DD');
                this.selectedDay = selectedDay;
                this.currentDate = selectedDay;

                for (let t = 0; t < this.swiperList.length; t++) {
                    const month = this.swiperList[t];
                    const days = month.days;
                    for (let row = 0; row < days.length; row++) {
                        for (let day = 0; day < days[row].length; day++) {
                            if (days[row][day].formatedDate === selectedDay) {
                                this.swiperList[t].days[row][day].isCurrent = true;
                            } else {
                                this.swiperList[t].days[row][day].isCurrent = false;
                            }
                        }
                    }
                }
            },
            /* 确认日期 */
            submit() {
                const {beginDate, endDate} = this;
                if (!beginDate || beginDate === '') {
                    showToast('请选择起始日期', 'middle');
                    return;
                }
                if (!endDate || endDate === '') {
                    showToast('请选择结束日期', 'middle');
                    return;
                }
                if (new Date(beginDate).getTime() > new Date(endDate).getTime()) {
                    showToast('起始日期不能大于结束日期', 'middle');
                    return;
                }
                this.currentValue = [beginDate, endDate];

                this.$emit('on-change', this.currentValue);
            },
            /* 日历onChange回调 */
            onCalendarChange(currentIndex) {
                console.log('currentIndex == ', currentIndex);
                const _year = this.year,
                    _month = this.month,
                    _swiperItemIndex = this.swiperItemIndex,
                    _currentValue = this.selectedDay;

                if (_swiperItemIndex !== currentIndex) {
                    this.year = this.swiperList[currentIndex].year;
                    this.month = this.swiperList[currentIndex].month;
                    this.selectedDate = [`${this.year}`, `${zeroComplete(this.month + 1)}`];
                    const prevTime = getPrevTime(_year, _month);
                    const prev2Time = getPrevTime(prevTime.year, prevTime.month);
                    const nextTime = getNextTime(_year, _month);
                    const next2Time = getNextTime(nextTime.year, nextTime.month);

                    const prev2Month = getDays({...prev2Time, value: _currentValue, returnSixRows: true});
                    const next2Month = getDays({...next2Time, value: _currentValue, returnSixRows: true});

                    /* 滑动结束后执行选中滑动前选中的天 */
                    this.setSelectedDay();

                    /* 当前页为第一页 */
                    if (_swiperItemIndex === 0) {
                        /* 下滑，进入第二页; 开始顺序 => [cur, next, prev], 结束顺序 => [cur, next, next2] */
                        if (currentIndex === 1) {
                            this.$set(this.swiperList, 2, next2Month);
                        } else {
                            /* 上滑，进入第三页; 开始顺序 => [cur, next, prev], 结束顺序 => [cur, prev2, prev] */
                            this.$set(this.swiperList, 1, prev2Month);
                        }
                    }
                    /* 当前页为第二页 */
                    else if (_swiperItemIndex === 1) {
                        /* 下滑，进入第三页; 开始顺序 => [prev, cur, next], 结束顺序 => [next2, cur, next] */
                        if (currentIndex === 2) {
                            this.$set(this.swiperList, 0, next2Month);
                        } else {
                            /* 上滑，进入第一页; 开始顺序 => [prev, cur, next], 结束顺序 => [prev, cur, prev2] */
                            this.$set(this.swiperList, 2, prev2Month);
                        }
                    }
                    /* 当前页为第三页 */
                    else if (_swiperItemIndex === 2) {
                        /* 下滑，进入第一页; 开始顺序 => [next, prev, cur], 结束顺序 => [next, next2, cur] */
                        if (currentIndex === 0) {
                            this.$set(this.swiperList, 1, next2Month);
                        } else {
                            /* 上滑，进入第二页; 开始顺序 => [next, prev, cur], 结束顺序 => [prev2, prev, cur] */
                            this.$set(this.swiperList, 0, prev2Month);
                        }
                    }
                }
            },
            /* 年月onChange回调 */
            onYearAndMonthChange(value) {
                console.log('onYearAndMonthChange = ', value);
                this.selectedDate = value;
                if (value && value instanceof Array) {
                    const year = parseInt(value[0]);
                    const month = parseInt(value[1]);
                    const selectedMonthMaxDate = new Date(year, month, 0).getDate();
                    if (this.beginDateSelect) {
                        const day = new Date(this.beginDate).getDate();
                        this.beginDate = dateFormat(new Date(year, month - 1, day < selectedMonthMaxDate ? day : selectedMonthMaxDate), 'YYYY/MM/DD');
                    } else if (this.endDateSelect) {
                        const day = new Date(this.endDate).getDate();
                        this.endDate = dateFormat(new Date(year, month - 1, day < selectedMonthMaxDate ? day : selectedMonthMaxDate), 'YYYY/MM/DD');
                    }
                    // this.selectedDay = selectedDay;
                }
            },
            /* 切换视图 */
            switchView(type) {
                let _date;
                if (type === "begin") {
                    _date = this.beginDate;
                    this.endDateSelect = false;

                    if (this.beginDateSelect) {
                        if (this.showCalender) {
                            this.showCalender = false;
                            this.showMonthSelect = true;
                        } else {
                            this.showCalender = true;
                            this.showMonthSelect = false;
                        }
                    } else {
                        this.beginDateSelect = true;
                        this.showCalender = true;
                        this.showMonthSelect = false;
                    }
                } else if (type === "end") {
                    _date = this.endDate;
                    this.beginDateSelect = false;

                    if (this.endDateSelect) {
                        if (this.showCalender) {
                            this.showCalender = false;
                            this.showMonthSelect = true;
                        } else {
                            this.showCalender = true;
                            this.showMonthSelect = false;
                        }
                    } else {
                        this.endDateSelect = true;
                        this.showCalender = true;
                        this.showMonthSelect = false;
                    }
                }

                const date = _date ? new Date(_date) : new Date();
                this.selectedDay = _date;
                this.selectedDate = [`${date.getFullYear()}`, `${zeroComplete(date.getMonth() + 1)}`];
                this.render(date.getFullYear(), date.getMonth());
            },
            valueFormat(value) {
                return dateFormat(value, 'YYYY年MM月DD日');
            },
        },
        watch: {
            value(val) {
                this.currentValue = val;
            },
            selectedDay(val, oldVal) {
                const {beginDateSelect, endDateSelect} = this;
                if (beginDateSelect) {
                    this.beginDate = val;
                } else if (endDateSelect) {
                    this.endDate = val;
                }
            }
        }
    };
</script>
<style lang="less">
    @import "./index.less";
</style>