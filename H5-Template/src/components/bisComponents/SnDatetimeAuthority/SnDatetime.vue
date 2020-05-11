<template>
	<div class="SnDatetime">
		<cell :title='title' value-align='left'  >
	    	<input v-model="selectedDate" placeholder="请选择有效日期" 
	    		@click="selectTime" 
		    	readonly="readonly" style="color: #478aee;"/>
		    <em v-if="readonly=='true'" class="snDatetimeBut" @click="selectTime"></em>
	    </cell>
	   	<div v-transfer-dom >
	        <popup v-model="showPopup" class="calendarWrap" position="bottom" :show-mask="true" hide-on-blur
			   style="background: #ffffff " @on-hide="setBodysrcTop">
				<div class="calendar">
					<div class="position-vertical-demo">
						<calendar ref="Calendar" :displayMode='displayMode' @commitDate='commitDate' 
							@choseDay='choseDay'  @changeDate='changeDate'></calendar>
					</div>
				</div>
			</popup>
		</div>	    
	</div>
</template>
<script>
	import './SnDatetime.less';
	import {SelectTimeWidget} from '../../../lib/common/SnJsBridge.js';
	import {showToast,isPC} from '../../../lib/common/extend.js';
	import DatetimeHandler from './DatetimeHandler.js';	
	import Calendar from '../CalendarAuthority/calendar.vue';
	import {Group,Datetime,Cell,ToastPlugin,dateFormat,Popup,TransferDom} from 'vux';
	Vue.use(ToastPlugin);
    export default {
    	directives: {
            TransferDom
        },
    	components: {
    		Group,
    		Cell,
    		Datetime,
    		Calendar,
    		Popup
	    },
	    data:function(){
	    	return{
	    		timeJson:this.value,
	    		timeStamp:this.value,
	    		selectedDate:'',
	    		format:this.formatDate.format,
	    		timeType:this.formatDate.timeType,
	    		nativeTimestap:0, //传递给native的时间戳
	    		showPopup:false,
	    		nativeBeginTime:new Date(),
	    		nativeEndTime:new Date(),
	    		isPC:false,
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
		    },
            selectFlag: {
                type: Object,
                default: {'show': false}
            },
		    displayMode:{
		    	type:Number,
		    	default:4//选择日期时段
		    }
        },
        created:function () {
        	var _this = this;
        	if(isPC()){
        		_this.isPC = true;
        	}
        	if(!!_this.timeJson.beginTime && !!_this.timeJson.endTime){
    			_this.selectedDate = new Date(_this.timeJson.beginTime*1000).format(_this.format)+' - '+new Date(_this.timeJson.endTime*1000).format(_this.format);
    			_this.nativeBeginTime = _this.timeStamp.beginTime*1000; 
    			_this.nativeEndTime = _this.timeStamp.endTime*1000; 
        	}
        },
        mounted:function(){//存在value,显示value  供存草稿使用
        },
        methods: {
//			/**
//			 * 传递给父组件的值
//			 * value 传递给父组件的值
//			 */
//			showClick(value){
//				var _this = this;
//				var returnValue = new Date();
//				if("timestamp"==_this.serverFormat){
//					returnValue = parseInt(value / 1000);
//				}else{
//					returnValue = dateFormat(value, _this.serverFormat);
//				}
//				_this.$emit('input', returnValue);//发送服务器
//			},
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
//				if(_this.isPC){
					_this.webSelectTime()
//				}else{
//					_this.appSelectTime()
//					
//				}
			},
			/**
			 * 调用时间组件
			 */
			webSelectTime:function(){
				var _this = this;
				_this.showPopup = true;
				_this.selectFlag.show = true;
//              //打开二级页面记住一级页面滚动位 置
//              var bodyScrTop = $("body").scrollTop();
//              $("body").css({
//                  'overflow':'hidden',
//                  'position': 'fixed',
//                  'top': bodyScrTop*-1
//              });
//              $("body").attr("bodyScrTop",bodyScrTop);
//                      startTime:_this.nativeBeginTime,// 初始化开始时间
//                      endTime: _this.nativeEndTime // 初始化结束时间 showModel == 3 时 才有效
				var times = [_this.nativeBeginTime/1000,_this.nativeEndTime/1000];//{startTime:_this.nativeBeginTime/1000,endTime:_this.nativeEndTime/1000};
				_this.$refs.Calendar.setDate(times);
			},
			commitDate:function(data){
				var _this = this;
				if(_this.displayMode == '4'){
					_this.setDateTime4(data);
				}
			},
//			changeDate:function(data){
//				if (this.showPopup && this.displayMode == '3'){
//					this.setDateTime(data*1000);
//				}
//			},
//			choseDay:function(data){
//				console.log("choseDay = "+data);
//			},
//			setDateTime:function(slTimeStamp){
//				var _this = this;
//				if (_this.formatDate.format == 'YYYY/MM/DD') {
//          		if (!!_this.daterange) {
//          			var timeTranStr = '';
//          			if (_this.daterange == 'startDate') {
//              			timeTranStr = dateFormat(slTimeStamp, "YYYY/MM/DD") + " 08:30"; 
//              		}
//              		if (_this.daterange == 'endDate') {
//              			timeTranStr = dateFormat(slTimeStamp, "YYYY/MM/DD") + " 17:30"; 
//              		}
//          			slTimeStamp = new Date(timeTranStr).getTime();
//          		}
//          	}
//				var selectTime = dateFormat(slTimeStamp, _this.format);
//				
//          	var nextDay = (new Date(new Date().toLocaleDateString()).getTime())+(24*3600*1000);
//          	var next7Day = (new Date(new Date().toLocaleDateString()).getTime())+((24*3600*1000)*7);
//          	if(dateFormat(nextDay, 'YYYY-MM-DD') > selectTime){
//              	showToast('今天及之前的时间不支持预约', 'middle'); 
//              	return;  
//              }else if(dateFormat(next7Day, 'YYYY-MM-DD') < selectTime){
//              	showToast('预约时间仅支持一周以内', 'middle'); 
//              	return;
//              }            	
//          	
//          	
//          	
//          	//保存还原时间戳，Bug 24169
//          	_this.oldNativeTimestap = _this.nativeTimestap;
//          	_this.nativeTimestap = slTimeStamp;
//          	//开始和结束时间的比较，
//          	if (!_this.startEndDateCheck()) return;
//
//              _this.selectedDate = selectTime;
//              _this.showClick(slTimeStamp);
//
//              //开始和结束时间的计算，
//				_this.startEndDateCompute();
//				_this.setBodysrcTop();
//				_this.showPopup = false;
//
//			},
			setDateTime4:function(slTimeStamp){
				var _this = this;
				var data = slTimeStamp;
                if(''!=data){   
                	if(data.startTime == 'Invalid Date'){
                		showToast('请选择开始时间', 'middle'); 
                    	return; 
                	}   
                	if(data.endTime == 'Invalid Date'){
                		showToast('请选择结束时间', 'middle'); 
                    	return; 
                	}
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
				
				
				
//				_this.setBodysrcTop();
				_this.showPopup = false;

			},
//			/**
//			 * 获取时间显示格式
//			 */
//			getDataModel:function(){
//				var _this = this;
//				_this.displayMode = ((_this.formatDate.format.toLocaleLowerCase()).indexOf('hh:mm') > 0)?1:3;
//				//代发工资
//				//showModel = ( 0<(_this.format.toLocaleLowerCase()).indexOf('dd') )?showModel:4;
//			},
			appSelectTime:function(){
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
        }

    }
</script>