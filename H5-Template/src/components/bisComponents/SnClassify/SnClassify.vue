<template>
	<div class="snClassify">
        <cell :title="title" value-align="left">
        	<div @click="openPopup">
	        	<input type="text" class="classifyInput" maxlength="20" :placeholder="placeholder" readonly="readonly" ref="input" :value='selectedValue' />
	        	<span class="button-detail">归类</span>
        	</div>
        </cell>
    
        <popup  v-model="popupShowFlag" position="right" width="100%">
            <div :id="classifyDivld" class="classifyTree" style="display:none;"></div>
        </popup>
    </div>
</template>

<script>
	import './SnClassify.less';
	
	import { getBankType } from '../../../lib/common/SnJsBridge.js';	
	import {cryptPost} from '../../../lib/common/base.js';	
	import {showToast,getStorage,setStorage,deleteStorage,initTitleMenu,setTitleOnly} from '../../../lib/common/extend.js';
	import './SnClassify.js';
	import {Group,Popup, PopupHeader,Panel,Cell} from 'vux';
    export default {
    	components: {
    		Group,
		    Popup, 
		    PopupHeader,
		    Panel,
		    Cell
	    },
	    data:function(){
	    	return {
	    		selectedValue:'未归类',
	    		popupShowFlag:false,
		    	appBankType: '',
		    	initFlag:true,
		    	originalValue:'',
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
		    value:{
		    	type:Number
		    },
		    funName:{//传递进来的方法名
		    	type:String,
                default: ""
		    },
		    columns:{
		    	type:Number,
                default: 1
		    },
		    placeholder:{//控件提示
		    	type:String,
                default: ""
		    },
		    noTips:{//为空提示信息
		    	type:String,
                default: "数据为空"
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
		    flag:{
		    	type:Boolean,
                default: true
		    },
		    cssClass:{
		    	type:String,
                default: ""
		    },
		    relationFiledIds:{
		    	type:Array,
                default: []
		    },
		    isInDetailFlag:{//是否明细组件 默认为否
            	type:Boolean,
            	default:true
            },
		    idx:{ //组件的index
            	type:Number
           },
           	classifyDivld:{
		    	type:String,
		    	default: ""
		    },
           	classifyFieldname:{
		    	type:String,
		    	default: "归类"
		    },
		    selectKey:{
		    	type:String,
                default: ""
		    }
        },
        beforeCreate: function(){
        },
        created:function () {
        	var _this = this;
        	this.classifyDivld = 'classifyDivld' + (this.idx || 0);
        	this.originalValue = this.value;
        },
        mounted:function(){//存在value,显示value
        	var _this = this;
			if(this.value){
				if( this.value .indexOf("|*|") >=0){
					var classifyArr = this.value.split("|*|");
					_this.selectKey = classifyArr[0];
					_this.selectedValue = classifyArr[classifyArr.length-1];
					_this.classifyFieldname = _this.selectedValue;
				}
			}
        },
        methods: {
        	/**
			 * 打开选择页面
			 */
			openPopup:function(){
				var _this = this;				         			         			
        		//打开二级页面记住一级页面滚动位置
        		var bodyScrTop = $("body").scrollTop();
				$("body").css({
				    'overflow':'hidden',
				    'position': 'fixed',
				    'top': bodyScrTop*-1
				});	
				$("body").attr("bodyScrTop",bodyScrTop);				
				this.popupShowFlag = true;
				this.selectFlag.show = true;
				setTitleOnly("选择类别");
				_this.iniClassifyTree();
			},
			/**
			 * 初始化tree
			 */
			iniClassifyTree:function(){
				var _this = this;
				if(_this.initFlag){
					window.tree = $('#classifyDivld'+_this.idx).tree(window.treedata, function(selectData){
						var selectID = selectData.id;
						var selectValue = selectData.value;
						_this.callCalssifyBack(selectID,selectValue);
					});
					_this.initFlag = false;
				}
				$('#classifyDivld'+_this.idx).attr("style","display:block;");
				window.tree.init();
				//初始化已归类值
				if (typeof(_this.selectKey) != "undefined" && _this.selectKey != "") {
					window.tree.setValue(Number(_this.selectKey));
				}
			},
			callCalssifyBack:function (selectKey,selectValue){
				var _this = this;
				_this.setBodysrcTop();
				this.selectFlag.show = false;
				_this.selectKey = selectKey;
            	_this.selectedValue = selectValue;//控件显示值
            	_this.classifyFieldname = selectValue;
            	// 选中的值赋给content
            	setTimeout(()=>{
            		var choosedVaule = selectKey + "|*|" + selectValue;
            		if(choosedVaule != _this.originalValue){
            			_this.$emit('input', choosedVaule);//控件返回 值
            			_this.$root.classifyFlag = true;
            		}
            		initTitleMenu(_this.subTitle);//设置title及按钮
            	},500);
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
        	}
        }
    }
</script>
