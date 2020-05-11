<!--二级明细控件  后续需要删除-->
<template>
	<div class="detailBox">
		<div class="button_box" v-if="inDetailList.length>0">
			<div v-for='(item,idx) in inDetailValue'>				
				<div class="comp subdetail">
					<div class="tit">
						<em class="button-icon"></em>
						<label>{{title+(idx+1)}}</label>
						<em class="del-button-icon-detail" @click.stop="delDetail(idx)" v-if='inDetailValue.length>1'></em>
					</div>
				</div>
				<div class="inDetailWrap">
					<div v-for="(field,index) in inDetailList" class="detailLine">
						<div v-if="field.dataType =='date'"><!--日期-->
		                    <SnDatetime :title="field.fieldname" :ref="field.fieldKey" v-model="inDetailValue[idx][field.fieldKey]" 
		                        	:formatDate='field.formatDate'  :intervalhours='field.intervalhours'
		                        	:isInDetailFlag='false'
		                        	:ssDiaryFlag=ssDiaryFlag :idx='idx'
		                        	:daterange='field.daterange'  :relationFiledIds='field.relationFiledIds'
		                        	funName="showClick"></SnDatetime>
		                </div>
		                <div v-else-if="field.dataType =='contacts'"><!--通讯录-->
		                    <SnContacts :title="field.fieldname" :chooseType='0' :delFlag='false' 
		                    	v-model='inDetailValue[idx][field.fieldKey]'  :salaryRelationFlag='true' 
		                    	:isInDetailFlag='true'
		                    	:relationFields='field.relationFiledIds' :idx='idx'  :placeholder='field.placeholder'></SnContacts>
		                </div>
		                <div v-else-if="field.dataType =='money'"><!--金额-->
		                    <SnMoney :title="field.fieldname" :ref="field.fieldKey" :noMoney='field.noMoney' 
		                        	v-model='inDetailValue[idx][field.fieldKey]' :placeholder="field.placeholder" 
		                        	:isInDetailFlag='true'
		                        	:idx='idx'
		                        	:fieldKey = 'field.fieldKey'
		                        	:ssDiaryFlag=ssDiaryFlag
		                        	:cpyPayShowFlag='field.cpyPayShowFlag'
		                        	:cpyPayFlag='inDetailValue[idx][field.fieldKey+"_payByCompanyFlag"]==1?true:false'
		                        	:relationFiledIds="field.relationFiledIds" :summationFlag='field.summationFlag' :totalFlag='field.totalFlag' ></SnMoney>
		                </div>
		                <div v-else-if="field.dataType=='number'"><!--数值 需要给出校验-->
		                        <SnNumber :title="field.fieldname" :ref="field.fieldKey"  v-model='inDetailValue[idx][field.fieldKey]' 
		                        	:isInDetailFlag='true'
		                        	:unit="field.unit" :pointlength='field.pointlength'
		                        	:placeholder="field.placeholder" :relationFiledIds="field.relationFiledIds" 
		                        	:idx='idx' :disabledFlag='null' :maxlength='field.maxlength||30'></SnNumber>
		                </div>
		                <div v-else-if="field.dataType=='usedDiv'"><!--常用-->
                        <SnUsedDiv :title="field.fieldname" :ref="field.fieldKey" 
                        	:subTitle="subTitle" 
                        	:isInDetailFlag='true'
	                        :idx='idx'
                         	:maxlength="field.maxlength"
                         	:fieldKey="field.fieldKey" 
                        	v-model='inDetailValue[idx][field.fieldKey]'
                        	:templetType="templetType" 
                        	:placeholder="field.placeholder" 
                        	:displayKeys="field.displayKeys" 
                        	:usedSaveFlag="usedSaveFlag" 
                        	:selectUsedFlag='selectUsedFlag' 
                        	:selectFlag="selectFlag"></SnUsedDiv>
                    	</div>
	                    <div v-else-if="field.dataType=='text'"><!--内容-->
	                        <SnText :title="field.fieldname" 
                         	:class="field.frt.class"
                         	:maxlength="field.maxlength"
                        	:ref='field.fieldKey'
                        	:isInDetailFlag='true'
	                        :idx='idx'
                        	:fieldKey='field.fieldKey'
                        	v-bind:readonly="field.frt.readonly?field.frt.readonly:false"
                        	:placeholder="field.placeholder" v-model='inDetailValue[idx][field.fieldKey]'
                        	:relationFiledIds="field.relationFiledIds" ></SnText>
	                    </div>
					</div>					
				</div>
			</div>			
			<div class="wrap">
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
            subTitle:{
            	type: Array,
		        default () {
		            return []
		        }
            },
            inDetailList:{
            	type:Array,
            	default:[]
            },
            relationFiledIds:{//主要针对总计
            	type:String,
            	default:''
            },
            conType:{
            	type:String,
            	default:''
            },
            addDesc:{
            	type:String,
            	default:'+增加项目'
            }, 
            placeholder:{
            	type:String
            },
            value:{
            	type:Array,
            	default:[{}]
            },
            selectFlag:{
            	type:Object
            },
            templetType:{
		    	type:String,
                default: "9"
		    },
		    maxSize:{
		    	type:Number,
		    	default:9
		    },
		    ssDiaryFlag:{//二级明细标识
		    	type:Boolean,
		    	default:false
		    },
		    travelStartDate:{//开始时间
            	type:String
            },
            travelEndDate:{//结束时间
            	type:String
            },
            travelDays:{//出差天数
            	type:Number
            },
            usedSaveFlag:{//是否保存常用 默认为否
            	type:Boolean,
            	default:false
            },
            selectUsedFlag:{
		    	type:Object,
		    	default:{'show':false}
		    },
        },
        data:function(){
        	return {
        		newaddDesc:'+增加明细',
        		inDetailValue:[{}],//默认值为0
        		openInDetailValue:[{}],//默认值为0
        		delInDetailFlag:false,//明细删除标识
        		usedFlag:{index:-1},
        		displayFlag:{show:false},//显示标识 默认为false 行内   增加/删除 需要控制    方案有问题 不能全局控制
        	}
        },
        created:function () { 
        	var _this = this;
        	_this.$emit('input', _this.inDetailValue);
        	var start = false;
        	
        	//差旅模板将明细中的时间值和出差天数传给二级明细中的时间
        	_this.inDetailList.forEach(function(item,index){
        		if(item.dataType == 'date'){
        			var fieldKey = item.fieldKey;
        			if(!start){
        				_this.inDetailValue[0][fieldKey] = _this.travelStartDate;
        				start = true;
        			}else{
        				_this.inDetailValue[0][fieldKey] = _this.travelEndDate;
        				start = false;
        			}
        		}
        		if (item.fieldKey == 'HEinputDiv7') {
        			_this.inDetailValue[0][item.fieldKey] = _this.travelDays * 10;
        		}
        		if (item.fieldKey == 'TAinputDiv7') {
        			_this.inDetailValue[0][item.fieldKey] = _this.travelDays; 
        		}
        	});
        },
        mounted:function(){
        	var _this = this;
        	if(this.value.length>0){
        		this.inDetailValue = this.value;
        		this.$emit('input', this.inDetailValue);//传递给父组件 
        	}	
			$(document).on("click",".subdetail",function(){
		  		$(this).find(".button-icon").toggleClass("up");
		  		$(this).next(".inDetailWrap").stop().slideToggle();
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
				this.inDetailValue.push({});
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

        		//需要重新计算总计
        		_this.calSummation(index,size,true);
			},
			/**
			 * 计算总计
			 * @param {Object} index
			 * @param {Object} size
			 * @param {Object} delFlag  删除标识
			 */
			calSummation:function(index,size,delFlag){
				var length = this.$children.length;
				for(var i=0;i<length;i++){
					if(this.$children[i].relationFiledIds==this.relationFiledIds){
						this.$children[i].summation(index,size,delFlag);//调用累加方法
						break;
					}
				}
			}
        },
        watch:{
        	'usedFlag.index':function(){
        		this.inDetailValue.push({});
        		this.inDetailValue.splice(this.inDetailValue.length-1,1);
        	}
        }
    }
</script>