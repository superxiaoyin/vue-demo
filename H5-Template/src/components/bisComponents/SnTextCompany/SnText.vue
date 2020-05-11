<template>
	<SnTextarea :title='title' :value = "value"  ref='input'
				:placeholder="placeholder" 
				:maxlength='maxlength' 
				:readonly="readonly" 
				:rows = "rowsNum"></SnTextarea>
</template>
<script>
	import './SnText.less';
	import {getClass,cryptPost} from '../../../lib/common/base.js';
	import {prefixInteger,moneyStringFixTwo,stringFixTwoWithType,showToast,checkEmail,checkWebsite} from '../../../lib/common/extend.js';
	import {Cell,ToastPlugin,XTextarea} from 'vux';
	import SnTextarea from "../../baseComponents/SnTextarea/SnTextarea.vue";

	Vue.use(ToastPlugin);
    export default {
    	components:{
            Cell,
            XTextarea
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
            	type:Number
            },
            readonly:{
            	type:Boolean,
            	default:false
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
            rowsNum:{
            	type:Number,
            	default:1
            },
		    isInDetailFlag:{//是否明细组件 默认为否
            	type:Boolean,
            	default:false
            },
            isMailFlag:{//是否是邮箱 默认为否
            	type:Boolean,
            	default:false
            },
            iswebsiteFlag:{//是否是网址 默认为否
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
        		relationFiledIds:''
        	}
        },
        created:function () {
        },
        mounted:function(){//存在value,显示value  供存草稿使用
        	if(this.value){
        	}
        },
        methods: {
        	changeValue:function(){
        		var _this = this;
				var value = _this.value;
				this.$emit('input',value);
				setTimeout(()=>{
            		this.$refs.input.updateAutosize();
            	},50)
        	},
			/**
			 * 失去焦点时
			 */
			blurValue:function(value){
				var _this = this;
				var value = _this.value;
				if (_this.fieldKey == 'pCode' && !!value && value != '') {
						var pTypeMap = {
							'1':{id:1,text:'定期存款',cls:''},
							'2':{id:2,text:'活期存款',cls:''},
						};
						var riskLevelMap = {
							'1':{id:1,text:'低风险',cls:''},
							'2':{id:2,text:'较小风险',cls:''},
							'3':{id:3,text:'适中风险',cls:''},
							'4':{id:4,text:'较大风险',cls:''},
							'5':{id:5,text:'极大风险',cls:''},
						};
					cryptPost('yqt/wealth/getProdDetail.html',{'type':1,'key':value}).then(function(data){
						//number组件赋值，需要将组件的inputFlag置为false，处理单位
						_this.$root.$refs.rate[0].inputFlag = false;
						_this.$root.$refs.rate[0].$emit('input',data.rate);
						_this.$root.$refs.dueTime[0].inputFlag = false;
						_this.$root.$refs.dueTime[0].$emit('input',data.dueTime);
						
						//金额组件赋值
						_this.$root.$refs.startAmount[0].inputFlag = false;
						_this.$root.$refs.startAmount[0].$emit('input',data.startAmount);//起购金额 
						
						//文本组件赋值
						_this.$root.$refs.pName[0].$emit('input',data.pName);
						_this.$root.$refs.pShortName[0].$emit('input',data.pShortName);
						_this.$root.$refs.issuer[0].$emit('input',data.issuer);
						_this.$root.$refs.range[0].$emit('input',data.range);
						_this.$root.$refs.Recommend[0].$emit('input',data.Recommend);
						
						//单选框组件
						_this.$root.$refs.breakEven[0].checkedIndex = data.breakEven || 0;//是否保本
						_this.$root.$refs.breakEven[0].$emit('input', data.breakEven || 0);
						
						//下拉框组件
						_this.$root.$refs.riskLevel[0].selectedValue = data.riskLevel ? riskLevelMap[data.riskLevel].text : '';//风险等级
						_this.$root.$refs.riskLevel[0].$emit('input', data.riskLevel || '');//风险等级返回值
						_this.$root.$refs.pType[0].selectedValue = data.pType ? pTypeMap[data.pType].text : '';//产品类型
						_this.$root.$refs.pType[0].$emit('input', data.pType || '');//产品类型返回值
					});
				}
				//邮箱的校验
				if (this.isMailFlag) {
					if (!checkEmail(value)) {
						showToast("请输入正确的邮箱");
					}
				}
				//网址的校验
				if (this.iswebsiteFlag) {
					if (!checkWebsite(value)) {
						showToast("请输入正确的网址");
					}
				}
			},
        },
        watch:{
        	/**
        	 * 数据显示 主要针对删除使用
        	 * @param {Object} newVal
        	 * @param {Object} oldVal
        	 */
        	value:function(newVal,oldVal){
				if(this.value){
	        		this.$refs.input.value = newVal;
					this.$emit('input',newVal);
        		}else{
        			this.$refs.input.value = '';
					this.$emit('input','');
        		}
        		this.$refs.input.updateAutosize();//大写金额等赋值关联组件需主动触发自动高度xiaowe 2018-1-4
        	},
        }
    }
</script>