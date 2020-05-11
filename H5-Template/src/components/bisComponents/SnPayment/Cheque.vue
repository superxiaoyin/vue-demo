<template>
    <div>
        <group label-width="5em" label-margin-right="1em">
            <cell title="支票使用人"  :value="paymentName" value-align="left"></cell>
        </group>

        <group label-width="5em" label-margin-right="1em">

            <!--<cell title="汇款类型" value-align="left" >-->

                <!--<checker v-model="remittype" default-item-class="check-item" selected-item-class="check-item-selected" class="checker">-->

                    <!--<div v-for="i in defalutremittype" class="checker-body">-->
                        <!--<checker-item  :key="i" :value="i"> </checker-item> <span style="line-height: 26px;"> {{i}} </span>-->
                    <!--</div>-->
                <!--</checker>-->

            <!--</cell>-->


        <cell title="支票类型" value-align="left" >


            <div class="checker">
                <div v-for="item in defalutChcekType" class="checker-body" >
                    <input class="magic-radio" type="radio" name="checkType" :id="'checkType'+item.key" :value="item.key" @change="checkTypeChange(item.key)" v-model="checkType">
                    <label :for="'checkType'+item.key">
                        {{item.value}}
                    </label>
                </div>
            </div>



        </cell>

        <cell title="使用类型" value-align="left" >

            <div class="checker">
                <div v-for="item in defalutUseType" class="checker-body" >
                    <input class="magic-radio" type="radio" name="useType" :id="'useType'+item.key" :value="item.key" @change="useTypeChange(item.key)" v-model="useType">
                    <label :for="'useType'+item.key">
                        {{item.value}}
                    </label>
                </div>
            </div>

        </cell>

         </group>


        <group label-width="5em" label-margin-right="1em">

            <datetime title="签发日期" @on-change="submit" :start-date="startDate" v-model="datetime" value-text-align="left"></datetime>

            <cell title="收款人名称"  value-align="left" >
                <input type="text" v-model="payeeName" value="" @input="submit" maxlength="30" placeholder="请输入收款人名称(选填)"/>
            </cell>

        </group>

        <group label-width="5em" label-margin-right="1em">
            <cell title="事由"  value-align="left" >
                <input type="text" v-model="chequeText" value="" @input="submit" maxlength="200" placeholder="请输入用卡事由(选填)"/>
            </cell>
        </group>

        </div>
</template>

<script>
    import {Group, Cell, Checker, PopupPicker,CheckerItem, Datetime, dateFormat } from 'vux';
    export default {
        components: {
            Group,
            Cell,
            Checker,
            PopupPicker,
            CheckerItem,
            Datetime
        },
        props: ['payeeNameFrom'],
        data:function () {
         return {
             paymentName:'',
             payeeName:'',
             checkType: 0,
             useType:0,
             defalutChcekType:[{key:0,value:'转账'},{key:1,value:'现金'}],
             defalutUseType:[{key:0,value:'限额'},{key:1,value:'定额'}],
             datetime:'',
             chequeText:'',
             startDate:''
         }
        },
        beforeCreate: function(){

        },
        created:function () {

            var today = dateFormat(new Date(), 'YYYY-MM-DD');
            this.datetime = today;
            this.startDate = today;
            this.submit();//初始化传值父组件

        },
        watch:{
            payeeNameFrom(curVal,oldVal){ // 父组件传入payeeName时，赋值给payeeName
                var vm =this;
                vm.paymentName = curVal;
                vm.submit();
            }
        },
        methods: {

            checkTypeChange(key){
                var vm = this;
                vm.checkType = key;
                this.submit();
            },
            useTypeChange(key){
                var vm = this;
                vm.useType = key;
                this.submit();
            },
            submit(){
            	console.log("this.datetime = " + this.datetime)
                var msg ={
                    'eleCheckType'   : {'value':this.checkType,'title':'支票类型','validate':''},
                    'eleCheckUesType': {'value':this.useType,'title':'使用类型','validate':''},
                    'eleCheckIssueDate': {'value':(new Date(this.datetime).getTime()-8*3600000)/1000,'title':'签发日期','validate':'notEmpty'},
                    'eleCheckPayee'   : {'value':this.payeeName,'title':'收款人名称','validate':''},
                    'eleCheckReason'  : {'value':this.chequeText,'title':'事由','validate':''}
                };
                this.$emit('submiBtn',msg);
            }
        }
    }
</script>

<style scoped>

    .checker{
        display: flex;
    }
    .checker-body{
        width: 2rem;
    }
    .check-item {
        width: 12px;
        height: 12px;
        line-height: 12px;
        text-align: center;
        border-radius: 3px;
        border: 1px solid #ccc;
        background-color: #fff;
        margin-right: 1px;
    }
    .check-item-selected {
        color: #fff;
        background-color: #3864A7;
        border-color: #3864A7;
    }

</style>