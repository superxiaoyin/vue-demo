<template>
	<div>
		<img :ref="attImg" src="../../../resource/img/openaccount/icon_idcard_front.png" class="idcard-front" @click.native="getPhoto"/>
		<!-- <cell style="display:none;">
	    	<SnAttachBut :ref="attBtn" v-model='datanum'  v-on:onBeforeAddFunction='beforeAddFunction'
	    		v-on:onAddSuccessFunction='addSuccessFunction' 
	    		:imageUploadId='imageUploadId' ></SnAttachBut>
	    </cell> -->
		<input :ref="attBtn" style="display:none;" type="file" accept="image/*" @change="imgDisplay()">
	</div>
</template>
<style lang="less" src="./SnAttachOpenA.less"></style>
<script>
	import { cryptPost } from '../../../lib/common/base.js';
	import {showToast,isPC,CheckNetWork} from '../../../lib/common/extend.js';
	import {Cell} from 'vux';
	import AttachHandler from '../../../lib/AttachHandler.js';
	import MstpFileHandler from "../../../lib/MstpFileHandler.js";
	import { sendPost } from "sslib/common/HttpProtocol.js";
	import SnAttachBut from '../SnAttachButOpenA/SnAttachButOpenA.vue';
    export default {
    	components: {
		    Cell,
		    SnAttachBut
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
            showlength:{//是否显示张数
            	type:String,
            	default:1
			},
			attBtn:{
				type:String,
				default:'frontFile'
			},
			attImg:{
				type:String,
				default:'front'
			}
        },
        data:function(){
        	return {
        		datanum:1,
        		previewAttachList:Array || 0,
				fjAllCount:0,
				imageUploadId:'imageUpload0',//附件DOM索引
				isPC:isPC(),//是否pc客户端
        	} 
        },
        beforeCreate: function(){
        },
        created:function () {
        	this.imageUploadId = 'imageUpload' + (this.idx || 0);
        	if(this.isInDetailFlag){//明细
        		this.previewAttachList = [];
        		this.seUploadFileList = [];
        	}
        },
        mounted:function(){//组件渲染生成dom
        	var _this = this;
            console.log("SnAttach mounted==========================");
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
			setTimeout(function(){
				// 遍历数据并且初始化MSTP
				_this.initToken();
			},500)
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
			} 
        },
        methods: {
			// 初始化Mstp
			initMstp: function(upId) {
				let _this = this;
				var MstpConf = {
					// 根据不同的环境，此处的url地址不同
					ipAddress: result.data.MSTP_FS_ipAddress,
					previewAddress: result.data.MSTP_FS_previewAddress,
					loglevel: 6,  //日志级别
					inintMstpParam: function () {
						var initOption = {
							appId : _this.tokenData.appId,
							mstpId : _this.tokenData.mstpId,
							exptime : _this.tokenData.exptime,
							creationTime : _this.tokenData.creationTime,
							signature : _this.tokenData.signature,
							url : 'https://lzccbuat.sinosun.com:11443/mstp',
							log_level : this.loglevel// 日志级别
						};
						// 初始化SDK
						Mstp.initSdk(initOption);
						Mstp.uploader({
							browse_button: upId,
							chunk_size: 4 << 20, // 4M
							anonymous: 1, // 是否允许该文件匿名下载
							filters: {
								mime_types: [
									// { title: "files", extensions: "xls" },
									// { title: "files", extensions: "xlsx" },
									// { title: "files", extensions: "txt" }
								],
								max_file_size: '10240kb'
							},

							//  beforeAddFunction: function(files) {
							//     _this.addBeforeFunction(_this, files);
							// },
							// succFunction: function(file, fileId) {
							//     _this.addSuccessFunction(_this, file, fileId);
							// },
							onUploadFilesAdded: function(files) {
								_this.addBeforeFunction(_this, files);
								// if(!!files && files.length>0){
								//     let PluploadFile = files[0];
								//     _this.fileName = PluploadFile.name;
								//     _this.importFileShow = true;
								// }
							},
							onUploadProgress: function(file, progress) {
							
							},
							onUploadSuccess: function(file, fileId) {
								// _this.upFileId = fileId;
								// console.log(fileId);
								_this.addSuccessFunction(_this, file, fileId);
							},
							onUploadFail: function(file, errorCode) {
								Common.toast('出错了，请重新操作。');
							}
						});
					},
				};
				console.log("window.MstpConf", MstpConf);
				window.MstpConf = MstpConf || {};
			},  
			/**
			 * Mstp token初始化
			 */
			initToken: function () {
				let _this = this;
				return new Promise(function (res, rej) {
					//预约开户从服务器取token        
					sendPost('GET','https://lzccbuat.sinosun.com:11443/SSP-HTTP/reservation.getToken').then(function (result) {
						if(!!result){
							_this.tokenData = result.data;
							MstpFileHandler.mtoken = _this.tokenData;		
							_this.initMstp(_this.imageUploadId);
						}
					});                          
				})
			},
        	/**
        	 * 附件选择之后，上传之前方法回调
        	 * @param {Object} _this
        	 * @param {Object} files
        	 */
        	beforeAddFunction:function(files){
        		var _this = this;
        	},
        	/**
        	 * 附件上传成功方法回调
        	 * @param {Object} _this
        	 * @param {Object} file
        	 * @param {Object} fileId
        	 */
        	addSuccessFunction:function( file, fileId){
        		console.log("file  transactionId: ", file.transactionId);
                console.log("upload success fileId: ", fileId);
                var _this = this;
				AttachHandler.getSuceUploadFileList(_this.previewAttachList,file, fileId, _this.seUploadFileList, _this.datanum);
				_this.imgDisplay(_this.previewAttachList);
        		this.$emit('seUploadFileList', _this.seUploadFileList);//content需要的传递给服务器的数据list
			},
			getPhoto(){
				let _this = this;
				_this.$refs[_this.attBtn].dispatchEvent(new MouseEvent('click'));
			},
			imgDisplay:function(files){
				let _this = this;
				this.fil = files;
				let img = {};
				for (let i=0; i < this.fil.length; i++) {
					let size = Math.floor(this.fil[i].size / 1024);
					if (size > 5*1024*1024) {
						alert('请选择5M以内的图片！');
						return false
					}
					this.imgLen++;
					let url = this.fil[i].imgsrc;
					_this.$refs[_this.attImg].src = url;
					Mstp.uploadFile(this.fil[i]);
				}
				// _this.$refs.front.src = JSON.parse(frontData[0].value).photoBase64;
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
					AttachHandler.previewDownLoadFile(item, index);
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
				AttachHandler.refreshImgList(_this.previewAttachList);
			},
			/**
			 * 另存为  保存文件到本地
			 * @param {Object} item
			 * @param {Object} index
			 */
			reDownload:function(item, index) {
				CheckNetWork(function(){
					AttachHandler.previewDownLoadFile(item, index, true);
				},this);
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