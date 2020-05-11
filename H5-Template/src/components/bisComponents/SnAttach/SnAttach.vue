<template>
	<div>
		<cell v-if='showlength=="1" || title || selFlg=="1"' :title='title' value-align='left'>
	    	<div v-if='showlength=="1"' class="cellText"><span>{{previewAttachList.length}}张</span></div>
	    	<SnAttachBut v-if='selFlg=="1"' v-model='datanum'  v-on:onBeforeAddFunction='beforeAddFunction'
	    		v-on:onAddSuccessFunction='addSuccessFunction' 
	    		:imageUploadId='imageUploadId' ></SnAttachBut><!--selFlg==1：上传按钮显示，其他情况不显示-->
	    </cell>
	    <div class="fj-body"  v-if="previewAttachList.length>0" :data-num='datanum'>
			<div class="fj-list">
				<ul v-for="(item,index) in previewAttachList" :key="index">
					<li class="cursor_pointer" @click="downLoadFileReq(item,index) " >
						<span class="fj-photo" :class="item.fjClass"><!--fjClass：附件不同类型默认样式-->
							<!--上传附件的时候，通过imgpic自定义图片预览组件显示图片，下载附件的时候，通过imgsrc图片url来显示图片23344  -->
							<img v-if='item.imgpic || item.imgsrc' v-imgfid='item.imgpic' :src='item.imgsrc'> 
						</span>
						<span class="fj-name" :title='item.fullfileName'>{{item.fileName}}</span>
						<div :class="item.statusClass"></div><!--statusClass：附件上传过程中的状态样式-->
						<div v-if='item.delFg' class="fj-photo-del" @click.stop='delImg(item,index);'></div><!--delFg：删除按钮是否显示-->
						<div v-if='isPC' class="fj-redownload" @click.stop='reDownload(item,index);'></div><!--pc版本另存为按钮-->
					</li>
				</ul> 
			</div>
		</div>
		<a id="downloadhref" style="position: relative; z-index: 1;"></a>
	</div>
</template>
<style lang="less" src="./SnAttach.less"></style>
<script>
	import { cryptPost } from '../../../lib/common/base.js';
	import {showToast,isPC,CheckNetWork} from '../../../lib/common/extend.js';
	import {Cell} from 'vux';
	import AttachHandler from '../../../lib/AttachHandler.js';
	import SnAttachBut from '../SnAttachBut/SnAttachBut.vue';
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
        	/**
        	 * 附件选择之后，上传之前方法回调
        	 * @param {Object} _this
        	 * @param {Object} files
        	 */
        	beforeAddFunction:function(files){
        		var _this = this;
        		CheckNetWork(function(){
					var fCount = this.previewAttachList.length;
	       		    _this.fjAllCount = fCount;
		    	    if ((fCount + files.length) <= 9) {
		    	    	//_this.fjAllCount++;
						var msg = AttachHandler.formatApplyForPreview(_this.previewAttachList,files, _this.fjAllCount,fCount);
	            	    if (msg != '') {
	            	    	showToast(msg, 'middle');
	            	    }
		    	    } else {
	        			showToast('最多选择九个附件', 'middle');
	        			return;
	            	}
				},this);
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