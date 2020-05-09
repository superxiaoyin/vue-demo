<template>						
	<div class="attachNew" :data-num='datanum'>
		<label>{{title}}</label>
			<div v-if='selFlg=="1"' class="imgButton" @click.native="selFileBt(1);"><!--selFlg==1：上传按钮显示，其他情况不显示-->
				<a class="attach" href='javascript:;' id='imageUploadId'></a><!--imageUpload1：上传附件绑定事件对象-->
			</div>	
		</div>	
</template>
<script>
	import './SnAttachNew.less';
	import { cryptPost } from '../../../lib/common/base.js';	
	import { FilePreviewWidget ,GetUserInfoFunction} from '../../../lib/common/SnJsBridge.js';
	import {showToast,isPC,CheckNetWork} from '../../../lib/common/extend.js';
	import {ToastPlugin,Cell} from 'vux';
	import MstpFileHandler from '../../../lib/common/MstpFileHandler.js';
	import AttachHandler from '../../../lib/common/AttachHandler.js';
	import Base64 from '../../../lib/base64.js';

	Vue.use(ToastPlugin);
    export default {
    	components: {
		    Cell
	    },
	    model: {
	    	event:'seUploadFileList'//子组件向父组件传值
	    },
        props: {
        	title:{//title
        		type:String
        	},
            previewAttachList:{//附件预览显示数据列表
                type:Array,
                default:[]
            },
            selFlg:{//是否显示删除按钮
            	type:String,
            	default:'1'
            },
            datanum:{//明细detail number
            	type:Number,
            	default:1
            },
            seUploadFileList:{//content需要的传递给服务器的数据list
            	type:Array,
                default:[]
            },
            value:{
                type:Array,
                default:[]
            },
            isInDetailFlag:{//是否明细组件 默认为否
            	type:Boolean,
            	default:false
            },
            idx:{ //明细组件的index
            	type:Number
            },
            logoImgUrl:{//初始化图标
            	type:String,
            },
        },
        data:function(){
        	return {
        		datanum:1,
        		previewAttachList:Array || 0,
				fjAllCount:0,
				defaultImg:true,
        	}
        },
        beforeCreate: function(){

        },
        created:function () {
		
        },
        mounted:function(){//组件渲染生成dom
        	var _this = this;
        	if (_this.value.length > 0) {//草稿内容读取
				_this.previewAttachList = AttachHandler.formatDetailForPreview(_this.value);
				_this.previewAttachList.forEach(function(item,index){
            		item['delFg'] = '1';//读取草稿的时候需要显示删除按钮
            		_this.previewAttachList[index] = item;
            	});
            	if(_this.isInDetailFlag){//明细
					_this.seUploadFileList = _this.$root.content.inDetail[_this.idx].imageUpload_final;
				} else {
					_this.seUploadFileList = _this.$root.content.imageUpload_final;
				}
        	}
        	
        	GetUserInfoFunction().then(function(Data){
				if(!!Data){
					MstpFileHandler.mtoken = JSON.parse(Data.token);
					MstpFileHandler.initUpload({
		        		id:'imageUploadId',
		        		beforeAddFunction:function(files){
                            console.log(files);
		        			_this.addBeforeFunction(_this,files);
		        		},
		        		succFunction:function(file, fileId){
		        			_this.addSuccessFunction(_this, file, fileId);
		        		}
		        	});
				//	_this.initData();
				}							
           	})
        	
/*        	if(!!!MstpFileHandler.mtoken){
				cryptPost('openAccount/getToken.do').then(function (result) {
				    if(!!result){
				        var token = result;
						MstpFileHandler.mtoken = token;						
						MstpFileHandler.initUpload({
			        		id:'imageUpload'+(_this.idx || 0),
			        		beforeAddFunction:function(files){
			        			_this.addBeforeFunction(_this,files);
			        		},
			        		succFunction:function(file, fileId){
			        			_this.addSuccessFunction(_this, file, fileId);
			        		}
			        	});
				    }
				});        		
        	}else{*/
     		
        	/*}*/
        		

        },
        /**
         * 监听父组件传值给子组件
         */
        watch:{
        	value:function(oldVal,newVal){ //主要供明细控件删除使用
				var _this = this;
				if(_this.$parent.delInDetailFlag){//明细控件删除
					//判断value类型
					if(_this.$root.content.inDetail[_this.idx].imageUpload_final){
						_this.seUploadFileList = _this.$root.content.inDetail[_this.idx].imageUpload_final;
						_this.refreshImgList();
					}else{
						_this.seUploadFileList = [];
						_this.previewAttachList = [];
					}
					_this.$parent.delInDetailFlag = false;
				} 
			},
			logoImgUrl:function(oldVal,newVal){
				this.defaultImg = false;
				var imgShowUrl = '';
				if(this.logoImgUrl.indexOf('http')>=0 || this.logoImgUrl.indexOf('defaultcpy_icon.png')>=0){
					imgShowUrl = this.logoImgUrl;
				}else{
					var imgShowUrl = MstpConf.ipAddress + '/file/anonymousDownload?fileId='+this.logoImgUrl;
				}
        		this.previewAttachList = [{imgsrc:imgShowUrl}];
        		$('#imageUploadId').css('background-image','url('+imgShowUrl+')');
			}
        },
        methods: {
        	/**
        	 * 附件选择之后，上传之前方法回调
        	 * @param {Object} _this
        	 * @param {Object} files
        	 */
        	addBeforeFunction:function(_this, files){
        		CheckNetWork(function(){
					var fCount = this.previewAttachList.length;
	       		    _this.fjAllCount = fCount;
		    	    //if ((fCount + files.length) <= 1) {
		    	    	//_this.fjAllCount++;
						var msg = AttachHandler.formatApplyForPreview(_this.previewAttachList,files, _this.fjAllCount,fCount);
	            	    if (msg != '') {
	            	    	showToast(msg, 'middle');
	            	    }
		    	    //} else {
	        			//showToast('最多选择一个附件', 'middle');
	        			//return;
	            	//}
				},this);
        	},
        	/**
        	 * 附件上传成功方法回调
        	 * @param {Object} _this
        	 * @param {Object} file
        	 * @param {Object} fileId
        	 */
        	addSuccessFunction:function(_this, file, fileId){
        		console.log("file  transactionId: ", file.transactionId);
                console.log("upload success fileId: ", fileId);
                $('#imageUploadId').css('background-image','url('+ MstpConf.ipAddress + '/file/anonymousDownload?fileId='+ fileId+')');
        		for (var i = 0; i < _this.previewAttachList.length; i++) {
        			var fileDetailObj = _this.previewAttachList[i];
        			if (file.transactionId == fileDetailObj.transactionId) {
        				fileDetailObj['fileId'] = fileId;
        				fileDetailObj['statusClass'] = '';
						fileDetailObj['delFg'] = 1; //需要显示删除按钮
        				//_this.previewAttachList[i] = fileDetailObj;
        				var seIndex = (i+1);//删除的情况，该index需要重新获取
        				var seUpObjkey = 'imageUpload_yuyue_' + this.datanum +'_'+ seIndex;
		        		var seUpObjValue = {
		        			'fileSize': fileDetailObj.fileSize,
		        			'fileId': fileId,
		        			'fileName': fileDetailObj.fullfileName
		        		}
		        		var seUploadObj = {};
		        		seUploadObj[seUpObjkey] = seUpObjValue;
		        		
		        		if (_this.seUploadFileList.length == 0) {
		        			_this.seUploadFileList.push(seUploadObj);
			    		} else {
			    			_this.seUploadFileList.splice(0,1,seUploadObj);
			    		}
        			}
        		}
        	
        		this.defaultImg = false;
        		this.$emit('seUploadFileList', _this.seUploadFileList);//content需要的传递给服务器的数据list
        		
        	},
        	/**
        	 * 附件点击预览方法
        	 * @param {Object} item ： previewAttachList
        	 */
        	selFileBt:function(num){
        		this.datanum = num;
        	},
        	/**
        	 * 附件点击预览方法
        	 * @param {Object} item ： previewAttachList 
        	 */
			downLoadFileReq:function(item, index){
				CheckNetWork(function(){
					var fileId = item.fileId;
					if (!fileId || fileId == '') {
						return;
					}
					var dlUrl = MstpFileHandler.downloadFileUrl(fileId);
			        var previewUrl = MstpFileHandler.previewFileUrl(fileId);
					var previemJson = {
							"fileId":fileId,
							"previewUrl":previewUrl,
							"downloadUrl":dlUrl,
							"fileSize":parseFloat(item.fileSize),
							"fileName":item.fullfileName || item.fileName
						}
					if (isPC()) {
						$("#downloadhref").attr("href",dlUrl);
					    var ev = document.createEvent('MouseEvents');
						 // initMouseEvent的参数比较多，可以参见API文档
						 // https://developer.mozilla.org/en-US/docs/Web/API/event.initMouseEvent
						ev.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
						document.getElementById('downloadhref').dispatchEvent(ev); //pc不支持要click()方法，要自己实例化一个事件对象，然后模拟触发
						$("#downloadhref").attr("href","");
					} else {
						FilePreviewWidget(previemJson);
					} 
				},this);
			},
			/**
			 * 删除图片 //阻止事件冒泡 使用stop方法
			 * @param {Object} index, item
			 */
			delImg:function(item, index){
				var _this = this;
				_this.previewAttachList.splice(index, 1);
				if (!!item.fileId) {//如果文件已经上传成功，则需要删除seUploadFileList中的对象
					for (var i = 0; i < _this.seUploadFileList.length; i++) {
						for (var key in _this.seUploadFileList[i]) {
							if (item.fileId == _this.seUploadFileList[i][key].fileId) {
	        					_this.seUploadFileList.splice(i, 1);
	        					break;
	        				}
						}
					}
					this.$emit('seUploadFileList', _this.seUploadFileList);//content需要的传递给服务器的数据list
				}
				_this.refreshImgList();
			},
			/**
			 * 刷新图片列表
			 */
			refreshImgList:function(){
				var _this = this;
				_this.previewAttachList = AttachHandler.formatDetailForPreview(_this.seUploadFileList);
				_this.previewAttachList.forEach(function(item,index){
            		item['delFg'] = '1';//读取草稿的时候需要显示删除按钮
            		_this.previewAttachList[index] = item;
            	});
			},
			/**
			 * 判断附件是否全部上传成功
			 */
			transCompletedflg:function() {
				var comflg = true;
				if (this.previewAttachList.length > this.seUploadFileList.length) {
	           		comflg = false;
	           	}
				return comflg;
			}
        }
    }
</script>


