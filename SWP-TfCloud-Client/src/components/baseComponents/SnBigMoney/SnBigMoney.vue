<template>
    <cell :title='title' value-align='left'>{{transMoney(value)}}</cell>
</template>
<script>
    import { Cell } from 'vux';
    import { moneyUppercase, moneyStringFixTwo } from '../../../lib/common/extend.js';
    export default {
        components: {
            Cell
        },
        props: {
            value: {
                type: String,
            },
            title: {
                type: String,
                default: '金额大写'
            }
        },
        data: function () {
            return {
            }
        },
        created: function () {
        },
        methods: {
            transMoney(amount) {
                return moneyUppercase(moneyStringFixTwo(amount).replace(/[^\d]/g, ''));
            },
        }
    }
</script>