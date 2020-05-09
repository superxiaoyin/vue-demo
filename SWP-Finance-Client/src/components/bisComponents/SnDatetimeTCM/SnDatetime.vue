<template>
	<div class="SnDatetime">
		<cell :title='title' value-align='left'  >
	    	<input v-model="selectedDate" placeholder="请选择有效日期" 
	    		@click="selectTime" 
		    	readonly="readonly" style="color: #478aee;"/>
		    <!--<em class="snDatetimeBut" @click="selectTime"></em>-->
	    </cell>
	    
	</div>
</template>
<script>
	import './SnDatetime.less';
	import {SelectTimeWidget} from '../../../lib/common/SnJsBridge.js';
	import {showToast} from '../../../lib/common/extend.js';
	import DatetimeHandler from './DatetimeHandler.js';
	
	import {Group,Datetime,Cell,ToastPlugin,dateFormat} from 'vux';
	Vue.use(ToastPlugin);
    export default {
    	components: {
    		Group,
    		Cell,
    		Datetime
	    },
	    data:function(){
	    	return{
	    		timeJson:this.value,
	    		timeStamp:this.value,
	    		selectedDate:'',
	    		format:this.formatDate.format,
	    		timeType:this.formatDate.timeType,
	    		nativeTimestap:0, //传递给native的时间戳
	    	}
	    },
        props: {
            title:{
                type:String,
                default: ""
            },
		    formatDate:{
		    	type:Object
		    },
		    value:{
		    	type:String
		    },
		    placeholder:{
		    	type:String,
                default: ""
		    },
		    readonly:{
		    	type:Boolean,
            	default:false
		    }
        },
        created:function () {
        	var _this = this;
        	if(!!_this.timeJson.beginTime && !!_this.timeJson.endTime){
    			_this.selectedDate = new Date(_this.timeJson.beginTime*1000).format(_this.format)+' - '+new Date(_this.timeJson.endTime*1000).format(_this.format);
    			_this.nativeBeginTime = _this.timeStamp.beginTime*1000; 
    			_this.nativeEndTime = _this.timeStamp.endTime*1000; 
        	}
        },
        mounted:function(){//存在value,显示value  供存草稿使用
        },
        methods: {
			/**
			 * 传递给父组件的值
			 * value 传递给父组件的值
			 */
			backToParent(json){
				var _this = this;				
				var returnBeginValue = new Date();
				returnBeginValue = new Date(json.startTime).format(_this.format);
				
				var returnEndValue = new Date();
				returnEndValue = new Date(json.endTime).format(_this.format);
				var timeStamp = {};
				timeStamp['beginTime'] = (Date.parse(new Date(returnBeginValue)))/1000-3600*8;

				timeStamp['endTime'] = (Date.parse(new Date(returnEndValue)))/1000+3600*16-1;
				
				_this.$emit('input', timeStamp);//发送服务器
			},
			selectTime:function(){
				var _this = this;  
				if (_this.readonly) {
					return;
				}
				//请求native选择时间
				var selectTimeJson = {
						timeId:'1',// 控件ID
                        showModel:3,// 显示模式 1：只有年月日的显示选择 2:显示年月日时分 3：显示开始结束时间
                        startTime:_this.nativeBeginTime,// 初始化开始时间
                        endTime: _this.nativeEndTime // 初始化结束时间 showModel == 3 时 才有效
				};
                SelectTimeWidget(JSON.stringify( selectTimeJson )).then(function(data){
                    if(''!=data){                    	
                    	var selectBeginTime = data.startTime;
                    	var selectEndTime = data.endTime;
                    	var yestDay = new Date(new Date().setHours(0, 0, 0, 0));
                    	if(yestDay > data.startTime || yestDay > data.endTime){
                        	showToast('有效期不能早于今天', 'middle'); 
                        	return;  
                      	}
                    	
                    	
                    	var tempend = new Date(new Date(selectEndTime).format(_this.format)).setHours(0, 0, 0, 0);
                    	
                    	if(selectBeginTime > tempend){
                        	showToast('结束日期不能早于开始日期', 'middle'); 
                        	return;                     		
                    	}
                    	_this.nativeBeginTime = data.startTime;
                    	_this.nativeEndTime = data.endTime;             
                        _this.selectedDate = new Date(data.startTime).format(_this.format)+' - '+new Date(data.endTime).format(_this.format);
                        _this.backToParent(data);
                    }
                });
			},
        }

    }
</script>