<template>
    <div>
         <div v-if="templetType=='73' || templetType==73" style="background:white; padding:20px;">
                        <div v-for="(field,index) in childDesc">
                            <div v-if="index==0 || index == childDesc.length-1" style="margin: 0px;">
                                <label style="display: inline-block;width: 150px;">{{field.label}}</label>
                                <span >{{loanItemInfo[field.key]}}</span>
                            </div>
                            <div v-else style="margin: 5px 0px;">
                                <label style="display: inline-block;width: 150px;">{{field.label}}</label>
                                <span >{{loanItemInfo[field.key]}}</span>
                            </div>
                        </div>
            </div>
            <div v-if="templetType=='74' || templetType==74" style="background:white; padding:20px;">
                    <div v-for="(field,index) in loanChildDesc">
                        <div v-if="index==0 || index == loanChildDesc.length-1" style="margin: 0px;">
                            <label style="display: inline-block;width: 150px;">{{field.label}}</label>
                            <span >{{loanItemInfo[field.key]}}</span>
                        </div>
                        <div v-else style="margin: 5px 0px;">
                            <label style="display: inline-block;width: 150px;">{{field.label}}</label>
                            <span >{{loanItemInfo[field.key]}}</span>
                        </div>
                    </div>
            </div>
    </div>
</template>

<script>
    export default {
        props: {
            templetType: {
                type: Number,
                default: 73
            },
            loanItemInfo:{
                type:Object,
                default:{}
            }
        },
        created() {
            this.childDesc = [
                {label:'合同合约号',key:'agreeNo',type:'none',cls:'bottom'},
                {label:'单位名称',key:'cpyName',type:'none',cls:'bottom'},
                {label:'贷款业务品种',key:'loanType',type:'loanType',cls:'bottom'},
                {label:'合约总额度',key:'agreeTotalMoney',type:'money',cls:'bottom'},
                {label:'可自助额度',key:'selfMoney',type:'money',cls:'bottom'},
                {label:'已使用总额度',key:'usedMoney',type:'money',cls:'bottom'},
                {label:'已使用自助额度',key:'usedSelfMoney',type:'money',cls:'bottom'},
                {label:'额度有效期',key:'validDate',type:'date',cls:'bottom'},
                {label:'贷款最长期限',key:'longValidDate',type:'date',cls:'bottom'},
                {label:'贷款最大到期时间',key:'longValidDate',type:'date',cls:'bottom'},
            ]
            this.loanChildDesc = [
                {label:'账号',key:'account',type:'none',cls:'bottom'},
                {label:'单位名称',key:'cpyName',type:'none',cls:'bottom'},
                {label:'合同合约号',key:'agreeNo',type:'none',cls:'bottom'},
                {label:'信贷合约号',key:'loanNo',type:'none',cls:'bottom'},
                {label:'币种',key:'moneyType',type:'none',cls:'bottom'},
                {label:'贷款日期',key:'loanDate',type:'none',cls:'bottom'},
                {label:'贷款到期日',key:'loanEndDate',type:'none',cls:'bottom'},
                {label:'贷款余额',key:'loanLeftMoney',type:'money',frt:'yyyy/MM/dd',cls:'bottom'},
            ]
        },
        data() {
            return {
                loanChildDesc: [],
                childDesc: [],
            }
        },
    }
</script>

<style scoped>

</style>