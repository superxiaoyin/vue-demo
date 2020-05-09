<!--二级明细控件  后续需要删除-->
<template>
	<div class="detailBox">
		<div class="button_box" v-if="inDetailList.length>0">
			<div v-for='(item,idx) in inDetailValue'>				
				<div class="comp subdetail">
					<div class="tit">
						<em class="button-icon"></em>
						<label style='width:2.0rem'>{{title+(idx+1)}}</label>
						<em v-show='!inDetailValue[idx].deletFlag'  class="del-button-icon-detail" @click.stop="delDetail(idx)" v-if='inDetailValue.length>1'></em>
					</div>
				</div>
				<div class="inDetailWrap">
					<div v-for="(field,index) in inDetailList" class="detailLine">
						<div v-if="field.dataType=='money'"><!--金额-->
							 <SnMoney :title="field.fieldname" :ref="field.fieldKey" :noMoney='field.noMoney' 
	                        	v-model='inDetailValue[idx][field.fieldKey]' :placeholder="field.placeholder" 
	                        	:isInDetailFlag='true'
	                        	:idx='idx'
	                        	:fieldKey = 'field.fieldKey'
	                        	:readonly='readonly'
	                        	:ssDiaryFlag=ssDiaryFlag
	                        	:relationFiledIds="field.relationFiledIds"></SnMoney>
						</div>
						<div v-if="field.dataType =='date'"><!--日期-->
		                    <SnDatetime :title="field.fieldname" :ref="field.fieldKey" v-model="inDetailValue[idx][field.fieldKey]" 
		                        	:formatDate='field.formatDate'  :intervalhours='field.intervalhours'
		                        	:isInDetailFlag='false'
	                        		:readonly='readonly'
		                        	:ssDiaryFlag=ssDiaryFlag :idx='idx'
		                        	:daterange='field.daterange'  :relationFiledIds='field.relationFiledIds'
		                        	funName="showClick"></SnDatetime>
		                </div>
						<div v-else-if="field.dataType=='text'"><!--内容    displayFlag默认没有，设置为false的时候不显示-->
							<SnText :title="field.fieldname" 
	                         	:maxlength="field.maxlength"
	                        	:ref='field.fieldKey'
	                        	:isInDetailFlag='true'
		                        :idx='idx'
	                        	:fieldKey='field.fieldKey'
	                        	v-bind:readonly="field.fieldKey == 'account'?true:readonly"
	                        	:placeholder="field.placeholder" v-model='inDetailValue[idx][field.fieldKey]'
	                        	:relationFiledIds="field.relationFiledIds" ></SnText>
						</div>
						<div v-else-if="field.dataType=='radio'"><!--单选框-->
			                    <SnRadio :title="field.fieldname" :ref="field.fieldKey" 
			                    	:isInDetailFlag='true'
			                    	:idx='idx'
			                    	:fieldKey='field.fieldKey'
	                        		:readonly='readonly'
	                        		:bsreadonly='readonly'
			                    	:displayFlag = 'displayFlag'
			                    	:radioList='field.radioList' :defaultIndex='field.defaultIndex'
			                    	v-model='inDetailValue[idx][field.fieldKey]' ></SnRadio>
				        </div>
					</div>					
				</div>
			</div>			
			<div class="wrap" v-if='!readonly'>
				<div class="detailAdd" @click='addDetail()'>{{newaddDesc}}</div>
			</div>						
		</div>
	</div>
</template>
<script>
	import '../SnInDetail/SnInDetail.less';
	import {getClass} from '../../../lib/common/base.js';	
	import {prefixInteger,showToast} from '../../../lib/common/extend.js';
	import SnContacts from '../SnContacts/SnContacts.vue';
	import SnDatetime from '../SnDatetime/SnDatetime.vue';
	import SnMoney from '../SnMoney/SnMoney.vue';
	import SnNumber from '../SnNumber/SnNumber.vue';
	import SnRadio from '../SnRadio/SnRadio.vue';
	import SnPopupPicker from '../SnPopupPicker/SnPopupPicker.vue';
	import SnUsedDiv from '../SnUsedDiv/SnUsedDiv.vue';
	import SnText from '../SnText/SnText.vue';
    export default {
    	components:{
            SnDatetime,
            SnMoney,
            SnNumber,
            SnContacts,
            SnRadio,
            SnPopupPicker,
            SnUsedDiv,
			SnText,
    	},
        props: {
            title:{
            	type:String,
            	default:''
            },
            addDesc:{
            	type:String,
            	default:'+增加明细'
            }, 
		    readonly:{//外面传递进来的 readonly，控制snNomatch在不同页面需要控制只读状态
		    	type:Boolean,
		    	default:false
		    },
            value:{
            	type:Array,
            	default:[{}]
            },
		    maxSize:{
		    	type:Number,
		    	default:9
		    },
		    ssDiaryFlag:{//二级明细标识
		    	type:Boolean,
		    	default:false
		    },
		    inDetailList:{
		    	type:Array,
		    	default:[{}]
		    },
		    account:{
		    	type:Number,
		    	default:''
		    }
        },
        data:function(){
        	return {
        		newaddDesc:'+增加明细',
        		inDetailValue:[{}],//默认值为0
        		openInDetailValue:[{}],//默认值为0
        		delInDetailFlag:false,//明细删除标识
        		displayFlag:{show:false},//显示标识 默认为false 行内   增加/删除 需要控制    方案有问题 不能全局控制
        	}
        },
        created:function () { //@updateSubmitStatus="updateSubmitStatus"
        	var _this = this;
        	_this.$emit('setinDetailValue', _this.inDetailValue);
        	var start = false;
        },
        mounted:function(){
        	var _this = this;
        	if(this.value.length>0){
        		this.inDetailValue = this.value;
        		this.$emit('setinDetailValue', this.inDetailValue);//传递给父组件 
        	}	
			$(document).on("click",".subdetail",function(){
		  		$(this).find(".button-icon").toggleClass("up");
		  		$(this).next(".inDetailWrap").stop().slideToggle();
			});   	
			
			_this.inDetailList.forEach(function(item,index){
    			var fieldKey = item.fieldKey;
    			if (fieldKey == 'account') {
    				_this.inDetailValue[0][fieldKey] = _this.account;
    			}
        	});
        	
        	_this.openInDetailValue = JSON.parse(JSON.stringify(_this.inDetailValue));
        	_this.$parent.openTravel.inDetail = _this.openInDetailValue;
        },
        updated:function(){
        },
        methods: {
        	/**
        	 * 元素点击事件，删除
        	 * @param {Object} field
        	 * @param {Object} index
        	 */
        	itemClick:function(item,index){
        		var _this = this;
        		
        	},
        	/**
        	 * 增加明细
        	 * @param {Object} item   控件
        	 */
			addDetail:function(){
				if(this.maxSize<this.inDetailValue.length){
					showToast('最多只能添加'+(this.maxSize+1)+'个明细');
					return;
				}
				//返回该索引
				this.inDetailValue.push({'account':this.account});
				this.delInDetailFlag = false;
			},
			/**
			 * 删除明细
			 * @param {Object} index  控件索引
			 */
			delDetail:function(index){
				var _this = this;
				_this.delInDetailFlag = true;
				var size = _this.inDetailValue.length;
        		_this.inDetailValue.splice(index,1);//删除当前item-value
			},
        },
        watch:{
        }
    }
</script>