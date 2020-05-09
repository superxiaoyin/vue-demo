<template>
	<div class="SnTree">
        <cell :title="title" value-align="left" class="snPopupRight"  @click.native="openPopup" >
        	<input type="text" class="popupInput" maxlength="20" :placeholder="placeholder" readonly="readonly" ref="input" :value='selectedValue' />
        </cell>        
        <popup  v-model="popupShowFlag" position="right" width="100%">
            <div class="position-horizontal-demo popupDebit">
            	<div class="xTreeWrap">
            		<xTree :treeData="orgTree" @setCheckListDo="setTreeFun" @openTreeDo="openTreeFun"></xTree> 
            	</div>            	           	
            </div>
            <div class="submitButWrap">
            	<div class="submitBut" @click="choosedList()">确认</div>
            </div>            	
        </popup>
    </div>
</template>

<script>
	import './SnTree.less';	
	import {GetUserInfoFunction} from '../../../lib/common/SnJsBridge.js';	
	import {cryptPost} from '../../../lib/common/base.js';		
	import {showToast,initTitleMenu,setTitleOnly} from '../../../lib/common/extend.js';
	import {Popup,PopupHeader,Cell} from 'vux';
	import xTree from '../SnXTree/xTree.vue';
    export default {
    	components: {
		    Popup, 
		    PopupHeader,
		    Cell,
		    xTree
	    },
	    data:function(){
	    	return {
	    		selectedValue:'',
	    		popupShowFlag:false,
		    	delayShow:0,//等待键盘收起再弹出下拉框
                checklist:[],
                showOrgNames:this.showOrgNames,
                userInfo:{},//用户信息
                orgTree:[],//部门树
                orgTreeBefore:[],
                openList:[],//部门树展开的节点
                isInitTree:true,
                cpyOrgId:0,
	    	}
	    },
        props: {
            title:{
                type:String,
                default: ""
            },
            subTitle:{
            	type: Array,
		        default () {
		            return []
		        }
            },
            showOrgNames:{
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
		    },
		    isEdit:{
            	type:Boolean,
            	default:false
		    }
        },
        created:function () {
        	var _this = this; 
			GetUserInfoFunction().then(function(Data){
				if(!!Data){
					_this.userInfo = Data;
					_this.getOrgTree();
				}							
           	})        	
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
           	//获取组织架构
            getOrgTree:function(){
            	var _this = this;         	
            	var json = {	
					UAId:_this.userInfo.UAId,
					cpyId:_this.userInfo.cpyId		
				}
    			cryptPost('../../tcm/orgnization/downloadCpyOrgTree.do',json).then(function(result){
					if(!!result){
						var tempOrgList = [];
						var tempResult = result;
						_this.cpyOrgId = result.orgId;
						if(!!result.childOrg){
							for(var i=0;i<result.childOrg.length;i++){
								if(!!result.childOrg[i].orgId){
									tempOrgList.push(result.childOrg[i]);
								}
							}
						}
						if(0 == tempOrgList.length){
							delete tempResult.childOrg;
						}else{
							tempResult.childOrg = tempOrgList;
						}												
						_this.orgTreeBefore = [tempResult];
						_this.orgTree = _this.getTree(_this.orgTreeBefore,true,_this.checklist,[]);
						//_this.orgTree[0].expand = true;
					}						
				});            	            	                
           	}, 
           	//处理数据
		    getTree:function (treeJson,isRoot,orgArr,openArr) {
		    	var _this = this; 
		    	var tree = treeJson;
		        let arr = [];
		        if (!!tree && tree.length !== 0) {
		            tree.forEach(item => {
		                let obj = {};
		                obj.name = item.orgName;		                
		                obj.orgId = item.orgId; // 其他你想要添加的属性	
		                if(isRoot){
		                	obj.expand = true;
		                }else{
		                	obj.expand = _this.arrhaveitem(item.orgId,openArr); 
		                }		                
		                obj.checked = _this.arrhaveitem(item.orgId,orgArr);
		                if(!!item.childOrg){
		                	obj.children = _this.getTree(item.childOrg,false,orgArr,openArr); // 递归调用
		                }
		                if(!!obj.orgId){
		                	arr.push(obj);
		                }
		                
		            });
		        }
		        return arr;
		    }, 
		    arrhaveitem:function(item,arr){
		    	var isInArr = false;
		    	var len = arr.length;
				for(var i=0;i<len;i++){
		    		if(arr[i] == item){
		    			isInArr = true;
		    			break;
		    		}					
				}
		    	return isInArr;
		    },      		
			/**
			 * 打开选择页面
			 */
			openPopup:function(){
				var _this = this;
                _this.selectShowControl();
			},      		
			/**
			 * 关闭选择页面
			 */
			choosedList:function(){
				var _this = this;
				_this.setBodysrcTop();
				this.selectFlag.show = false;
            	setTimeout(()=>{
            		initTitleMenu(_this.subTitle);//设置title及按钮
            	},500)
            },
            /**
             * 下拉框显示隐藏控制
             */
            selectShowControl:function(){
            	var _this = this;
        		if(0<this.orgTree.length){
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
            //点击树节点
            setTreeFun:function(value){
            	var _this = this;
            	if(value.checked){ 
            		if(this.value.length == 1 && this.isEdit){//修改信息不能删除所有部门
            			showToast('部门至少选择一项')
            			return;
            		}
            		_this.showOrgNames.splice(_this.indexOfArr(value.name,_this.showOrgNames), 1);
            		this.value.splice(_this.indexOfArr(value.orgId,this.value), 1);            		
            	}else{           		
            		_this.showOrgNames.push(value.name)
            		this.value.push(value.orgId)            		
            	}
            	_this.selectedValue = _this.showOrgNames.join(',');
            	_this.orgTree = _this.getTree(_this.orgTreeBefore,true,this.value,_this.openList); 
            	_this.$emit('input', this.value);//控件返回值
            },
            indexOfArr:function(val,arr) {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] == val) return i;
				}
				return -1;
			},
			openTreeFun:function(value){				
            	var _this = this;            	
            	if(value.expand){            		            		
            		_this.openList.splice(_this.indexOfArr(value.orgId,_this.openList), 1);            		
            	}else{           		
            		_this.openList.push(value.orgId)            		
            	}
            	if(_this.cpyOrgId == value.orgId){
            		_this.orgTree = _this.getTree(_this.orgTreeBefore,false,this.value,_this.openList);
            	}else{
            		_this.orgTree = _this.getTree(_this.orgTreeBefore,true,this.value,_this.openList);
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
        	 * 树组件数据显示
        	 * @param {Object} newVal
        	 * @param {Object} oldVal
        	 */
        	value:function(newVal,oldVal){
        		var _this = this;
        		_this.checklist = newVal;
        		_this.orgTree = _this.getTree(_this.orgTreeBefore,true,newVal,_this.openList)

				

        	},
        	showOrgNames:function(newVal,oldVal){
        		var _this = this;
	        	_this.selectedValue = newVal.join(',');

        	}
        }
    }
</script>
