<template>
    <div>
        <group title="日期选择">
            <Cell title="日期选择" @click.native="onClick">
                <DateTimePicker ref="Demo1" mode="date" v-model="demo1" placeholder="请选择" @on-show="log('show')"
                                @on-hide="log('hide')"/>
            </Cell>
            <Cell title="placeholder">
                <DateTimePicker slot mode="date" v-model="demo1_2" placeholder="自定义placeholder" @on-show="log('show')"
                                @on-hide="log('hide')"/>
            </Cell>
            <Cell title="设置默认值">
                <DateTimePicker slot mode="date" v-model="demo1_3" @on-show="log('show')" @on-hide="log('hide')"/>
            </Cell>
        </group>
        <group title="自定义format">
            <Cell title="MM月DD号">
                <DateTimePicker slot mode="date" v-model="demo2" placeholder="自定义format" displayFormat="MM月DD号"
                                @on-show="log('show')" @on-hide="log('hide')"/>
            </Cell>
            <Cell title="YYYY-MM-DD">
                <DateTimePicker slot mode="date" v-model="demo2_2" placeholder="自定义format" displayFormat="YYYY-MM-DD"
                                @on-show="log('show')" @on-hide="log('hide')"/>
            </Cell>
        </group>
        <group title="时间选择">
            <Cell title="时间选择">
                <DateTimePicker mode="datetime" v-model="demo3" placeholder="请选择" @on-show="log('show')"
                                @on-hide="log('hide')"/>
            </Cell>
            <Cell title="设置默认format值">
                <DateTimePicker mode="datetime" v-model="demo3_2" placeholder="请选择" displayFormat="YYYY/MM/DD EE HH:mm"
                                @on-show="log('show')" @on-hide="log('hide')"/>
            </Cell>
        </group>
        <group title="年/月/时分选择">
            <Cell title="年月选择">
                <DateTimePicker mode="year-month" v-model="demo4" placeholder="请选择"/>
            </Cell>
            <Cell title="年选择">
                <DateTimePicker mode="year" v-model="demo4_2" placeholder="请选择" @on-show="log('show')"
                                @on-hide="log('hide')" @on-change="onChange_demo4_2"/>
            </Cell>
            <Cell title="月选择">
                <DateTimePicker mode="month" v-model="demo4_3" placeholder="请选择" @on-show="log('show')"
                                @on-hide="log('hide')"/>
            </Cell>
            <Cell title="时分选择">
                <DateTimePicker mode="time" v-model="demo4_4" placeholder="请选择"/>
            </Cell>
        </group>
        <group title="时间选择视图">
            <DateTimePickerView></DateTimePickerView>
        </group>
    </div>
</template>

<script>
    import {Group, Cell} from "vux";
    import {SnCalendar, SnButton} from "components";

    const {DateTimePicker, DateTimePickerView} = SnCalendar;
    export default {
        components: {
            Group,
            Cell,
            DateTimePicker,
            DateTimePickerView,
            SnButton
        },
        data() {
            return {
                isShow: true,
                demo1: '',
                demo1_2: '',
                demo1_3: '2016-03-20',
                demo2: '2019-03-24',
                demo2_2: '2019-03-24',
                demo3: '',
                demo3_2: '2019-03-24 15:30',
                demo4: '2018-03',
                demo4_2: '2018',
                demo4_3: '03',
                demo4_4: '15:30',
            };
        },
        computed: {},
        beforeCreate: function () {
        },
        created() {
            setTimeout(() => {
                this.isShow = false;
            }, 500);
        },
        mounted() {
        },
        methods: {
            log(str) {
                // console.log(str)
            },
            onClick() {
                console.log('onClick == ');
                this.$refs.Demo1.onClick();
            },
            onChange(value) {
                console.log('onChange == ', value);
            },
            onChange_demo4_2(value) {
                console.log('onChange_demo4_2 == ', value);
                this.demo4_2 = value;
            }
        }
    };
</script>