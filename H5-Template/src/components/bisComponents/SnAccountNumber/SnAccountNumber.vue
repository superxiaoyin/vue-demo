<template>
	<div>
		<!--<cell :title="field.fieldName" value-align="left">{{showFlag?field.fieldValue:'**** **** **** '+field.fieldValue.slice(-4)}}</cell>-->
		<cell :class="!!fontColor&&fontColor?'fontCol':''" :title="title" value-align="left">{{showAccount(value)}}</cell>
	</div>
</template>

<script>
	import {Cell} from 'vux';
	export default{
		components:{
			Cell
		},
		data(){
			return{
				showValue:''
			}
		},
		props:{
			title:{
				type:String
			},
			value:{
				type:String
			},
			showFlag:{
				type:Boolean
			},
			fontColor:{
				type:Boolean
			}
		},
		methods:{
			showAccount(value){
				let _this=this;
				if(!!value){
					_this.showValue=!_this.showFlag?value:'**** **** **** '+value.slice(-4);
				}else{
					_this.showValue="无";
				}
				return _this.showValue;
			}
		}
	
	}
</script>

<style lang="less" scoped>
	.fontCol{
    	color: #191919 ;
	}
</style>