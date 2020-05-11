<template>
	<div>
		<cell :title='title' value-align='left'>
	    	<input ref="input" 
	    		:value = "value"
		    	:relationFiledIds="relationFiledIds" 
		    	:maxlength='maxlength'
		    	:placeholder="placeholder"
		    	:readonly="readonly"
		    	v-on:input="inputFrtValue($event.target.value)"
		    	v-on:focus="focusFrtValue($event.target.value)" 
		    	v-on:blur="blurFrtValue($event.target.value)" />
	    </cell>
	</div>
</template>
<script>
	import './SnPadInput.less';
	import {getClass} from '../../../lib/common/base.js';	
	import {prefixInteger} from '../../../lib/common/extend.js';
	import {Cell,ToastPlugin} from 'vux';
	Vue.use(ToastPlugin);
    export default {
    	components:{
            Cell
    	},
        props: {
            title:{
            	type:String,
            	default:''
            },
            value:{
            	type:Number
            },
            relationFiledIds:{
            	type:String
            },
            placeholder:{
            	type:String
            },
            maxlength:{
            	type:Number
            },
            readonly:{
            	type:Boolean,
            	default:false
            }
        },
        data:function(){
        	return {
        		value:'',
        		relationFiledIds:''
        	}
        },
        created:function () {
        },
        methods: {
			/**
			 * input输入时对数据进行格式化
			 * @param {Object} value
			 */
			inputFrtValue:function(value){
				if(this.readonly) return;
				//不能超过maxlength位数
				var result = (value+'').replace(/[^\d]/g,"");
				if(value.length>this.maxlength){
					result = value.slice(0,this.maxlength);
				}
				this.$refs.input.value = result;
			},
			/**
			 * 获取焦点时对数据进行格式化
			 */
			focusFrtValue:function(value){
				if(this.readonly) return;
				this.$refs.input.value = value.replace(/\b(0+)/gi,"");
			},
			/**
			 * 失去焦点时对数据进行格式化
			 */
			blurFrtValue:function(value){
				if(this.readonly) return;
				var _this = this;
				_this.returnValue = prefixInteger(value,_this.maxlength);
				this.$refs.input.value = _this.returnValue;
				_this.$emit('input', _this.returnValue);
			}
        }
    }
</script>