<template>
    <div>

    <group label-width="5em">

        <cell title="收款户名" :value="payeeName" value-align="left" ></cell>

        <!--<cell title="收款账号" value-align="left" >
            <input type="tel" v-model="payeeaccount" value="" @input="submit" maxlength="32" placeholder="请输入收款账号(必填)"/>
        </cell>-->

        <!--<cell title="付方账号" :value="paymentaccount" value-align="left" is-link></cell>-->
        <!--<cell title="业务类型" value="支票" value-align="left" is-link></cell>-->
        <popup-picker title="业务类型" height="200px"  @on-change="submit" :fixed-columns="1" :data="billTypeList" show-clear="true" v-model="billtype" value-text-align="left"></popup-picker>

        <cell title="凭证号码" value="输入" value-align="left" >
            <input type="tel" ref="transactionSN"  v-model="transactionSN" @input="submit" maxlength="8" @blur="prefixSn" placeholder="请输入凭证号码(必填)" />
        </cell>

        <!--<cell title="签发日期" :value="paymentaccount" value-align="left" is-link></cell>-->
        <datetime title="签发日期" @on-change="submit" :start-date="startDate" v-model="date" value-text-align="left"></datetime>


    </group>

    </div>
</template>

<script>
	import {pad} from '../../lib/common/extend.js';
    import {Group, Cell, Datetime, PopupPicker, dateFormat} from 'vux';
    export default {
        components: {
            Group,
            Cell,
            PopupPicker,
            Datetime
        },
        props: ['payeeNameFrom'],
        data () {
         return {
             payeeName:'',
             billtype:['支票'],
             billTypeList:[['支票','银行汇票','银行本票','汇兑凭证']],
             //transactionSN:'',
             date:'',
             startDate:''
         }
        },
        beforeCreate (){


        },
        created () {
            var today = dateFormat(new Date(), 'YYYY-MM-DD');
            this.date = today;
            this.startDate = today;
            this.submit();//初始化传值父组件
        },
        watch:{
            payeeNameFrom(curVal,oldVal){ // 父组件传入payeeName时，赋值给payeeName
                var vm =this;
                vm.payeeName = curVal;
                vm.submit();
            }
        },
        methods: {
            submit(){

                var vm = this;
                var billTypeListSelect = [{key:1,value:'支票'},{key:2,value:'银行汇票'},{key:3,value:'银行本票'},{key:4,value:'汇兑凭证'}];
                var billtypetId = 1; // 传给服务器的billtype值
                var billtypetStr = '支票';
                billTypeListSelect.forEach(function (item,index) {
                    if( vm.billtype[0] == item.value ){
                        billtypetId = item.key;
                        billtypetStr = item.value;
                    }
                });
                var msg = {
                    'payeeName'    : {'value':vm.payeeName,'title':'收款户名','validate':'notEmpty'},
                    'billtype'     : {'value':billtypetId + 0x30,'title':'业务类型','validate':'notEmpty'},
                    'billtypeStr'     : {'value':billtypetStr ,'title':'业务类型','validate':'notEmpty'},
                    'transactionSN': {'value': pad(vm.$refs.transactionSN.value,8),'title':'凭证号码','validate':'notEmpty'},
                    'date'         : {'value':vm.date.replace(/-/g,''),'title':'签发日期','validate':''},
                    'dateStr'         : {'value':vm.date,'title':'签发日期','validate':''}
                };
                this.$emit('submiBtn',msg);
            },
            prefixSn(){
            	var _this = this;
            	var tranSN = _this.$refs.transactionSN.value;
            	_this.$refs.transactionSN.value = _this.PrefixInteger(tranSN,8);
            },
            PrefixInteger(num, n) {
            return (Array(n).join(0) + num).slice(-n);
            }
        }
    }
</script>

