<template>
	<div class="SnTaxesTrans">
		<group>
			<cell title="申请人" value-align="left" >{{taxesContent.applyName || "无"}}</cell>
			<cell title="申请公司" value-align="left"> {{taxesContent.declareCpyName || "无"}} </cell>
			<cell title="税款所属期" value-align="left" :value="taxesContent.taxStartTime|dateFrt('YYYY年MM月')" ></cell>
			<cell title="纳税人编码" value-align="left"> {{taxesContent.taxPayerCode || "无"}} </cell>
			<cell title="征收机关名称" value-align="left"> {{taxesContent.payeeName || "无"}} </cell>
			<cell title="付方账号" value-align="left"> {{taxesContent.payeeAccount.replace(/\s/g,'').replace(/(.{4})/g,"$1 ") || "无"}} </cell>
			<cell title="增值税税额" value-align="left" :value="taxesContent.addedValueTax|moneyFrt(true)"></cell>
			<cell title="城建税税额" value-align="left" :value="taxesContent.urbanConstructionTax|moneyFrt(true)"></cell>
			<cell title="教育费附加税额" value-align="left" :value="taxesContent.educationSurtax|moneyFrt(true)"></cell>
			<cell title="地方教育费附加税额" value-align="left" :value="taxesContent.localEducationSurtax|moneyFrt(true)"></cell>
			<cell title="企业季报税额" value-align="left" :value="taxesContent.cpyQuarterlyTax|moneyFrt(true)"></cell>
			<cell title="企业年报税额" value-align="left" :value="taxesContent.cpyAnnualTax|moneyFrt(true)"></cell>
			<cell title="总计" value-align="left" :value="taxesContent.totalAmount|moneyFrt(true)"></cell>
			<cell title="总计大写" value-align="left"> {{taxesContent.totalAmountBig}} </cell>
		</group>
	</div>
</template>

<script>
	import {cryptPost} from '../../../lib/common/base.js';
	import {isEmptyObject,moneyUppercase,moneyStringFixTwo} from '../../../lib/common/extend.js';
	import {Cell} from 'vux';
	export default {
		components:{
            Cell,
    	},
        props: {
            declarationId:{//申报Id
            	type:Number,
            	default:0
            },
            pContent:{
            	type:Object,
            	default:{}
            }
        },
        data:function(){
        	return {
        		taxesContent:{},//电子结算需要显示的内容
        	}
        },
        beforeCreate:function(){
        	
        },
        created:function () {	
        	var _this = this;
        	if (_this.declarationId == 0) {
        		_this.taxesContent = _this.pContent; 
        	} else {
        		cryptPost('approval/queryDeclaredTaxDetail.do', {
					"declarationId":_this.declarationId
				}).then(function(result){										
					console.log(result);
					_this.taxesContent = result.declarationInfo;
					_this.taxesContent.applyName = _this.taxesContent.title.split("的")[0];
					_this.taxesContent.totalAmountBig = moneyUppercase(moneyStringFixTwo(_this.taxesContent.totalAmount).replace(/[^\d]/g,''));
					_this.$emit('input',_this.taxesContent);
					_this.$root.summary = {'税款所属期':new Date(_this.taxesContent.taxStartTime*1000).format("YYYY年MM月"), '纳税人编码':_this.taxesContent.taxPayerCode};
				});
        	}

        },
        mounted:function(){
        },
        methods: {
        },
    }
</script>
<style lang="less">
.SnTaxesTrans{
	.weui-cell:before{
		display: none;
	}
	.weui-cell__ft{
		border: none;
	}
}	
</style>