<template>
	<div class="in_Content">
		<!--申请-->
		<cell :title="title" value-align="left" class="in_cell" v-if="showremove">
			<input class="in_input" ref="input"
				   type="text"
				   placeholder="请输入电子发票号码"
				   v-model="inputVal"
				   maxlength="8"
				   v-on:keyup.enter="enterInput"
				   v-on:input="inputFrtValue"
				   v-on:focus="focusFrtValue"
				   v-on:blur="blurFrtValue"/>
			<!--扫码icon-->
			<a class="scanicon" @click="scancode"></a>
		</cell>
		<div class="in_numbox" v-if="showremove">
			<div class="in_numlist">
				<div class="in_num" v-for="(item,index) in numlist" @click="editnum(item,index)"><span>{{item}}</span><i
						v-if="showremove" @click.stop="removenum(item,index)"></i></div>
			</div>
		</div>
		<!--审批 详情-->
		<cell :title="title" value-align="left" class="in_cell" v-if="!showremove"
			  @click.native="showNumbox = !showNumbox">
			<span>{{numlist.length}}个</span><em class="button-icon-invoice" :class="showNumbox?'up':''" v-show="numlist.length>0"></em>
		</cell>
		<div class="in_numbox slide" v-if="!showremove" :class="!showNumbox?'animate':''">
			<div class="in_numlist">
				<div class="in_num" v-for="(item,index) in numlist" @click="editnum(item,index)"><span>{{item}}</span><i
						v-if="showremove" @click.stop="removenum(item,index)"></i></div>
			</div>
		</div>

		<div v-transfer-dom>
			<confirm v-model="showConfirm"
					 class="in_Confirm"
					 title="编辑电子发票号码"
					 ref="confirm"
					 @on-cancel="onCancel"
					 @on-confirm="onConfirm"
					 @on-show="onShow"
					 @on-hide="onHide">
				<input class="confirm_input" type="text" maxlength="8" v-on:input="confirmFrtValue" placeholder="请输入电子发票号码" v-model="confirmCode" />
			</confirm>
		</div>
	</div>
</template>

<script>
    import {isPC,getClass,showToast} from '../../../lib/common/extend.js';
    import {QrcodeScan} from '../../../lib/common/SnJsBridge.js';
    import { ApplyApproveData } from '../../../pages/approval/ApprovalConstantData.js';
    import { Group,Cell,Confirm } from 'vux';
    export default {
        components: {
            Group,
            Cell,
            Confirm
        },
        data:function(){
            return {
                inputVal:'',
                scanVal:'',
                numlist:[],
                showConfirm:false,
                confirmCode:null,
				editIndex:null,
				showremove:true,//显示删除按钮
                showNumbox:true
            }
        },
        computed:{
            //传给服务器的值
			numlistRes(){
			    return this.numlist.join(',');
			}
        },
        props: {
            title:{ //title
                type:String,
                default: ""
            },
            value:{
                type:Number
            },
            applyApproveType:{
                type:Number
            },
        },
        created:function () {
            var _this = this;
			if(!!_this.value){
			    _this.numlist = _this.value.split(',');
			}
			_this.showremove = _this.applyApproveType==ApplyApproveData.APPLYTYPE?true:false;
        },
        methods: {
            /**
             * input框回车、输入事件
             **/
            enterInput(){
                let _this = this;
				if(!!_this.inputVal&&_this.inputVal.length==8){
				    _this.numListPush(_this.inputVal)
				}else{
                    showToast('请输入正确的电子发票号码');
				    return;
				}
                _this.inputVal = null;//清空输入框
            },
            /**
             * input输入时对数据进行格式化
             * @param {Object} value
             */
            inputFrtValue(){
                let value = this.inputVal;
                if(!!value) {
                    let result = this.formatInvoiceNum(value,8).replace(/[^\d]/g,'');//格式化数字，不允许输入非数字字符
                    this.inputVal = result;
                }
                if(value.length == 8){
                    this.enterInput();
				}
            },
            /**
             * input输入时对数据进行格式化
             * @param {Object} value
             */
            confirmFrtValue(){
                let value = this.confirmCode;
                if(!!value) {
                    let result = this.formatInvoiceNum(value,8).replace(/[^\d]/g,'');//格式化数字，不允许输入非数字字符
                    this.confirmCode = result;
                }
            },
            /**
             * 获取焦点时对数据进行格式化
             */
            focusFrtValue:function(){
                let value = this.inputVal;
            },
            /**
             * 失去焦点时对数据进行格式化
             */
            blurFrtValue(){
                let value = this.inputVal;
                if(!!value) {
                    this.enterInput()
                }
            },
            /**
             * 扫码事件
             */
            scancode(){
				let _this = this;
                QrcodeScan().then(function (res) {
					if(!!res){
						let scanCodeArr = res.split(',');
						let scanCode = scanCodeArr[3]||null;
						if( !!scanCode && 'Number'==getClass(Number(scanCode)) && scanCode.length==8){
                            let invoiceNum = _this.formatInvoiceNum(scanCode,8).replace(/[^\d]/g,'');//格式化数字，不允许输入非数字字符
							_this.scanVal = invoiceNum;
                            //showToast(invoiceNum);
							_this.numListPush(invoiceNum)
						}else{
                            showToast('请扫描正确的发票二维码')
						}
					}
                })
			},
			numListPush(value){
                let _this = this;
                if( _this.numlist.length<100&&!!value ){
                    _this.numlist.unshift( value );
                }else{
                    showToast('发票号最多可加入100个');
                    console.log( _this.numlist.length ) //发票号最多100个
                }
			},
            /**
             * 编辑选中的发票号
             */
            editnum(item,index){
                let _this = this;
                if(_this.showremove){ //申请时可编辑，审批 详情不可编辑
					_this.editIndex = index;
                    _this.beforeShowConfirm(item);
				}
            },
            /**
             * 编辑选中的发票号弹窗
             */
            beforeShowConfirm(value){
                let _this = this;
                _this.confirmCode = value;
                _this.showConfirm = true;
            },
            /**
             * 弹窗确定
             */
            onConfirm(value){
                let _this = this;
                if( !!_this.confirmCode && 'Number'==getClass(Number(_this.confirmCode)) && _this.confirmCode.length==8){
                    _this.numlist.splice(_this.editIndex,1,_this.confirmCode)
                }else{
                    showToast('请输入正确的电子发票号');
                    return false;
				}
            },
            /**
             * 删除选中的发票号
             */
            removenum(item,index){
                let _this = this;
                console.log('removenum:'+item);
                _this.numlist.splice(index, 1)
            },
			/**
			 * 发票号码格式化
			 * */
			formatInvoiceNum(value,integerLength,decimalLength){
			    if(!value){
			        return;
				}
                var value = (value+'').replace(/[^\d.]/g,"").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");//去掉非数字字符
                var integerLength = integerLength || 14;//整数长度
                var decimalLength = decimalLength || 0;//小数长度
                var maxLength = decimalLength == 0 ? integerLength:(integerLength+decimalLength+1);//最大长度为整数长度+小数长度+1
                if(value.length>maxLength){
                    value = (value).slice(0,maxLength)
                }
                return value;
            },
        },
        watch:{
            numlistRes(newVal,oldVal){//监听numlistRes变化
                this.$emit('input', newVal);//控件返回值
            }
        }
    }
</script>
<style lang="less" scoped>
	@import '../../style/variables.less';
	.position-horizontal-demo {
		position: relative;
		height: 100%;
	}
	.popupDebit {overflow-y: scroll!important;}
	.position-horizontal-demo{}
	.popupInput{background: rgba(255,255,255,0);}
	::-webkit-scrollbar:horizontal {height: 0!important;}
	.boxanimate {
		max-height: 9999px;
		transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
		transition-delay: 0s;
	}
	.fade-enter-active, .fade-leave-active {
		//transition: opacity .5s;
		max-height: 9999px;
		transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
		transition-delay: 0s;
	}
	.fade-enter, .fade-leave-to {
		height: 0px;
		opacity: 0;
	}

	.in_Content{
		.in_cell{
			color: #191919;
			.in_input{
			}
			.vux-label {
				width: 1.9rem !important;
				padding-right: 0.2rem;
				/*display: inline-block;*/
				text-align: right;
			}
			label {
				width: 1.9rem !important;
				padding-right: 0.2rem;
				/*display: inline-block;*/
				text-align: right;
			}
			.in_button{
				position: absolute;
				width: 0.9rem;
				height: 0.9rem;
				top: 50%;
				right: 0.06rem;
				margin-top: -0.45rem;
				display: inline-block;
				vertical-align: middle;
				cursor: pointer;
				font-size: 0.32rem;
				line-height: 0.9rem;
				color: @color-blue;
				text-align: center;
			}
			.scanicon{
				position: absolute;
				width: 0.9rem;
				height: 0.9rem;
				top: 50%;
				right: 0.06rem;
				margin-top: -0.45rem;
				background: url(../../../resource/img/scanicon.png) no-repeat center;
				background-size: 0.42rem 0.42rem;
				display: inline-block;
				vertical-align: middle;
				cursor: pointer;
			}
		}
		.in_numbox {
			padding: 0 .1rem 0 .11rem;
			border-top: 0 solid #999999!important;
			.in_numlist {
				margin-left: 1.87rem;
				//padding-top: .2rem;
				span {
					display: inline-block;
					max-width: 3.75rem;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				i {
					position: absolute;
					right: -0.1rem;
					top: -0.1rem;
					display: inline-block;
					width: 9px;
					height: 9px;
					background: url("../../../resource/img/del-3.png") no-repeat;
					background-size: contain;
				}
			}
			.in_num {
				position: relative;
				display: inline-block;
				border: 1px solid #e6e6e6;
				border-radius: 0.05rem;
				height: 0.4rem;
				line-height: 0.4rem;
				padding: 0.03rem 0.1rem;
				font-size: 0.3rem;
				color: #7f7f7f;
				margin: 0.1rem 0.1rem;
				min-width: 1.5rem;
				text-align: center;
				&:before {
					display: block;
					position: absolute;
					left: 0.1rem;
					top: 0;
					height: 0.44rem;
					line-height: 0.44rem;
					padding: 0;
					font-size: 0.3rem;
				}

			}

		}
		.in_Confirm{
			.confirm_input{
				font-size: .32rem;
				margin-top: .1rem;
				padding: .1rem;
				width: 85%;
				box-sizing: content-box;
				background: transparent;
				border: 1px solid #e2e3e4;
				border-radius: 5px;
			}
		}
		.weui-cell:before{
			display: none !important;
		}
		.weui-cell__ft{
			border: none;
			padding: 0 !important;
		}
		.slide {
			overflow: hidden;
			max-height: 0;
			transition: max-height .8s cubic-bezier(0, 1, 0, 1) -.1s;
		}
		.animate {
			max-height: 9999px;
			transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
			transition-delay: 0s;
		}
		.button-icon-invoice {
			position: absolute;
			width: 0.9rem;
			height: 0.9rem;
			top: 50%;
			right: 0.06rem;
			margin-top: -0.45rem;
			background: url("../../../resource/img/icon_narrow_up.png") no-repeat center;
			background-size: 0.42rem 0.42rem;
			display: inline-block;
			vertical-align: middle;
			cursor: pointer;
		}
		.button-icon-invoice.up{
			background: url("../../../resource/img/icon_narrow_down.gif") no-repeat center;
			background-size: 0.42rem 0.42rem;
		}
	}

	@media screen and (min-width: @pc-width) {
		.in_Content{
			.in_cell{
				font-size: 14px !important;
				line-height: 28px !important;
				color: #191919;
				.in_input {

				}
				.vux-label {
					/*display: inline-block;*/
					width: 85px !important;
					padding-right: 14px;
					text-align: right;
				}
				label {
					/*display: inline-block;*/
					width: 85px !important;
					padding-right: 14px;
					text-align: right;
				}
				.in_button{
					position: absolute;
					width: 30px;
					height: 30px;
					top: 50%;
					right: 55px;
					margin-top: -15px;
					display: inline-block;
					vertical-align: middle;
					cursor: pointer;
					font-size: 14px;
					line-height: 30px;
					text-align: center;
				}
				.scanicon{
					//display: none!important;
					position: absolute;
					width: 30px;
					height: 30px;
					top: 50%;
					right: 55px;
					margin-top: -15px;
					background: url(../../../resource/img/scanicon.png) no-repeat center;
					background-size: 21px 21px;
					display: inline-block;
					vertical-align: middle;
					cursor: pointer;
				}
			}

			.in_numbox {
				padding: 0 100px 0 106px;
				border-top: 0 solid #999999!important;
				.in_numlist {
					margin-left: 0;
					span {
						display: inline-block;
						max-width: 290px;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						cursor: pointer;
					}
					i {
						position: absolute;
						right: -5px;
						top: -5px;
						display: inline-block;
						width: 9px;
						height: 9px;
						background: url("../../../resource/img/del-3.png") no-repeat;
						background-size: contain;
						cursor: pointer;
					}
				}
				.in_num {
					position: relative;
					display: inline-block;
					border: 1px solid #e6e6e6;
					border-radius: 4px;
					height: 22px;
					line-height: 22px;
					padding: 1px 8px;
					font-size: 14px;
					color: #7f7f7f;
					margin: 0 4px;
					min-width: 56px;
					&:before {
						display: block;
						position: absolute;
						left: 0px;
						top: 0px;
						height: 22px;
						line-height: 22px;
						padding: 0;
						font-size: 14px;
					}
				}

			}
			.in_Confirm{
				.weui-dialog{
					width: 60%!important;
					margin: 0 20%!important;
				}
				.confirm_input{
					font-size: 14px;
					margin-top: 5px;
					padding: 10px;
					width: 85%;
					box-sizing: content-box;
					background: transparent;
					border: 1px solid #e2e3e4;
					border-radius: 3px;
				}
			}
			.weui-cell__ft{
				padding-right: 0;
			}
			.button-icon-invoice {
				position: absolute;
				width: 30px;
				height: 30px;
				top: 50%;
				right: -5px;
				margin-top: -15px;
				background: url("../../../resource/img/icon_narrow_up.png") no-repeat center;
				background-size: 22px 22px;
				display: inline-block;
				vertical-align: middle;
				cursor: pointer;
			}
			.button-icon-invoice.up{
				background: url("../../../resource/img/icon_narrow_down.gif") no-repeat center;
				background-size: 22px 22px;
			}

		}
	}

</style>