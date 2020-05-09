
import MstpFileHandler from './MstpFileHandler.js';
import { FjClassMap } from '../config/attach_config.js'
/**
 * 附件上传和显示js管理
 */

var test = {};
var AttachHandler = function () {
}
var tsInd = 0;
AttachHandler.prototype = {
	/**
	 * 上传的附件名称处理方法
	 * @param {Object} name  原始名称
	 */
	getFjName:function(name,index) {
		var _this = this;
		var extension = _this.fileExtensionCheck(name)
		var fileName = '';
		if (extension == "IMG") {
			fileName = '图片' + index;
		} else {
			var arr = name.split(".");
			fileName = name.substring(0, name.length-(arr[arr.length-1].length)-1);
			if (fileName.length > 5) {
				fileName = fileName.substring(0,4) +"...";
			} 
		}
		return fileName;
	},
	/**
	 * 文件类型判断
	 * @param {Object} fileName  原始名称
	 * */
	fileExtensionCheck:function(fileName) {
		var extension = "";
		var arr = fileName.split(".");
		var houzui = arr[arr.length-1];
		if ("jpg".compare(houzui) 
			|| "png".compare(houzui)) {
			extension = "IMG";
		}
		return extension;
	},
	/**
	 * 申请页面上传附件后获取附件预览数据
	 * @param {Object} previewAttachList
	 * @param {Object} files
	 * @param {Object} index
	 */
	formatApplyForPreview:function(previewAttachList, files, applyIndex, defaultIndex){
       	window.URL = window.URL || window.webkitURL;
       	//申请页面对于图片类型的附件，要带上下标并且不能重复，存在删除附件，保存草稿后再添加，删除附件等场景
       	if (tsInd < applyIndex) {
       		tsInd = applyIndex; 
       	}
       	var _this = this;
       	var retMsg = '';
       	if (!!files) {
       		for (var i=0;i<files.length;i++) {
	        	var file = files[i];
	        	var extensions = _this.fileExtensionCheck(file.name);
				if (extensions != 'IMG') {
					retMsg = '附件只支持jpg，png 图片文件'; 
					break;
				}
				var fileSize = (file.size/1024).toFixed(0);
				//如果附件的大小为0或者为undefined，则表明附件异常
				if (!fileSize || fileSize == 0) {
					retMsg = '您选择的附件异常，请重新选择';
					break;
				}
				//文件要小于10M
				if (fileSize > 10240) {
					retMsg = '请选择小于10M的附件';
					break;
				}
				if (file.name.split(".").length == 1) {
					retMsg = '不支的文件类型';
					break;
				} 
			}
       		if (retMsg == '') {
       			_this.getPreviewAttachList(previewAttachList, files, null, defaultIndex);
       		}
       	}
       	return retMsg;
	},
	/**
	 * 详情页面，审批页面将服务器中获取的附件数据转换成组件显示需要的数据
	 * @param {Object} attachDetailList  服务器获取到的附件数据
	 */
	formatDetailForPreview:function(attachDetailList){
		var _this = this;
		var preList = new Array();
		if (!!attachDetailList) {
			preList = _this.getPreviewAttachList(preList, null, attachDetailList);
		}
		return preList;
	},
	/**
	 * 获取附件预览数据列表
	 * @param {Object} previewAttachList
	 * @param {Object} files
	 * @param {Object} fileDataList
	 */
	getPreviewAttachList:function(previewAttachList, files, fileDataList, defaultIndex) {
		var _this = this;
	    var fileDetailBaseObj = {
			'nativeFile':'',//文件的原始对象
			'transactionId':'',
			'fileId':'',
			'fjClass':'',//附件的默认样式
			'statusClass':'',//上传状态的样式（上传中，上传完成，上传失败）
			'fileName':'',
			'fullfileName':'',
			'fileSize':''
		};
		//files对象不为空，说明是由申请页面上传上来的file对象
		if (files != null && files != undefined) {
			for (var i=0;i<files.length;i++) {
				defaultIndex++;//此处有bug，
	        	var file = files[i];
	        	var extensions = _this.fileExtensionCheck(file.name);
				var fileDetailObj = {};
				fileDetailObj['nativeFile'] = file.nativeFile;
				fileDetailObj['transactionId'] = file.transactionId;
				fileDetailObj['fjClass'] = FjClassMap[extensions];
				fileDetailObj['statusClass'] = 'fj-photo-loading'; 
				fileDetailObj['fileName'] = _this.getFjName(file.name, defaultIndex);
				fileDetailObj['fullfileName'] = file.name;
				fileDetailObj['fileSize'] = ((file.size/1024)/1024).toFixed(0);
				fileDetailObj['delFg'] = 0; //不需要显示删除按钮
				//如果是图片文件，给对象传递imgpic为file的object，可以生成预览图片
	    		if (extensions == "IMG") {
	    			fileDetailObj['imgpic'] = file.nativeFile;
	    		}
	    		if (previewAttachList.length == 0) {
	    			previewAttachList.push(fileDetailObj);
	    		} else {
	    			previewAttachList.splice(0,1,fileDetailObj);
	    		}
			}
		} else if(fileDataList != null && fileDataList != undefined) {
			for (var i=0;i<fileDataList.length;i++){
				var fileDataObj = fileDataList[i];
				var fileDetailObj = {};
				for(var key in fileDataObj){
					var attachObj = fileDataObj[key];
					//如果attachObj格式不正确
					if(attachObj.fileName){
						var extensions = _this.fileExtensionCheck(attachObj.fileName);
	        		
		        		fileDetailObj['fileId'] = attachObj.fileId;
		        		fileDetailObj['fjClass'] = FjClassMap[extensions];
		        		fileDetailObj['fileName'] = _this.getFjName(attachObj.fileName,i+1);
                        fileDetailObj['fullfileName'] = attachObj.fileName;
                        debugger;
		        		if (extensions == "IMG") {
		        			console.log("MstpFileHandler.downloadFileUrl = "+MstpFileHandler.downloadFileUrl);
		        			console.log("attachObj.fileId = "+attachObj.fileId);
			    			fileDetailObj['imgsrc'] = MstpFileHandler.downloadFileUrl(attachObj.fileId);
		        			console.log("url = "+MstpFileHandler.downloadFileUrl(attachObj.fileId));
			    		}
		        		fileDetailObj['fileSize'] = attachObj.fileSize.replace(/[a-zA-Z]/g,"")*1024*1024;
					}
				} 
				//如果fileDetailObj不为空则添加
				if(fileDetailObj){
					previewAttachList.push(fileDetailObj);
				}
        	}
		}
		return previewAttachList;
	}
}

export default new AttachHandler();


