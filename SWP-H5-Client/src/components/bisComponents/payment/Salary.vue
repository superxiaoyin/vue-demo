<template>
    <div>
    <group label-width="4.5em">
        <cell title="收款账号"  :value="item.cardNum" value-align="left"></cell>
        <cell title="收款户名"  :value="item.UAName" value-align="left"></cell>
        <cell title="汇款金额"  :value="item.money|moneyFrt" value-align="left"></cell>
    </group>
    </div>
</template>

<script>
    import {Group,  Cell, XInput, Panel} from 'vux';
    import {moneyStringFixTwo} from 'sslib/common/extend.js';
    export default {
        components: {
            Group,
            Cell,
            XInput
        },
        props: {
            item:{
                type:Object
            },
        },
        data () {
         return {
         }
        },
        beforeCreate (){
        },
        created () {
        },
        methods: {
        },
        filters:{
        	moneyFrt:function(value){
        		return moneyStringFixTwo(value);
        	}
        }
    }
</script>