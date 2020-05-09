<template>	
	<div class="treeWrap">
		<div class="treeNode" v-for="(item,index) in treeData" :key="index">
			<div class="title" v-if="!!item.name" @click.stop="choosedTree(item)"><b v-if="!!item.children" class="hidden" :class="{show:item.expand}" @click.stop="slide(item)"></b><i :class="{choosed:item.checked}"></i><span>{{item.name}}</span></div>
			<div class="childrenWrap" v-if="!!item.children && item.expand">
				<tree :treeData="item.children" @setCheckListDo="setTreeFun" @openTreeDo="openTreeFun"></tree>								
			</div>
		</div>		
	</div>
</template>
<script>	
	import {cryptPost} from '../../../lib/common/base.js';		
	import {showToast,initTitleMenu,setTitleOnly,isPC} from '../../../lib/common/extend.js';
    export default {
    	name: 'tree',
    	components: {
	    },
	    data:function(){
	    	return {
	    	}
	    },
        props: {
            treeData:{
                type:Array,
            },
		    value:{
		    	type:Array
		    },
		    isCtrlSon:{
            	type:Boolean,
            	default:false
		    }
        },
        created:function () {
        	var _this = this;        	
        },
        mounted:function(){
        	var _this = this; 
        },
        methods: {
        	//选中树节点触发
        	choosedTree:function(item){
        		var _this = this;
        		var checkType = !item.checked;
//      		if(this.isCtrlSon){//如果递归子节点
//      			_this.choosedTreeDo(item,checkType);
//      		}else{
    			//item.checked = checkType;
    			_this.setCheckList(item);
//      		}        			
        	},
        	//选中树节点递归处理子节点
        	choosedTreeDo:function(item,checkType){
        		var _this = this;
        		item.checked = checkType;
        		_this.setCheckList(item);
        		if(!!item.children){
        			item.children.forEach(function(itemC){
        				_this.choosedTreeDo(itemC,checkType)
        			})        			
        		}
        	},
        	//设置选中的数据
        	setCheckList:function(item){
        		var _this = this;
        		_this.$emit('setCheckListDo',item);//控件返回值        		
        	},
            setTreeFun:function(value){
            	var _this = this;
            	_this.$emit('setCheckListDo',value);//控件返回值
            },
            //树形展开收缩
        	slide:function(item){
        		var _this = this;
        		_this.$emit('openTreeDo',item);//控件返回值         		
        	},
            openTreeFun:function(value){
            	var _this = this;
            	_this.$emit('openTreeDo',value);//控件返回值
            },
       	
       	},
       	watch:{}
    }
</script>
