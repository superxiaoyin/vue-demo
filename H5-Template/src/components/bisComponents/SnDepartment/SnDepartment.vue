<template>
	<div>
		<cell :title='title' value-align='left'>
	    	<input ref="input" 
	    		v-model="selectedOrgName"
		    	:relationFiledIds="relationFiledIds" 
		    	:readonly="readonly" />
	    </cell>
	</div>
</template>
<script>
	
	import {getClass,nativeInfo} from '../../../lib/common/base.js';	
	import DepartmentHandler from './DepartmentHandler.js';	
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
            	default:true
            }
       
        },
        data:function(){
        	return {
        		value:'',
        		relationFiledIds:'',
        		selectedOrgName:'',
        		orgId:'',
        		show:''
        	}
        },
        created:function () {
        },
        mounted:function(){//存在value,显示value  供存草稿使用
        	var _this = this;
        	if(_this.show){
        		_this.selectedOrgName = _this.show;
        		_this.$emit('input',_this.orgId);
        	}else{
        		_this.selectedOrgName = nativeInfo.orgName;
        		_this.$emit('input',nativeInfo.orgId);
        	}
        	_this.$root.content.applyOgrName =_this.selectedOrgName;
        },
        methods: {

        },
        watch:{
        	show:function(newVal,oldVal){
        		var _this =this;
        		if(_this.show){
        			_this.selectedOrgName = _this.show;
        			_this.$emit('input',_this.orgId);
	        	}else{
	        		_this.selectedOrgName = nativeInfo.orgName;
	        		_this.$emit('input',nativeInfo.orgId);
	        	}
        		_this.$root.content.applyOgrName =_this.selectedOrgName;
        	}
        }
    }
</script>