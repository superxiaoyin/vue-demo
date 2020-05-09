<!--附属/二级明细控件-->
<template>  
	<div>     
		<div class="snSubsidiaryTit"> 
			<span class="sidiaryTit">{{title}}</span> 
			<span class="sidiaryText" v-text='subTotal' placeholder='0.00元'></span>
			<span class="sidiaryBut" @click='openDetail'>明细<span class="colorGray">(<span>{{ssdLength}}</span>)</span></span>
		</div>  
		<div v-if='ssdFlag'  class="subsidiaryDetail full-s">
			<div  class="subsidiaryMain sn-main-con">							
				<SnSubInDetail :title='subTitle' :addDesc='addSubDesc' v-model='travel.inDetail' :maxSize='19' :ref='fieldKey'
					:subTitle="subUsedTitle" 
					relationFiledIds="subValue" 
					:travelStartDate='travelStartDate' 
				    :travelEndDate='travelEndDate' 
				    :travelDays='travelDays'
				    :templetType="templetType" 
					:inDetailList='inDetailList'
					:usedSaveFlag='usedSaveFlag' 
					:selectUsedFlag='selectUsedFlag' 
					:ssDiaryFlag='true' ></SnSubInDetail> 
				<SnMoney title='小计' v-model='travel.subValue' ref='subValue' :readonly=true placeholder='0.00元'></SnMoney>
				<SnMoney title='个人实付' v-model='travel.payByMyselfSubValue' :readonly=true ref='payByMyselfSubValue' placeholder='0.00元'></SnMoney>
				<SnMoney title='公司代付' v-model='travel.payByCompanySubValue' :readonly=true ref='payByCompanySubValue' placeholder='0.00元'></SnMoney>
				<div class="subButton">
					<span class="leftBut" @click='cancel'>取消</span>
					<span class="rightBut" @click='ok'>确定</span>
				</div>
			</div>
		</div>
	</div>
</template> 
<script>
	import './SnSubsidiary.less'; 
	import { registerHandler,notifyAppBackEvent} from '../../../lib/common/SnJsBridge.js';
	import {showToast,isEmptyObject,sumStrings,showConfirm,moneyStringFixTwo,getClass,moneyUppercase,initTitleMenu,setTitleOnly} from '../../../lib/common/extend.js';
	import SnSubInDetail from './SnSubInDetail.vue';
	import SnMoney from '../SnMoney/SnMoney.vue';
	import SnSubsidiaryHandler from './SnSubsidiaryHandler.js';
    export default {
    	components:{ 
            SnSubInDetail, 
            SnMoney 
    	},
        props: {
        	title:{
        		type:String,
            	default:'标题'
        	},
            subTitle:{
            	type:String,
            	default:'明细'
            },
            detailTitle:{
            	type: Array,
		        default () {
		            return []
		        }
            },
            subUsedTitle:{
            	type: Array,
		        default () {
		            return []
		        }
            },
            addSubDesc:{
            	type:String,
            	default:'+增加项目'
            },
            value:{
            	type:Array, 
            	default:{}
            }, 
            selectFlag:{
            	type:Object
            },
            fieldKey:{
            	type:String,
            	default:''
            }, 
            subsidiaryFlag:{//二级明细是否显示
            	type:Object,
            	default:{'show':false}
            },
            relationFiledIds:{
            	type:String,
            	default:'totalMoney'
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
            templetType:{
		    	type:String,
                default: "9"
		    },
            usedSaveFlag:{//是否保存常用 默认为否
            	type:Boolean,
            	default:false
            },
            selectUsedFlag:{
		    	type:Object,
		    	default:{'show':false}
		    },
		    subTemplet: { //历史常用需要
	            type: Number,
	            default: -1
	        },
        },
        data:function(){ 
        	return {  
        		ssdFlag:false,//二级明细显示
        		inDetailList:[],//二级明细字段  
        		subTotal:'',
        		clickBtnFlag:false,//点击cancel或者ok动作标识
        		travel:{subValue:0,payByMyselfSubValue:0,payByCompanySubValue:0,inDetail:[]},
        		openTravel:{},
        		ssdLength:0,//明细长度
        		selectUsedFlag:{'show':false},//是否显示选择控件 默认为false
        	}
        },
        created:function () {  
        	var _this = this;
			var fieldKey = this.fieldKey || 'travelLongTransport'; 
			this.inDetailList = (SnSubsidiaryHandler.SubSidiaryMap || {})[fieldKey].inDetailList;//根据不同的type获取不同的detailList
			if(this.travel.inDetail){
				this.ssdLength = this.travel.inDetail.length;
			}
			this.subUsedTitle.push(this.title);
        },
        mounted:function(){
        	//不为空对象则赋值
        	if(!isEmptyObject(this.value)){
        		this.travel = JSON.parse(JSON.stringify(this.value));
        		if(this.travel.subValue){ 
        			this.subTotal = moneyStringFixTwo(this.travel.subValue);
        		}
        		if(this.travel.inDetail){
        			this.ssdLength = this.travel.inDetail.length; 
        		}
        		this.$emit('input', this.travel);//传递给父组件
        	}
        },
        updated:function(){
        },
        methods: {
        	/**
        	 * 打开二级明细 
        	 */
        	openDetail:function(){
        		var _this = this;
        		//打开二级页面记住一级页面滚动位 置
        		// var bodyScrTop = $("body").scrollTop();
				// $("body").css({
				//     'overflow':'hidden',
				//     'position': 'fixed',
				//     'top': bodyScrTop*-1
				// });
				// $("body").attr("bodyScrTop",bodyScrTop);
				// document.body.setAttribute('data-scroll', getScrollTop());
				// document.getElementsByTagName('html')[0].style.overflow = 'hidden';
				// document.body.style.overflow = 'hidden';
				document.body.setAttribute('style', 'overflow: hidden;');

        		this.subsidiaryFlag.show = true;
        		this.ssdFlag = true;
        		this.clickBtnFlag = false;
        		setTitleOnly(this.title);
        		_this.$root.subDetailKey = _this.fieldKey;
        		this.openTravel = JSON.parse(JSON.stringify(this.travel));

				function getScrollTop() {
					let scrollTop = 0;
					if(document.documentElement && document.documentElement.scrollTop) {
						scrollTop = document.documentElement.scrollTop;
					} else if(document.body) {
						scrollTop = document.body.scrollTop;
					}
					return scrollTop;
				}
        	},
        	/** 
        	 * 取消    
        	 */
        	cancel:function(){
        		var _this = this;
        		//点击取消的时候的二级明细的数据内容
        		var lastInDetailValue = JSON.stringify(this.travel.inDetail);
        		//打开二级明细的时候的数据内容
        		var openInDetailValue = JSON.stringify(_this.$refs[_this.fieldKey].openInDetailValue);
        		//如果两个数据相等，则说明数据没有变化，不对用户做确认框提示
        		if (lastInDetailValue == openInDetailValue) {
        			_this.cancelSet();
        		} else {
        			//确定框弹框      
		    		showConfirm('你确定关闭吗？',function(){
		    			_this.cancelSet();
		    		});
        		}
        	},
        	/**
        	 * 取消操作的时候的处理
        	 */
        	cancelSet:function(){
        		var _this = this;
    			_this.setBodysrcTop();
    			_this.clickBtnFlag = true;//不能写到_this.subsidiaryFlag.show后面，否则watch里面的数据会出错  	  
				_this.subsidiaryFlag.show = false;
    			_this.ssdFlag = false;
    			
    			//取消时 不对二级明细inDetail赋值
    			_this.travel = JSON.parse(JSON.stringify(_this.value));   
    			_this.travel.inDetail = _this.value.inDetail || [];
    			
    			initTitleMenu(_this.detailTitle);//设置title及按钮
        	},
        	/**
        	 * 确定     
        	 */
        	ok:function(){
        		var _this = this;
        		//取值 
        		this.ssdLength = this.travel.inDetail.length; 
        		//差旅入住天数的小数点只能为0.5天，此处做数据拦截   z c 
        		var checkHotelDays = true; 
        		for(var i=0; i<this.ssdLength; i++) {
        			if (this.travel.inDetail[i].HEinputDiv7) {
        				var HEinputDiv7Value = parseFloat(this.travel.inDetail[i].HEinputDiv7/10)+'';
        				if (HEinputDiv7Value.split('.')[1] && HEinputDiv7Value.split('.')[1] != '5') {
        					checkHotelDays = false;
        				}
        			}
        		}
        		if (!checkHotelDays) {
        			showToast("入住天数需以0.5为倍数");
					return;
        		}
        		this.clickBtnFlag = true;//不能写到this.subsidiaryFlag.show后面，否则watch里面的数据会出错
        		//临时保存二级明细常用 
        		for(var key in _this.$refs[_this.fieldKey].$refs){
        			if(_this.$refs[_this.fieldKey].$refs[key][0].saveTempUsed){
        				_this.$refs[_this.fieldKey].$refs[key][0].saveTempUsed(_this.templetType);
        			}
        		} 
        		_this.setBodysrcTop();
				this.subsidiaryFlag.show = false;
        		this.ssdFlag = false;
        		this.subTotal = moneyStringFixTwo(this.travel.subValue || '0');
        		this.$emit('input', this.travel);//传递给父组件
        		this.summation();
        		
        		initTitleMenu(this.detailTitle);//设置title及按钮
        	},
        	/**
        	 * 计算相关总计
        	 */
        	summation:function(){
        		this.setTotalMoney();
        		this.setPayByMyselfTotalMoney();
        		this.setPayByCompanyTotalMoney();
        	},
        	/**
        	 * 设置总计与总计大写  在watch中显示上一次值 需要跟进
        	 */
        	setTotalMoney:function(){
        		var totalMoney = this.calTotalMoney('subValue');
        		//使用 $set对content中的totalMoney赋值，才能在审批页面中监听到totalMoney  zc Bug#32844
        		this.$set(this.$root.content,  "totalMoney",  totalMoney);
//      		this.$root.content.totalMoney = totalMoney;
        		//总计金额长度限制
				if (totalMoney.length > 16) {//暂时只给出提示
		    		showToast("总计金额已超出可报销范围", 'middle');
		    	}
        		//显示金额总计 设置显示值  
        		if(this.$root.$refs['totalMoney']){
        			var moneyDisp = moneyStringFixTwo(totalMoney);
        			if(getClass(this.$root.$refs['totalMoney'])=='Array'){//数组
						this.$root.$refs['totalMoney'][0].value = moneyDisp;
					}else {//input元素
						this.$root.$refs['totalMoney'].value = moneyDisp;
					}
        		}
        		//显示金额总计大写
				if(this.$root.$refs['totalMoneyBig']){
					var moneyBig = moneyUppercase(totalMoney);
					this.$root.content.totalMoneyBig = moneyBig
        			if(getClass(this.$root.$refs['totalMoneyBig'])=='Array'){//数组
						this.$root.$refs['totalMoneyBig'][0].value = moneyBig;
					}else {//input元素
						this.$root.$refs['totalMoneyBig'].value = moneyBig;
					}
        		}  
        	},
        	/**
        	 * 设置个人代付总计及其显示
        	 */
        	setPayByMyselfTotalMoney:function(){
        		//计算最外层个人实付 
        		var totalMoney = this.calTotalMoney('payByMyselfSubValue'); 
        		this.$root.content.payByMyselfTotalMoney = totalMoney;
        		//设置显示值  
        		if(this.$root.$refs['payByMyselfTotalMoney']){
        			if(getClass(this.$root.$refs['payByMyselfTotalMoney'])=='Array'){//数组
						this.$root.$refs['payByMyselfTotalMoney'][0].value = moneyStringFixTwo(totalMoney);
					}else {//input元素
						this.$root.$refs['payByMyselfTotalMoney'].value = moneyStringFixTwo(totalMoney);
					}
        		}
        	},
        	/**
        	 * 设置公司代付总计及其显示
        	 */
        	setPayByCompanyTotalMoney:function(){
        		//计算最外层个人实付 
        		var totalMoney = this.calTotalMoney('payByCompanySubValue'); 
        		//差旅公司代付的为‘’的时候，手动赋值为0
        		if (totalMoney == '') {
        			totalMoney = 0;
        		}
        		this.$root.content.payByCompanyTotalMoney = totalMoney;
        		//设置显示值  
        		if(this.$root.$refs['payByCompanyTotalMoney']){
        			if(getClass(this.$root.$refs['payByCompanyTotalMoney'])=='Array'){//数组
						this.$root.$refs['payByCompanyTotalMoney'][0].value = moneyStringFixTwo(totalMoney);
					}else {//input元素
						this.$root.$refs['payByCompanyTotalMoney'].value = moneyStringFixTwo(totalMoney);
					}
        		}
        	},
        	/**
        	 * 计算总计（包括公司代付与个人实付） 
        	 */
        	calTotalMoney:function(key){
        		var totalMoney = '0'; 
        		var inDetail = this.$root.content.inDetail;
        		var ssdLength = inDetail.length;
        		for(var i=0;i<ssdLength;i++){
        			if(inDetail[i]){
        				if(inDetail[i].travelLongTransport){
        					totalMoney = sumStrings(totalMoney,inDetail[i].travelLongTransport[key]);
        				}
        				if(inDetail[i].travelLongTransportAirplane){
        					totalMoney = sumStrings(totalMoney,inDetail[i].travelLongTransportAirplane[key]);
        				}
        				if(inDetail[i].travelAllowance){
        					totalMoney = sumStrings(totalMoney,inDetail[i].travelAllowance[key]);
        				}
        				if(inDetail[i].travelCityTransport){
        					totalMoney = sumStrings(totalMoney,inDetail[i].travelCityTransport[key]);
        				}
        				if(inDetail[i].travelHospitalityExpense){
        					totalMoney = sumStrings(totalMoney,inDetail[i].travelHospitalityExpense[key]);
        				}
        				if(inDetail[i].travelHotelExpense){
        					totalMoney = sumStrings(totalMoney,inDetail[i].travelHotelExpense[key]);
        				}
        				if(inDetail[i].travelOtherExpense){
        					totalMoney = sumStrings(totalMoney,inDetail[i].travelOtherExpense[key]);
        				}
        			}
        		}
        		return totalMoney;
        	},
            /*             
             * 设置页面body滚动高度，用于显示隐藏二级页面时保持一级页面的高度
             * */
            setBodysrcTop:function(){
			    //关闭二级页面设置一级页面滚动位置
    			// $("body").css({
				//     'overflow':'auto',
				//     'position': 'static',
				//     'top': 'auto'
				// });
				// $("body").scrollTop($("body").attr("bodyScrTop"));

				// document.getElementsByTagName('html')[0].style.overflow = '';
				document.body.style.overflow = '';
				// document.body.scrollTop = document.body.getAttribute('data-scroll');
			}
        },
        watch:{
        	/** 
        	 * 监听二级明细个人实付数据
        	 * @param {Object} newVal
        	 * @param {Object} oldVal
        	 */
        	'travel.payByMyselfSubValue':function(newVal,oldVal){//
        		
        	},
        	/**
        	 * 监听二级明细公司代付数据
        	 * @param {Object} newVal
        	 * @param {Object} oldVal
        	 */
        	'travel.payByCompanySubValue':function(newVal,oldVal){//
        		
        	},
        	/**
        	 * 监听二级明细小计  
        	 * @param {Object} newVal
        	 * @param {Object} oldVal 
        	 */
        	'travel.subValue':function(newVal,oldVal){  
        	}, 
        	/** 
        	 * 监听值变化 删除明细时使用
        	 * @param {Object} newVal
        	 * @param {Object} oldVal 
        	 */
        	value:function(newVal,oldVal){
        		this.travel = JSON.parse(JSON.stringify(newVal));
        		if(this.travel.subValue){ 
        			this.subTotal = moneyStringFixTwo(this.travel.subValue);
        		}else{
        			this.subTotal = '0.00元';
        		}
        		if(this.travel.inDetail){
        			this.ssdLength = this.travel.inDetail.length; 
        		}else{
        			this.ssdLength = 0;
        		}
        	},
        	/**
        	 * 监听二级明细小计  
        	 * @param {Object} newVal
        	 * @param {Object} oldVal 
        	 */
        	'subTotal':function(newVal,oldVal){//   如果oldVal存在则减去oldVal再加上newVal 如果不存在则相加  需要增加大数相减的方法
        			
        	}, 
        	/**
        	 * 父组件控件组件显示隐藏标识      
        	 * @param {Object} newVal  新值
        	 * @param {Object} oldVal  旧值
        	 */
        	'subsidiaryFlag.show':function(newVal,oldVal){
        		var _this = this;
        		if(!this.subsidiaryFlag.show){//父组件隐藏子组件
        			if(this.ssdFlag&&!this.clickBtnFlag){//点击回退按钮   yg  
        				this.travel = JSON.parse(JSON.stringify(this.value));  
        				this.travel.inDetail = this.value.inDetail || [];  
        			}	
        			this.ssdFlag = false;					       			
        		}
        	},
        }
    }
</script>