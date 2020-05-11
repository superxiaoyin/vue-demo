<template>
	<div>
		<cell :title='title' value-align='left'>
	    	<input ref="input" 
	    		:value = "value"
		    	:placeholder="placeholder" 
		    	v-on:input="inputFrtValue($event.target.value)"/>
	    </cell>
	</div>
</template>
<script>
	import {getClass,cryptPost} from '../../../lib/common/base.js';
	import {prefixInteger,moneyStringFixTwo,stringFixTwoWithType} from '../../../lib/common/extend.js';
	import {Cell,ToastPlugin} from 'vux';
	Vue.use(ToastPlugin);
    export default {
    	components:{
            Cell,
    	},
        props: {
            title:{
            	type:String,
            	default:''
            },
            value:{
            	type:String
            },
            relationFiledIds:{
            	type:String
            },
            placeholder:{
            	type:String
            },
            maxlength:{
            	type:Number,
            	default:200//不超过200位
            },
            frclass:{
            	type:String,
            	default:''
            },
            fieldKey:{//接受模板中的fieldKey，主要是为了购买理财的产品代码需要查询
            	type:String
            },
            autosize:{
            	type:Boolean,
            	default:true
            },
		    isInDetailFlag:{//是否明细组件 默认为否
            	type:Boolean,
            	default:false
            },
		    idx:{ //组件的index
            	type:Number
            }
        },
        data:function(){
        	return {
        		value:'',
        	}
        },
        created:function () {
        },
        mounted:function(){//存在value,显示value  供存草稿使用
        	if(this.value){
        	}
        },
        methods: {
        	/**
			 * input输入时对数据进行格式化
			 * @param {Object} value
			 */
			inputFrtValue:function(value){
				var reg=/[\u4E00-\u9FA5]/g;
				var result = (value+'').replace(reg,"");
				if(value.length>this.maxlength){
					result = value.slice(0,this.maxlength);
				}
				this.$refs.input.value = result;
				this.$emit('input',result);
			},
        }
    }
</script>