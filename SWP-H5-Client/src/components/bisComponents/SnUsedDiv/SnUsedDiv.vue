<template>
	<div class="snUsedDiv">
		<!-- <group> -->
        <!-- <cell :title="title" value-align="left"> -->
		<div>
        	<x-textarea :title="title" :max="maxlength" :rows = "rowsNum" :autosize ="autosize" :show-counter=false 
        		:placeholder="placeholder" ref="input" v-on:input="changeValue()" v-model="value" ></x-textarea>
        	<a class="button-detail" @click="openPopup">常用</a>
		</div>
        <!-- </cell> -->
		<!-- </group> -->
        <div v-transfer-dom>
            <popup class="full-s"  v-model="popupShowFlag" position="right" width="100%">
                <div class="sn-main-con">
                    <div v-if='hotDataList.length > 0' class="chose_title">推荐</div>
                    <div v-if='hotDataList.length > 0' >
                        <div class="chose_box">
                            <span class="chose_span" v-for="(item,index) in hotDataList" @click.prevent="choosedItem(item)" v-text="item.title"></span>
                        </div>
                    </div>
                    <div v-if='hotDataList.length > 0' class="chose_title">历史</div>
                    <div class="position-horizontal-demo popupDebit usedAccountLineWarp">
                        <!-- list里面的参数为 src-图标  title-显示数据 value-返回数据-->
                        <!--<panel :list="dataList"  type="1" @on-click-item="choosedItem" @on-img-error="onImgError"></panel>-->
                        <div v-for="(item,index) in dataList" @click.prevent="choosedItem(item)" class="usedAccountLine">
                            <span class="usedAccountTitle"  v-text="item.title"></span>
                            <span class="delAccountBut" @click.stop ="delUsed(item)"></span>
                        </div>
                    </div>
                </div>
            </popup>
        </div>
    </div>
</template>
<style lang="less" src="./SnUsedDiv.less"></style>
<script>
	import {Group,Popup, PopupHeader,Panel,Cell,XTextarea,TransferDom} from 'vux';
	import {nativeInfo} from '../../../lib/common/base.js';
	import {showToast,getStorage,initTitleMenu,setTitleOnly,isPC,getBankConfig} from '../../../lib/common/extend.js';
	import UsedManagment from '../../../lib/UsedHandler.js';
    export default {
    	directives: {
            TransferDom
        },
    	components: {
    		Group,
		    Popup, 
		    PopupHeader,
		    Panel,
		    Cell,
            XTextarea
	    },
	    data:function(){
	    	return {
	    		selectedValue:'',
	    		popupShowFlag:false,
	    		delayShow:0,//等待键盘收起再弹出下拉框
	    		hotDataList:[],
	    	}
	    },
        props: {
            title:{//title
                type:String,
                default: ""
            },
            subTitle:{
            	type: Array,
		        default () {
		            return []
		        }
            },
            dataList: {//list数据
		      type: Array,
		      default () {
		        return []
		      }
		    },
            autosize:{
            	type:Boolean,
            	default:true
            },
		    value:{
		    	type:Number
		    },
		    placeholder:{//控件提示
		    	type:String,
                default: ""
		    },
		    noTips:{//为空提示信息
		    	type:String,
                default: "暂无常用选项"
		    },
            maxlength:{
            	type:Number
            },
		    hasDefault:{//默认值，默认为没有
		    	type:Boolean,
		    	required: true,
                default: false
		    },
		    selectFlag:{
		    	type:Object,
		    	default:{'show':false}
		    },
		    cssClass:{
		    	type:String,
                default: ""
		    },
		    storageKey:{
		    	type:String,
                default: ""
		    },
		    displayKeys:{
            	type:Array
            },
		    templetType:{
		    	type:String,
                default: ""
		    },
		    isInDetailFlag:{//是否明细组件 默认为否
            	type:Boolean,
            	default:false
            },
		    idx:{ //组件的index
            	type:Number
           	},
            rowsNum:{
            	type:Number,
            	default:1
            },
            usedSaveFlag:{//是否保存常用 默认为否
            	type:Boolean,
            	default:false
            },
            selectUsedFlag:{
		    	type:Object,
		    	default:{'show':false}
		    },
		    relationFiledIds:{
            	type:Array
            },
            offlineFlag:{//线下标记 
            	type:Boolean,
            	default:false
            },
            fieldKey:{
            	type:String,
            	default:''
            },
            usedType:{
            	type:String,
            	default:''//'purpose'
            }
        },
        beforeCreate: function(){
        	
        },
        created:function () {
        	this.storageKey = 'UAId' + nativeInfo.UAId + 'cpyId' + nativeInfo.cpyId + 'storageKey';
/*        	var storageValue = getStorage('templetType'+_this.templetType+_this.storageKey);
        	if(_this.offlineFlag){
        		storageValue = getStorage('offlineTempletType'+_this.templetType+_this.storageKey);
        	}
        	if(storageValue){
        		_this.dataList = JSON.parse(storageValue);
        	}*/
        	//获取常用热点数据
        	this.getHotDataList();
        	//获取常用历史数据
/*        	var templetStr = 'templetType';
        	if(this.offlineFlag){
        		templetStr = 'offlineTempletType';
        	}
        	if (this.fieldKey == 'applicationUse') {
        		templetStr = 'purposeTempletType';
        	}
        	//借款-事由  || 差旅-出差事由
        	if (this.fieldKey == 'borrowingCauses' || this.fieldKey == 'travelReason') {
    			templetStr = 'reasonTempletType';
    		}*/
	    	var templetStr = this.getUsedType();
        	this.dataList = UsedManagment.getIntegrationDataList(nativeInfo.UAId, nativeInfo.cpyId, this.templetType, templetStr);
        },
        mounted:function(){//存在value,显示value  供存草稿使用
        	var _this = this;
        	if(this.value){
        		this.selectedValue = this.value;
        	}
        	//检测键盘是否弹起并设置下拉框弹出延时
        	$(document).on("focus","input,textarea",function(){
        		_this.delayShow = 450;			
			})
        	$(document).on("blur","input,textarea",function(){
        		setTimeout(function(){
        			_this.delayShow = 0;
        		},500)        					
			})
        },
        methods: {
        	
        	changeValue:function(){
        		var _this = this;
				var value = _this.value;
				_this.$emit('input',value);
        	},
        	/**
        	 * 获取热门常用数据
        	 */
        	getHotDataList:function(){
        		//借款-事由
        		if (this.fieldKey == 'borrowingCauses') {
        			this.hotDataList = [
        				{"title":"出差预借现金","value":"出差预借现金","dispValue":"出差预借现金"},
        				{"title":"采购办公用品","value":"采购办公用品","dispValue":"采购办公用品"},
        				{"title":"采购生产设备","value":"采购生产设备","dispValue":"采购生产设备"},
        				{"title":"商务招待","value":"商务招待","dispValue":"商务招待"},
        				{"title":"个人事务","value":"个人事务","dispValue":"个人事务"}];
        		}
        		//用款-用途
        		if (this.fieldKey == 'applicationUse') {
        			this.hotDataList = [{"title":"缴房租","value":"缴房租","dispValue":"缴房租"},
        				{"title":"缴电费","value":"缴电费","dispValue":"缴电费"},
        				{"title":"缴物业费","value":"缴物业费","dispValue":"缴物业费"},
        				{"title":"生产原材料合同支付","value":"生产原材料合同支付","dispValue":"生产原材料合同支付"},
        				{"title":"研发物料采购合同支付","value":"研发物料采购合同支付","dispValue":"研发物料采购合同支付"}];
        		}
        		//差旅-出差事由
        		if (this.fieldKey == 'travelReason') {
        			this.hotDataList = [{"title":"拜访客户","value":"拜访客户","dispValue":"拜访客户"},
        				{"title":"参加会议","value":"参加会议","dispValue":"参加会议"},
        				{"title":"参观展览","value":"参观展览","dispValue":"参观展览"},
        				{"title":"售前客户交流","value":"售前客户交流","dispValue":"售前客户交流"},
        				{"title":"招投标","value":"招投标","dispValue":"招投标"}];
        		}
        		//差旅-长途交通费-起点,目的地   
        		if(this.fieldKey == 'LTusedDiv1' || this.fieldKey == 'HEusedDiv5' || this.fieldKey == 'LTusedDiv2') {
        			this.hotDataList = [{"title":"深圳","value":"深圳","dispValue":"深圳"},
        				{"title":"北京","value":"北京","dispValue":"北京"},
        				{"title":"上海","value":"上海","dispValue":"上海"},
        				{"title":"广州","value":"广州","dispValue":"广州"},
        				{"title":"武汉","value":"武汉","dispValue":"武汉"}];
        		}
        	},
			/**
			 * 打开选择页面
			 */
			openPopup:function(){
				var _this = this;
				//获取常用热点数据
        		this.getHotDataList();
				var templetStr = this.getUsedType();
        		this.dataList = UsedManagment.getIntegrationDataList(nativeInfo.UAId, nativeInfo.cpyId, this.templetType, templetStr);
        	
				if(0<this.dataList.length || this.hotDataList.length > 0){
					//等待键盘收起再弹出下拉框 
        			if(isPC()){
        				_this.popupShowFlag = true;
        			}else{
	         			setTimeout(function(){
	        				_this.popupShowFlag = true;
	        				_this.delayShow = 0;
	        			},_this.delayShow);       				
        			}         			         			         			
	        		//打开二级页面记住一级页面滚动位置
	        		var bodyScrTop = $("body").scrollTop();
					$("body").css({
					    'overflow':'hidden',
					    'position': 'fixed',
					    'top': bodyScrTop*-1
					});	
					$("body").attr("bodyScrTop",bodyScrTop);	
					this.selectFlag.show = true;
					this.selectUsedFlag.show = true;
					setTitleOnly("选择常用" + _this.title);
				} else{
					this.selectFlag.show = false;
					showToast(this.noTips);
				}
			},
			choosedItem:function(item){
            	var _this = this;
//          	_this.popupShowFlag = false;
				_this.setBodysrcTop();
            	this.selectFlag.show = false;
            	_this.selectedValue = item.dispValue;//控件显示值 
            	setTimeout(()=>{
            		if(_this.offlineFlag){
            			_this.setRelationField(item);//控件显示值
            		}else{
            			_this.$emit('input', item.value);//控件返回值
            		}
            		initTitleMenu(_this.subTitle);//设置title及按钮
            		//更新高度需要延后，不然会没有效果
            		setTimeout(()=>{
            			this.$refs.input.updateAutosize();
            		},50);
            	},500);
            },
            /**
             * 设置关联控件值
             * @param {Object} item
             */
            setRelationField:function(item){
            	var _this = this;
            	
            	var relationObj = item.relationObj;
            	if(relationObj){
        			//如果在明细中，需要区分
					if(_this.isInDetailFlag){//明细
						for(var key in relationObj){
							_this.$root.content.inDetail[_this.idx][key] = relationObj[key];//设置明细控件值
							//content值无法直接作用到页面，需要针对控件赋值 
							if(_this.$parent.$refs[key]){
							_this.$parent.usedFlag = true;
							}
						}
					} else {
						for(var key in relationObj){
							_this.$parent.nextOprData[key] = relationObj[key];//设置明细控件值 
						}
					}
            	}
            },
            /**
			 * 存储常用账户
			 */
			saveUsed:function(type){
				var _this = this;
				if(type){
					_this.templetType = type;
				}
/*				var templetStr = 'templetType';
	        	if(this.offlineFlag){
	        		templetStr = 'offlineTempletType';
	        	}
	        	if (this.fieldKey == 'applicationUse') {
        			templetStr = 'purposeTempletType';
        		}
	        	if (this.fieldKey == 'borrowingCauses' || this.fieldKey == 'travelReason') {
	    			templetStr = 'reasonTempletType';
	    		}*/
	    		var templetStr = this.getUsedType();
				if(_this.isInDetailFlag){//明细
				   	UsedManagment.saveUsedAccount(_this.$root.content.inDetail[_this.idx],templetStr+_this.templetType+_this.storageKey,_this.displayKeys,_this.relationFiledIds,_this.value);
				} else if(_this.offlineFlag) {
					UsedManagment.saveUsedAccount(_this.$parent.nextOprData,templetStr+_this.templetType+_this.storageKey,_this.displayKeys,_this.relationFiledIds,_this.value);
				} else {
					UsedManagment.saveUsedAccount(_this.$root.content,templetStr+_this.templetType+_this.storageKey,_this.displayKeys,_this.relationFiledIds,_this.value);
				}
			},
			/**
			 * 二级明细常用临时存储
			 */
			saveTempUsed:function(type){
				var _this = this;
				if(type){
					_this.templetType = type;
				}
				var templetStr = 'tempTempletType';
				if (this.fieldKey == 'HEinputDiv6') {
					templetStr = 'temphotelTempletType';
				}
				if(_this.isInDetailFlag){//明细
				   	UsedManagment.saveUsedAccount(_this.$root.content.inDetail[_this.idx],templetStr+_this.templetType+_this.storageKey,_this.displayKeys,_this.relationFiledIds,_this.value);
				} else {
					UsedManagment.saveUsedAccount(_this.$root.content,templetStr+_this.templetType+_this.storageKey,_this.displayKeys,_this.relationFiledIds,_this.value);
				}
			},
            /**
			 * 删除常用
			 * @param {Object} item
			 */
			delUsed:function(item){
				var _this = this;
				var templetStr = this.getUsedType();
				for(var i=0;i<_this.dataList.length;i++){
					if(item.title==_this.dataList[i].title){
						//UsedManagment.deleteUsed(i,storageKey);
						//_this.dataList.splice(i,1);
						UsedManagment.delIntegrationDataList(nativeInfo.UAId, nativeInfo.cpyId,_this.templetType,templetStr,i,item.title);
					}
				}
				if(0==_this.dataList.length){
					_this.setBodysrcTop();
					_this.selectFlag.show = false;
					setTimeout(()=>{
	            		initTitleMenu(_this.subTitle);//设置title及按钮
	            	},500);
				}
				getBankConfig().then(result => {
					_this.setNewList(result);
					if(0==_this.dataList.length){
						_this.setBodysrcTop();
						_this.selectFlag.show = false;
						setTimeout(()=>{
		            		initTitleMenu(_this.subTitle);//设置title及按钮
		            	},500);
					}
				});
			},
			/**
             * 重新读取并设置常用账户选择列表
             */
            setNewList:function(bankInfo){
            	var _this = this;
            	var templetStr = _this.getUsedType();
	        	
        		_this.dataList = UsedManagment.getIntegrationDataList(nativeInfo.UAId, nativeInfo.cpyId, _this.templetType, templetStr, bankInfo);
            },
			/**
			 * 获取常用类型
			 */
			getUsedType:function() {
				var usedType = 'templetType';
				//线下支付
				if(this.offlineFlag){
					usedType = 'offlineTempletType';
				}
				//用款-用途
	        	if (this.fieldKey == 'applicationUse') {
        			usedType = 'purposeTempletType';
        		}
	        	//借款-事由  || 差旅-出差事由
	        	if (this.fieldKey == 'borrowingCauses' || this.fieldKey == 'travelReason') {
        			usedType = 'reasonTempletType';
        		}
	        	//差旅入住酒店
	        	if (this.fieldKey == 'HEinputDiv6') {
        			usedType = 'hotelTempletType';
        		}
	        	return usedType;
			},
            /*             
             * 设置页面body滚动高度，用于显示隐藏二级页面时保持一级页面的高度
             * */
            setBodysrcTop:function(){
			    //关闭二级页面设置一级页面滚动位置
    			$("body").css({
				    'overflow':'auto',
				    'position': 'static',
				    'top': 'auto'
				});
				$("body").scrollTop($("body").attr("bodyScrTop"));
            },
       },
       watch:{
        	/**
        	 * 父组件控件组件显示隐藏标识
        	 * @param {Object} newVal  新值
        	 * @param {Object} oldVal  旧值
        	 */
        	'selectFlag.show':function(newVal,oldVal){
        		var _this = this;
        		if(!this.selectFlag.show){//父组件隐藏子组件
        			this.popupShowFlag = false;
        		}
        	},
        	'selectUsedFlag.show':function(newVal,oldVal){
        		if(!this.selectUsedFlag.show){//父组件隐藏子组件
        			this.popupShowFlag = false;
        			initTitleMenu(this.subTitle);//设置title及按钮
        			
        		}
        	},
	        usedSaveFlag:function(newVal,oldVal){
	        	var _this = this;
	        	if(_this.usedSaveFlag){
	        		_this.saveUsed(_this.templetType);
	        	}
	        }
        }
    }
</script>
