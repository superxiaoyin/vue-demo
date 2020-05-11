<template>
	<div class="SnCheckBox">
        <cell :title="title" value-align="left" class="snPopupRight"  @click.native="openPopup" >
        	<input type="text" class="popupInput" maxlength="20" :placeholder="placeholder" readonly="readonly" ref="input" :value='selectedValue' />
        </cell>        
        <popup  v-model="popupShowFlag" position="right" width="100%">
            <div class="position-horizontal-demo popupDebit">
            	<checklist label-position="left" :options="dataList" v-model="checklist"></checklist>
            </div>
            <div class="submitButWrap">
            	<div class="submitBut" @click="choosedList()">确认</div>
            </div>            	
        </popup>
    </div>
</template>

<script>
	import './SnCheckList.less';	
	import {cryptPost} from '../../../lib/common/base.js';		
	import {showToast,initTitleMenu,setTitleOnly} from '../../../lib/common/extend.js';
	import {Popup,PopupHeader,Cell,Checklist } from 'vux';
    export default {
    	components: {
		    Popup, 
		    PopupHeader,
		    Cell,
		    Checklist
	    },
	    data:function(){
	    	return {
	    		selectedValue:'',
	    		popupShowFlag:false,
		    	delayShow:0,//等待键盘收起再弹出下拉框
                checklist:this.value,
                brforeChoosedList:this.value,
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
		    value:{
		    	type:Array
		    },
		    placeholder:{//控件提示
		    	type:String,
                default: ""
		    },
		    noTips:{//为空提示信息
		    	type:String,
                default: "数据为空"
		    },
		    selectFlag:{
		    	type:Object,
		    	default:{'show':false}
		    }
        },
        created:function () {
        	var _this = this;        	
        },
        mounted:function(){
        	var _this = this;        	        	        		        		        		        	
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
			/**
			 * 打开选择页面
			 */
			openPopup:function(){
				var _this = this;
                _this.selectShowControl();
			},
			choosedList:function(){
				var _this = this;
				_this.setBodysrcTop();
				this.selectFlag.show = false;
				_this.setShowValue();
				_this.brforeChoosedList = _this.checklist;
            	setTimeout(()=>{
            		_this.$emit('input', _this.checklist);//控件返回值
            		initTitleMenu(_this.subTitle);//设置title及按钮
            	},500)
            },
            /**
             * 下拉框显示隐藏控制
             */
            selectShowControl:function(){
            	var _this = this;
            	_this.checklist = _this.brforeChoosedList;
        		if(0<this.dataList.length){
        			//等待键盘收起再弹出下拉 框
         			setTimeout(function(){
        				_this.popupShowFlag = true;
        				_this.delayShow = 0;
        			},_this.delayShow);       				
        			
	        		//打开二级页面记住一级页面滚动位置
	        		var bodyScrTop = $("body").scrollTop();
					$("body").css({
					    'overflow':'hidden',
					    'position': 'fixed',
					    'top': bodyScrTop*-1
					});	
					$("body").attr("bodyScrTop",bodyScrTop);
					setTimeout(function(){
						$("body").addClass("setTop0");
					},200)										
					_this.selectFlag.show = true;
					setTitleOnly("选择" + this.title);
				}else{
					this.selectFlag.show = false;
					showToast(this.noTips);
				}
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
				$("body").removeClass("setTop0");	
            },
            //显示选择的内容
            setShowValue:function(){
            	var _this = this;
	        	var nameArr = [];        	
	        	var allDataList = this.dataList;	        	
	        	if(_this.checklist.length >= 0){        		
	    			_this.checklist.forEach(function(checkItem){    				
		         		allDataList.forEach(function(item){
							if(checkItem == item.key){
								nameArr.push(item.value)
							}
		        		})   				    				
	    			})        			       		
	      		_this.selectedValue = nameArr.join(',');//给控件赋值默认值  控件显示值   		        			        		
	        	}             	
            }
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
        	/**
        	 * 数据显示 主要针对删除使用
        	 * @param {Object} newVal
        	 * @param {Object} oldVal
        	 */
        	value:function(newVal,oldVal){
        		var _this = this;
	        	var nameArr = [];        	
				var allDataList = this.dataList;
				console.log(newVal,oldVal);	        	
	        	if(newVal.length > 0){        		
	    			newVal.forEach(function(checkItem){    				
		         		allDataList.forEach(function(item){
							if(checkItem == item.key){
								nameArr.push(item.value)
							}
		        		})   				    				
	    			})        			       		
	      		_this.selectedValue = nameArr.join(',');//给控件赋值默认值  控件显示值   		        			        		
	        	} 
        	},
        }
    }
</script>
