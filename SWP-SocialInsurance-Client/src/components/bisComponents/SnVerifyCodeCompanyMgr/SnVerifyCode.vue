<template>
	<div class="snVerifyCode">
		<cell :title='title' value-align='left'>
	    	<input ref="input" 
	    		:value = "value"
		    	:placeholder="placeholder" 
		    	:readonly="readonly"
		    	:class="{colorGray:readonly}"
		    	v-on:input="inputFrtValue($event.target.value)" />
                <x-button :text="submit" :class="{fail:!canGetVerifyCode}" type="primary" @click.native="processButton"></x-button>
	    </cell>

	</div>
</template>
<script>
	import './SnVerifyCode.less';
	import {getClass,cryptPost} from '../../../lib/common/base.js';
	import {prefixInteger,moneyStringFixTwo,stringFixTwoWithType,showToast} from '../../../lib/common/extend.js';
	import {Cell} from 'vux';
    import { XButton } from 'vux'
    export default {
    	components:{
            Cell,
            XButton,
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
            	default:6//不超过13位
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
            },
            readonly:{
            	type:Boolean,
            	default:false
            },            
        },
        data:function(){
        	return {
                submit: '获取验证码',
                canGetVerifyCode:true,//能否获取验证码
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
				var result = (value+'').replace(/([^0-9-])/g,"");
				if(value.length>this.maxlength){
					result = value.slice(0,this.maxlength);
				}
				this.$refs.input.value = result;
				this.$emit('input',result);
			},

            processButton:function(){
                this.$emit('listenToChildEvent','true');      
            },

            /**
             * 发送验证码
             */
            sendVerifyCode:function(isSendVerifyCode){
                var _this = this;               
                if(!_this.canGetVerifyCode){
                    return;
                }
                if(isSendVerifyCode){
                    showToast('验证码已发送', 'middle');
                    _this.$emit('getending', 'true');
                    _this.getRetCode(60);
                    _this.canGetVerifyCode = false; 
                }       
            },

            /**
             * 60秒倒计时
             */
            getRetCode:function(count){
                var _this = this;               
                if(count>0){
                    count--;
                    _this.submit = count+'s';                   
                    setTimeout(function(){
                        _this.getRetCode(count);
                    },1000)
                } else{
                    _this.canGetVerifyCode = true;
                    _this.submit = '再次发送';
                }
            },

        },
    }
</script>