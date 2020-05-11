<template>
    <div class="sn-range-picker" @click="onClick">
        <span class="sn-datetime-picker-placeholder" v-if="shouldShowPlaceholder">{{placeholder}}</span>
        <span class="sn-datetime-picker-value" v-if="!shouldShowPlaceholder">{{valueFormat(value)}}</span>
        <div v-transfer-dom>
            <popup v-model="show" @on-show="onPopupShow" @on-hide="onPopupHide">
                <RangePickerView
                        v-if="forceUpdate"
                        v-model="currentValue"
                        @on-change="onCalendarValueChange"
                />
            </popup>
        </div>
    </div>
</template>
<script>
    import {
        Popup,
        TransferDom,
        dateFormat
    } from "vux";
    import RangePickerView from './rangePickerView';

    export default {
        name: "rangePicker",
        directives: {
            TransferDom
        },
        components: {
            Popup,
            RangePickerView,
            TransferDom
        },
        data() {
            return {
                show: false,
                forceUpdate: false,
                currentValue: []
            };
        },
        props: {
            value: {
                type: Array
            },
            readonly: Boolean,
            displayFormat: {
                type: String,
                default: 'YYYY/MM/DD'
            }
        },

        created() {
            this.currentValue = this.value || [dateFormat(new Date(), 'YYYY/MM/DD'), dateFormat(new Date(), 'YYYY/MM/DD')];

            if (this.currentValue instanceof Array) {
                if (this.currentValue.length === 1) {
                    let beginDate = this.currentValue[0];
                    if (isNaN(beginDate) && !isNaN(Date.parse(beginDate))) {
                        this.currentValue[0] = dateFormat(beginDate, 'YYYY/MM/DD');
                    } else {
                        this.currentValue[0] = dateFormat(new Date(), 'YYYY/MM/DD');
                    }
                } else if (this.currentValue.length === 2) {
                    let beginDate = this.currentValue[0];
                    let endDate = this.currentValue[1];
                    if (isNaN(beginDate) && !isNaN(Date.parse(beginDate))) {
                        this.currentValue[0] = dateFormat(beginDate, 'YYYY/MM/DD');
                    } else {
                        this.currentValue[0] = dateFormat(new Date(), 'YYYY/MM/DD');
                    }
                    if (isNaN(endDate) && !isNaN(Date.parse(endDate))) {
                        this.currentValue[1] = dateFormat(endDate, 'YYYY/MM/DD');
                    } else {
                        this.currentValue[1] = dateFormat(new Date(), 'YYYY/MM/DD');
                    }
                }
            }
        },
        mounted() {
        },
        methods: {
            valueFormat(value) {
                return `${dateFormat(new Date(value[0]), 'YYYY/MM/DD')} - ${dateFormat(new Date(value[1]), 'YYYY/MM/DD')}`;
            },
            onPopupShow() {
                document.body.style.overflow = 'hidden';
                this.$emit('on-show');
            },
            onPopupHide() {
                document.body.style.overflow = '';
                this.$emit('on-hide');
                this.currentValue = this.value;

            },
            onClick() {
                if (!this.readonly) {
                    this.show = true;
                    this.forceUpdate = true;
                }
            },
            onCalendarValueChange(val) {
                console.log('onCalendarValueChange == ', val);
                if (!this.$listeners['on-change']) {
                    this.$emit('input', val);
                }

                this.show = false;
                setTimeout(() => {
                    this.forceUpdate = false;
                }, 150);
                this.$emit('on-change', val);
            }
        },
        computed: {
            shouldShowPlaceholder() {
                if (typeof this.value === 'string' && !this.value) {
                    return true;
                }
                return false;
            }
        },
        watch: {
            value(newVal, oldVal) {
                this.currentValue = newVal;
            }
        }
    };
</script>
<style lang="less" scoped>
    @import "./index.less";

    div.vux-popup-dialog {
        position: fixed !important;
        left: 0 !important;
        bottom: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
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
</style>