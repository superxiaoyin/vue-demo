<template>
    <div class="sn-datetime-picker" @click="onClick">
        <span class="sn-datetime-picker-placeholder" v-if="shouldShowPlaceholder">{{placeholder}}</span>
        <span class="sn-datetime-picker-value" v-if="!shouldShowPlaceholder">{{valueFormat(value)}}</span>
        <div v-transfer-dom>
            <popup v-model="show" @on-show="onPopupShow" @on-hide="onPopupHide">
                <DateTimePickerView v-if="forceUpdate" v-model="currentValue" :mode="mode" @on-change="onCalendarValueChange"/>
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
    import DateTimePickerView from './dateTimePickerView';

    export default {
        name: "dateTimePicker",
        directives: {
            TransferDom
        },
        components: {
            Popup,
            DateTimePickerView,
            TransferDom
        },
        data() {
            return {
                show: false,
                forceUpdate: false,
                currentValue: ''
            };
        },
        props: {
            value: {
                type: [String, Array],
                default: ''
            },
            placeholder: String,
            readonly: Boolean,
            mode: {
                type: String,
                default: 'date'
            },
            displayFormat: {
                type: String,
                default: 'YYYY/MM/DD'
            }
        },

        created() {
            this.currentValue = this.value;
        },
        mounted() {
        },
        methods: {
            valueFormat(value) {
                const mode = this.mode;
                if(mode === 'date'){
                    return dateFormat(new Date(value), this.displayFormat);
                }else if(mode === 'datetime') {
                    if(this.displayFormat.indexOf('HH:mm') > 0) {
                        return dateFormat(new Date(value), this.displayFormat);
                    }else {
                        return dateFormat(new Date(value), this.displayFormat + ' HH:mm');
                    }
                }else {
                    return value;
                }
            },
            onPopupShow() {
                document.body.style.overflow = 'hidden';
                this.$emit('on-show');
            },
            onPopupHide() {
                document.body.style.overflow = '';
                this.$emit('on-hide');
                this.currentValue = this.value;
                setTimeout(() => {
                    this.forceUpdate = false;
                }, 150);
            },
            onClick() {
                if (!this.readonly) {
                    this.show = true;
                    this.forceUpdate = true;
                }
            },
            onCalendarValueChange(val) {
                console.log('onCalendarValueChange == ', val);
                if(!this.$listeners['on-change']) {
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

    @media screen and (min-width: @screen-lg-min) {
        div.vux-popup-dialog {
            left: calc(~'(100vw - 1080px) / 2') !important;
        }
    }
</style>