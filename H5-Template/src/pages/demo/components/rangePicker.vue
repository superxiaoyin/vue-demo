<template>
    <div>
        <group title="时间区段选择">
            <Cell title="时间区间">
                <RangePicker
                        v-model="demo1"
                        @on-change="onChange"
                />
            </Cell>
        </group>
        <group title="时间区段选择视图">
            <RangePickerView/>
        </group>
    </div>
</template>

<script>
    import {Group, Cell} from "vux";
    import {SnCalendar} from "components";

    const {RangePicker, RangePickerView} = SnCalendar;
    export default {
        components: {
            Group,
            Cell,
            RangePicker,
            RangePickerView
        },
        data() {
            return {
                demo1: ['2019/04/01', '2019/04/10'],
            };
        },
        computed: {},
        beforeCreate: function () {
        },
        created() {
        },
        mounted() {
        },
        methods: {
            log(str) {
                // console.log(str)
            },
            onChange(value) {
                console.log('onChange == ', value);
                this.demo1 = value;
            }
        }
    };
</script>