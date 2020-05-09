/**
 * Created by liuyuzhe on 2017/5/2.
 */
(function( global ) {

function MstpJsSDK() {
    var that = this;

    this.detectIEVersion = function() {
        var v = 4,
            div = document.createElement('div'),
            all = div.getElementsByTagName('i');
        while (
            div.innerHTML = '<!--[if gt IE ' + v + ']><i></i><![endif]-->',
                all[0]
            ) {
            v++;
        }
        return v > 4 ? v : false;
    };

    // window.alert = function (name) {
    //     const iframe = document.createElement('IFRAME');
    //     iframe.style.display = 'none';
    //     iframe.setAttribute('src', 'data:text/plain,');
    //     document.documentElement.appendChild(iframe);
    //     window.frames[0].window.alert(name);
    //     iframe.parentNode.removeChild(iframe);
    // };
    window.alertMsgBox = function(msg, callback) {  
        var div = document.createElement("div");  
        div.innerHTML = "<style type=\"text/css\">"  
                + ".nbaMask { position: fixed; z-index: 1000; top: 0; right: 0; left: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); }                                                                                                                                                                       "  
                + ".nbaMaskTransparent { position: fixed; z-index: 1000; top: 0; right: 0; left: 0; bottom: 0; }                                                                                                                                                                                            "  
                + ".nbaDialog { position: fixed; z-index: 5000; width: 80%; max-width: 300px; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); background-color: #fff; text-align: center; border-radius: 8px; overflow: hidden; opacity: 1; color: white; }"  
                + ".nbaDialog .nbaDialogHd { padding: .2rem .27rem .08rem .27rem; }                                                                                                                                                                                                                         "  
                + ".nbaDialog .nbaDialogHd .nbaDialogTitle { font-size: 17px; font-weight: 400; }                                                                                                                                                                                                           "  
                + ".nbaDialog .nbaDialogBd { padding: 0 .27rem; font-size: 15px; line-height: 1.3; word-wrap: break-word; word-break: break-all; color: #000000; }                                                                                                                                          "  
                + ".nbaDialog .nbaDialogFt { position: relative; line-height: 48px; font-size: 17px; display: -webkit-box; display: -webkit-flex; display: flex; }                                                                                                                                          "  
                + ".nbaDialog .nbaDialogFt:after { content: \" \"; position: absolute; left: 0; top: 0; right: 0; height: 1px; border-top: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0; transform-origin: 0 0; -webkit-transform: scaleY(0.5); transform: scaleY(0.5); }               "  
                + ".nbaDialog .nbaDialogBtn { display: block; -webkit-box-flex: 1; -webkit-flex: 1; flex: 1; color: #09BB07; text-decoration: none; -webkit-tap-highlight-color: transparent; position: relative; margin-bottom: 0; }                                                                       "  
                + ".nbaDialog .nbaDialogBtn:after { content: \" \"; position: absolute; left: 0; top: 0; width: 1px; bottom: 0; border-left: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0; transform-origin: 0 0; -webkit-transform: scaleX(0.5); transform: scaleX(0.5); }             "  
                + ".nbaDialog a { text-decoration: none; -webkit-tap-highlight-color: transparent; }"  
                + "</style>"  
                + "<div id=\"dialogs2\" style=\"display: none\">"  
                + "<div class=\"nbaMask\"></div>"  
                + "<div class=\"nbaDialog\">"  
                + " <div class=\"nbaDialogHd\">"  
                + "     <strong class=\"nbaDialogTitle\"></strong>"  
                + " </div>"  
                + " <div class=\"nbaDialogBd\" id=\"dialog_msg2\">弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内</div>"  
                + " <div class=\"nbaDialogHd\">"  
                + "     <strong class=\"nbaDialogTitle\"></strong>"  
                + " </div>"  
                + " <div class=\"nbaDialogFt\">"  
                + "     <a href=\"javascript:;\" class=\"nbaDialogBtn nbaDialogBtnPrimary\" id=\"dialog_ok2\">确定</a>"  
                + " </div></div></div>";  
        document.body.appendChild(div);  
      
        var dialogs2 = document.getElementById("dialogs2");  
        dialogs2.style.display = 'block';  
      
        var dialog_msg2 = document.getElementById("dialog_msg2");  
        dialog_msg2.innerHTML = msg;  
      
        // var dialog_cancel = document.getElementById("dialog_cancel");  
        // dialog_cancel.onclick = function() {  
        // dialogs2.style.display = 'none';  
        // };  
        var dialog_ok2 = document.getElementById("dialog_ok2");  
        dialog_ok2.onclick = function() {  
            dialogs2.style.display = 'none';  
            callback();  
        };  
    }; 
    var logger = {
        MUTE: 0,
        FATA: 1,
        ERROR: 2,
        WARN: 3,
        INFO: 4,
        DEBUG: 5,
        TRACE: 6,
        level: 0
    };

    function log(type, args){
        var header = "[mstp-js-sdk]["+type+"]";
        var msg = header;
        for (var i = 0; i < args.length; i++) {
            if (typeof args[i] === "string") {
                msg += " " + args[i];
            } else {
                msg += " " + that.stringifyJSON(args[i]);
            }
        }
        if (that.detectIEVersion()) {
            // http://stackoverflow.com/questions/5538972/console-log-apply-not-working-in-ie9
            //var log = Function.prototype.bind.call(console.log, console);
            //log.apply(console, args);
            console.log(msg);
        }else{
            args.unshift(header);
            console.log.apply(console, args);
        }
        if (document.getElementById('mstp-js-sdk-log')) {
            document.getElementById('mstp-js-sdk-log').innerHTML += '<p>'+msg+'</p>';
        }
    }

    function makeLogFunc(code){
        var func = code.toLowerCase();
        logger[func] = function(){
            // logger[func].history = logger[func].history || [];
            // logger[func].history.push(arguments);
            if(window.console && window.console.log && logger.level>=logger[code]){
                var args = Array.prototype.slice.call(arguments);
                log(func,args);
            }
        };
    }

    for (var property in logger){
        if (logger.hasOwnProperty(property) && (typeof logger[property]) === "number" && !logger.hasOwnProperty(property.toLowerCase())) {
            makeLogFunc(property);
        }
    }

    this.base64_decode = function (data) {
        return Base64.decode(data);
    };

    this.base64_encode = function(data) {
        return Base64.encode(data);
    };

    this.URLSafeBase64Encode = function(v) {
        v = this.base64_encode(v);
        return v.replace(/\//g, '_').replace(/\+/g, '-');
    };

    this.URLSafeBase64Decode = function(v) {
        v = v.replace(/_/g, '/').replace(/-/g, '+');
        return this.base64_decode(v);
    };

    // TODO: enhance IE compatibility
    /**
     * parse json string to javascript object
     * @param  {String} json string
     * @return {Object} object
     */
    this.parseJSON = function(data) {
        // Attempt to parse using the native JSON parser first
        if (window.JSON && window.JSON.parse) {
            return window.JSON.parse(data);
        }

        //var rx_one = /^[\],:{}\s]*$/,
        //    rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
        //    rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        //    rx_four = /(?:^|:|,)(?:\s*\[)+/g,
        var    rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

        //var json;

        var text = String(data);
        rx_dangerous.lastIndex = 0;
        if(rx_dangerous.test(text)){
            text = text.replace(rx_dangerous, function(a){
                return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }

        // todo 使用一下判断,增加安全性
        //if (
        //    rx_one.test(
        //        text
        //            .replace(rx_two, '@')
        //            .replace(rx_three, ']')
        //            .replace(rx_four, '')
        //    )
        //) {
        //    return eval('(' + text + ')');
        //}

        return eval('('+text+')');
    };

    /**
     * parse javascript object to json string
     * @param  {Object} object
     * @return {String} json string
     */
    this.stringifyJSON = function(obj) {
        // Attempt to parse using the native JSON parser first
        if (window.JSON && window.JSON.stringify) {
            return window.JSON.stringify(obj);
        }
        switch (typeof (obj)) {
            case 'string':
                return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
            case 'array':
                return '[' + obj.map(that.stringifyJSON).join(',') + ']';
            case 'object':
                if (obj instanceof Array) {
                    var strArr = [];
                    var len = obj.length;
                    for (var i = 0; i < len; i++) {
                        strArr.push(that.stringifyJSON(obj[i]));
                    }
                    return '[' + strArr.join(',') + ']';
                } else if (obj === null) {
                    return 'null';
                } else {
                    var string = [];
                    for (var property in obj) {
                        if (obj.hasOwnProperty(property)) {
                            string.push(that.stringifyJSON(property) + ':' + that.stringifyJSON(obj[property]));
                        }
                    }
                    return '{' + string.join(',') + '}';
                }
            case 'number':
                return obj;
            case false:
                return obj;
            case 'boolean':
                return obj;
        }
    };

    this.getDomain = function(domain) {
        if (domain.slice(domain.length -1) !== '/') {
            domain = domain + '/';
        }
        return domain;
    };

    this.checkExist = function(value) {
        return !(value == null || value == undefined);
    };

    this.contains = function(array, obj) {
        if (Object.prototype.toString.call(array) !== '[object Array]') {
            return that.Constant.ErrorCode.ERROR;
        }
        var i = array.length;
        while (i--) {
            if (array[i] === obj) {
                return i;
            }
        }
        return that.Constant.ErrorCode.ERROR;
    };

    this.trim = function(str) {
        if (!str) {
            return str;
        }
        return String.prototype.trim ? String.prototype.trim.call(str) : str.toString().replace(/^\s*/, '').replace(/\s*$/, '');
    };


    this.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;//chrome浏览器
    this.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;//safari浏览器

    this.guid = (function() {

        return function(range) {
            var guid = "";
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var length;
            if (range && range > 5 ) {
                length = range - 5;
            } else {
                length = 27;
            }
            for(var i=0; i < length; i++){
                pos = Math.round(Math.random() * (chars.length-1));
                guid += chars[pos];
            }

            return 'mstp_' + guid;
        };
    }());

    // 获取http请求所用参数
    this.getHttpParam = function(obj) {
        var tempData = '';
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                tempData += key + '=' + obj[key] + '&';
            }
        }

        return tempData ? tempData.slice(0, -1) : tempData;
    };

    // 获取http响应头对应字段的值
    this.getHttpHeaderValue = function(line) {
        var pair = line.split(/:\s+/);
        if (pair.length === 2) {
            return that.trim(pair[1]);
        }

        return null;
    };

    // 获取文件md5值,异步接口
    this.getFileMd5 = function(nativeFile, callback) {
        if (!window.FileReader || !that.checkExist(nativeFile)) {
            callback && callback(that.Constant.ErrorCode.SUCCESS, null);
            return;
        }

        var fileReader = new FileReader(),
            blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            chunkSize = 4 << 20, // 默认分片大小
            chunks = Math.ceil(nativeFile.fsize / chunkSize),
            currentChunk = 0,
            spark = new SparkMD5.ArrayBuffer();

        fileReader.onload = function (e) {
            spark.append(e.target.result);

            currentChunk++;
            if (currentChunk < chunks) {
                loadNext();
            } else {
                var fileMd5 = spark.end();
                if (fileMd5.toLocaleLowerCase() == "d41d8cd98f00b204e9800998ecf8427e") {
                    alertMsgBox("文件名称或者文件格式非法，请确认文件名没有特殊字符或者文件名超长");
                    callback && callback(that.Constant.ErrorCode.ERROR, null);
                    return;
                } else {
                    callback && callback(that.Constant.ErrorCode.SUCCESS, fileMd5);
                }
            }
        };
        fileReader.onerror = function(error) {
            logger.error("fileReader error: ", error.code);
            callback && callback(that.Constant.ErrorCode.ERROR, null);
        };

        var loadNext = function() {
            var start = currentChunk * chunkSize;
            var end = ((start + chunkSize) >= nativeFile.fsize) ? nativeFile.fsize : start + chunkSize;

            fileReader.readAsArrayBuffer(blobSlice.call(nativeFile, start, end));
        };

        loadNext();
    };

    // 获取各分片md5值,异步接口
    this.getChunkMd5 = function(nativeFile, chunkSize, callback) {
        if (!window.FileReader || !that.checkExist(nativeFile)) {
            callback && callback(that.Constant.ErrorCode.SUCCESS, null);
            return;
        }

        var fileReader = new FileReader(),
            blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            chunks = Math.ceil(nativeFile.fsize / chunkSize),
            currentChunk = 0,
            chunkArray = [];

        console.log("chunks:", chunks)
        fileReader.onload = function (e) {
            var chunkMd5 = SparkMD5.ArrayBuffer.hash(e.target.result);
            chunkArray.push(chunkMd5);

            currentChunk++;
            if (currentChunk < chunks) {
                loadNext();
            } else {
                callback && callback(that.Constant.ErrorCode.SUCCESS, chunkArray);
            }
        };
        fileReader.onerror = function(error) {
            logger.error("fileReader error: ", error.code);
            callback && callback(that.Constant.ErrorCode.ERROR, null);
        };

        var loadNext = function() {
            var start = currentChunk * chunkSize;
            var end = ((start + chunkSize) >= nativeFile.fsize) ? nativeFile.fsize : start + chunkSize;

            fileReader.readAsArrayBuffer(blobSlice.call(nativeFile, start, end));
        };

        loadNext();
    };

    // 常量
    this.Constant = {
        URL_FS_IP_PORT : "http://10.1.5.78:8081",

        URL_FILE_UPLOAD : "file/upload",
        URL_FILE_DETECT : "file/detect",
        URL_FILE_DOWNLOAD : "file/download",
        URL_FILE_CHUNK_UPLOAD : "file/chunk/upload",
        URL_FILE_CHUNK_MERGE : "file/chunk/merge",
        URL_FILE_CHUNK_QUERY : "file/chunk/query",
        URL_FILE_CHUNK_DELETE : "file/chunk/delete",
        // URL_FILE_PREVIEW : "file/preview",
        // URL_FILE_DETECT_PREVIEW : "file/detectPreview",
        URL_FILE_PREVIEW : "filepreview/online",
        URL_FILE_DETECT_PREVIEW : "filepreview/detect",
        PARA_PARAMS : "params",
        PARA_CODE : "code",
        PARA_DATA : "data",
        PARA_ENCRYPT : "encrypt",
        PARA_REDIRECT : "Redirect",

        ErrorCode : {
            SUCCESS : 0,
            ERROR : -1,
            TIMEOUT : -2
        }
    };

    // 获取文件秒传所需参数
    var get_detect_file_param = function(file, option) {
        var detect_file_obj = {
            token : mToken,
            fileName : file.name,
            mstpId : mMstpId
        };

        if (that.checkExist(file.md5)) {
            detect_file_obj.checksum = file.md5;
        }

        if (that.checkExist(option.anonymous)) {
            detect_file_obj.anonymous = option.anonymous;
        }

        var params_str = that.stringifyJSON(detect_file_obj);
        return that.URLSafeBase64Encode(params_str);
    };

    // 获取查询分片信息所需参数
    var get_query_file_param = function(uuid) {
        var query_file_obj = {
            fileUuid : uuid,
            token: mToken
        };

        var params_str = that.stringifyJSON(query_file_obj);
        return that.URLSafeBase64Encode(params_str);
    };

    // 获取文件直接上传所需参数
    var get_direct_upload_param = function(file, option) {
        var direct_upload_obj = {
            token : mToken,
            fileName : file.name,
            mstpId : mMstpId
        };

        if (that.checkExist(file.md5)) {
            direct_upload_obj.checksum = file.md5;
        }

        if (that.checkExist(option.anonymous)) {
            direct_upload_obj.anonymous = option.anonymous;
        }

        if (that.checkExist(option.encrypt)) {
            direct_upload_obj.encrypt = option.encrypt;
        }
        if (that.checkExist(option.imagePolicy)) {
            if (typeof (option.imagePolicy) == "string"){
                direct_upload_obj.imagePolicy = option.imagePolicy;
            } else {
                direct_upload_obj.imagePolicy = that.stringifyJSON(option.imagePolicy);
            }
        }

        var params_str = that.stringifyJSON(direct_upload_obj);
        return that.URLSafeBase64Encode(params_str);
    };

    // 获取文件分片上传所需参数
    var get_chunk_upload_param = function(fileId, chunkSeq, chunkSize, checkMd5, option) {
        var chunk_upload_obj = {
            fileUuid : fileId,
            chunkSeq : chunkSeq,
            chunkSize : chunkSize,
            token : mToken
        };

        if (that.checkExist(checkMd5)) {
            chunk_upload_obj.checksum = checkMd5;
        }

        if (that.checkExist(option.encrypt)) {
            chunk_upload_obj.encrypt = option.encrypt;
        }

        var params_str = that.stringifyJSON(chunk_upload_obj);
        return that.URLSafeBase64Encode(params_str);
    };

    // 获取合并分片所需参数
    var get_merge_file_param = function(file, chunkCount, option) {
        var merge_file_obj = {
            fileUuid : file.transactionId,
            chunkCount : chunkCount,
            token : mToken,
            fileName : file.name,
            mstpId : mMstpId
        };

        if (that.checkExist(file.md5)) {
            merge_file_obj.checksum = file.md5;
        }

        if (that.checkExist(option.anonymous)) {
            merge_file_obj.anonymous = option.anonymous;
        }

        if (that.checkExist(option.encrypt)) {
            merge_file_obj.encrypt = option.encrypt;
        }
        if (that.checkExist(option.imagePolicy)) {
            if (typeof (option.imagePolicy) == "string"){
                merge_file_obj.imagePolicy = option.imagePolicy;
            } else {
                merge_file_obj.imagePolicy = that.stringifyJSON(option.imagePolicy);
            }
        }

        var params_str = that.stringifyJSON(merge_file_obj);
        return that.URLSafeBase64Encode(params_str);
    };

    // 文件秒传
    var detectFileExistence = function(file, option, callback) {
        var url = that.getDomain(mFsUrl) + that.Constant.URL_FILE_DETECT;

        var detect_params = {
            //appId: null,
            //secretKey: null,
            params: get_detect_file_param(file, option)
        };

        var xhr = new moxie.xhr.XMLHttpRequest();

        xhr.onload = function() {
            if (xhr.status === 200 && xhr.response) {
                var dataValue = xhr.response;
                if (!(that.Constant.PARA_CODE in dataValue) || !(that.Constant.PARA_DATA in dataValue)) {
                    logger.error("detectFileExistence failed. fileName: ", file.name, "dataValue:", dataValue);
                    callback && callback(false, null);
                    return;
                }

                var resCode = Number(dataValue.code);
                if (resCode !== 0) {
                    logger.info("detectFileExistence failed. fileName: ", file.name, "dataValue:", dataValue);
                    callback && callback(false, null);
                } else {
                    var resultData = that.URLSafeBase64Decode(dataValue.data);
                    var plainData = that.parseJSON(resultData);
                    logger.info("detectFileExistence success. fileName: ", file.name);
                    callback && callback(true, plainData.fileId);
                }
            }
        };
        xhr.onerror = function() {
            logger.error("detectFileExistence error. fileName: ", file.name);
            callback && callback(false, null);
        };
        xhr.onTimeout = function() {
            logger.error("detectFileExistence timeout. fileName: ", file.name);
            callback && callback(false, null);
        };
        xhr.onloadend = function() {
            xhr.destroy();
            xhr = null;
        };

        var param = that.getHttpParam(detect_params);

        xhr.open("post", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.responseType = 'json';

        xhr.send(param);
    };

    // 查询分片信息
    var queryChunkInfo = function(file, callback) {
        var url = that.getDomain(mFsUrl) + that.Constant.URL_FILE_CHUNK_QUERY;

        var query_params = {
            //appId: null,
            //secretKey: null,
            params: get_query_file_param(file.transactionId)
        };

        var xhr = new moxie.xhr.XMLHttpRequest();

        xhr.onload = function() {
            if (xhr.status === 200 && xhr.response) {
                var dataValue = xhr.response;
                if (!(that.Constant.PARA_CODE in dataValue) || !(that.Constant.PARA_DATA in dataValue)) {
                    logger.error("queryChunkInfo failed. fileName: ", file.name, "dataValue:", dataValue);
                    callback && callback(false, null);
                    return;
                }

                var resCode = Number(dataValue.code);
                if (resCode !== 0 || dataValue.data === "") {
                    logger.error("queryChunkInfo failed. fileName: ", file.name, "dataValue:", dataValue);
                    callback && callback(false, null);
                } else {
                    var resultData = that.URLSafeBase64Decode(dataValue.data);
                    var plainData = that.parseJSON(resultData);

                    logger.info("queryChunkInfo success. fileName: ", file.name);
                    callback && callback(true, plainData.chunkInfoList);
                }
            }
        };
        xhr.onerror = function() {
            logger.error("queryChunkInfo error. fileName: ", file.name);
            callback && callback(false, null);
        };
        xhr.onTimeout = function() {
            logger.error("queryChunkInfo timeout. fileName: ", file.name);
            callback && callback(false, null);
        };
        xhr.onloadend = function() {
            xhr.destroy();
            xhr = null;
        };

        var param = that.getHttpParam(query_params);

        xhr.open("post", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.responseType = 'json';

        xhr.send(param);
    };

    // 文件直接上传
    var directUpload = function(file, uploader, option) {
        var multipart_params = {
            //appId: null,
            //secretKey: null,
            params: get_direct_upload_param(file, option),
            'Content-Type' : "text/plain"
        };

        var url = that.getDomain(mFsUrl) + that.Constant.URL_FILE_UPLOAD;
        uploader.setOption({
            "url": url,
            "multipart": true,
            "chunk_size" : 0,
            "multipart_params": multipart_params
        });

        logger.info("directUpload start. url: ", uploader.getOption("url"), "fileName: ", file.name);
    };

    // 文件分片上传
    var chunkUpload = function(file, uploader, option) {
        var chunkId = file.currentChunk,
            chunk_size = file.chunkSize,
            start = (chunkId - 1) * chunk_size,
            end = ((start + chunk_size) >= file.size) ? file.size : start + chunk_size,
            chunkSize = end - start,
            chunkMd5 = file.chunkArray && file.chunkArray[chunkId - 1];

        var multipart_params = {
            //appId: null,
            //secretKey: null,
            params: get_chunk_upload_param(file.transactionId, chunkId, chunkSize, chunkMd5, option),
            "Content-Type" : "text/plain"
        };

        var url = that.getDomain(mFsUrl) + that.Constant.URL_FILE_CHUNK_UPLOAD;
        uploader.setOption({
            "url" : url,
            "multipart" : true,
            "chunk_size" : chunk_size,
            "multipart_params" : multipart_params
        });

        logger.info("chunkUpload start. url: ", uploader.getOption("url"), "fileName: ", file.name, "chunkId: ", chunkId);
    };

    // 合并分片
    var mergeAllChunks = function(file, uploader, option, callback) {
        var url = that.getDomain(mFsUrl) + that.Constant.URL_FILE_CHUNK_MERGE;
        var chunk_size = uploader.getOption && uploader.getOption('chunk_size');
        var chunkCount = Math.ceil(file.size / chunk_size);

        var merge_params = {
            //appId: null,
            //secretKey: null,
            params: get_merge_file_param(file, chunkCount, option)
        };

        var xhr = new moxie.xhr.XMLHttpRequest();

        xhr.onload = function() {
            if (xhr.status === 200 && xhr.response) {
                var dataValue = xhr.response;
                if (!(that.Constant.PARA_CODE in dataValue) || !(that.Constant.PARA_DATA in dataValue)) {
                    logger.error("mergeAllChunks failed. fileName: ", file.name, "dataValue:", dataValue);
                    callback && callback(false, null);
                    return;
                }

                var resCode = Number(dataValue.code);
                if (resCode !== 0 || dataValue.data === "") {
                    logger.error("mergeAllChunks failed. fileName: ", file.name, "dataValue:", dataValue);
                    callback && callback(false, null);
                } else {
                    var resultData = that.URLSafeBase64Decode(dataValue.data);
                    var plainData = that.parseJSON(resultData);
                    logger.info("mergeAllChunks success. fileName: ", file.name);
                    callback && callback(true, plainData.fileId);
                }
            }
        };
        xhr.onerror = function() {
            logger.error("mergeAllChunks error. fileName: ", file.name);
            callback && callback(false, null);
        };
        xhr.onTimeout = function() {
            logger.error("mergeAllChunks timeout. fileName: ", file.name);
            callback && callback(false, null);
        };
        xhr.onloadend = function() {
            xhr.destroy();
            xhr = null;
        };

        var param = that.getHttpParam(merge_params);

        xhr.open("post", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.responseType = 'json';

        xhr.send(param);
    };

    // 获取文件下载参数
    var get_download_param = function (option) {
        var download_obj = {
            fileId: option.fileId,
            token: mToken
        };

        if (that.checkExist(option.encrypt)) {
            download_obj.encrypt = option.encrypt;
        }
        if (that.checkExist(option.imagePolicy)) {
            if (typeof (option.imagePolicy) == "string") {
                download_obj.imagePolicy = option.imagePolicy;
            } else {
                download_obj.imagePolicy = that.stringifyJSON(option.imagePolicy);
            }
        }

        var params_str = that.stringifyJSON(download_obj);
        return that.URLSafeBase64Encode(params_str);
    };

    // 获取文件预览参数
    var get_preview_param = function (option) {
        var preview_obj = {
            fileId: option.fileId,
            token: mToken
        };

        var params_str = that.stringifyJSON(preview_obj);
        return that.URLSafeBase64Encode(params_str);
    };

    // 探测预览文件
    var detectFilePreview = function(option, params, callback) {
        var xhr = new moxie.xhr.XMLHttpRequest();

        xhr.onload = function() {
            var dataValue = xhr.response;
            if (xhr.status === 200) {
                if (!(that.Constant.PARA_CODE in dataValue)) {
                    logger.error("detectFilePreview failed, no return code. fileId: ", option.fileId);
                    callback && callback(false, null);
                    return;
                }

                var resCode = Number(dataValue.code);
                if (resCode !== 0) {
                    logger.error("detectFilePreview failed. fileId: ", option.fileId, "status code: ", xhr.status, "return code: ", resCode);
                    callback && callback(false, null);
                } else {
                    logger.info("detectFilePreview success. fileId: ", option.fileId);
                    callback && callback(true, option.url);
                }
                return;
            }

            var redirect = xhr.getResponseHeader(that.Constant.PARA_REDIRECT);
            if (xhr.status === 302 || redirect) {
                if (!dataValue.data) {
                    logger.error("detectFilePreview failed, response no data, fileId: ", option.fileId, "status code: ", xhr.status);
                    callback && callback(false, null);
                } else {
                    var resultDataJson = that.URLSafeBase64Decode(dataValue.data);
                    var plainData = that.parseJSON(resultDataJson);
                    var protocol = option.url.split(":")[0];

                    var redirectUrl;
                    if (protocol === "http") {
                        redirectUrl = plainData["otherZoneHttpPublicAddress"];
                    } else {
                        redirectUrl = plainData["otherZoneHttpsPublicAddress"];
                    }

                    if (redirectUrl) {
                        option.url = redirectUrl;
                        return detectFilePreview(option, callback);
                    } else {
                        logger.info("redirect url is null. fileId: ", option.fileId);
                        callback && callback(false, null);
                    }
                }

            }
        };
        xhr.onerror = function(e) {
            logger.error("detectFilePreview error. fileId: ", option.fileId);
            callback && callback(false, null);
        };
        xhr.onTimeout = function() {
            logger.error("detectFilePreview timeout. fileId: ", option.fileId);
            callback && callback(false, null);
        };
        xhr.onloadend = function() {
            xhr.destroy();
            xhr = null;
        };

        var url = that.getDomain(option.url) + that.Constant.URL_FILE_DETECT_PREVIEW;
        url += (url.indexOf("?") > 0 ? "" : "?") + params;
        xhr.open("get", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.responseType = 'json';
        xhr.send(null);
    };



    var mMstpId;
    var mToken;
    var mFsUrl;
    var mUploader;

    /**
     * 初始化 SDK
     *
     * @param  {Object} option 必须包含appId,mstpId,exptime,creationTime,signature字段.
     * url:"String", 上传文件的FS服务器地址,必填.
     * log_level:"Number", 日志级别,取值为1-6,默认为6.
     * @return 无
     */
    this.initSdk = function(option) {
        logger.level = option.log_level || 6; // 日志默认级别
        mFsUrl = option.url;

        var token_obj = {
            appId : option.appId,
            mstpId : option.mstpId,
            exptime : option.exptime,
            creationTime : option.creationTime,
            signature : option.signature
        };

        mMstpId = option.mstpId;
        var token_str = that.stringifyJSON(token_obj);
        mToken = that.URLSafeBase64Encode(token_str);
    };

    /**
     * 文件上传
     *
     * @param  {Object} option 必须包含browse_button,url字段.
     *  browse_button:"String", 触发文件上传选择对话框的DOM元素ID.
     *  chunk_size:"Number/String", 分片大小,默认为0,表示不分片.
     *  anonymous:"Number/String", 该文件是否允许匿名下载.该属性存在则表示允许.
     *  onUploadFilesAdded:"Function", 用于文件添加到上传队列的回调.
     *  onUploadProgress:"Function", 用于文件上传进度的回调.
     *  onUploadSuccess:"Function", 用于文件上传成功时的回调.
     *  onUploadFail:"Function", 用于文件上传失败时的回调.
     * @return {Object} 上传生成的对象,用于取消文件上传时调用.
     */
    this.uploader = function(option) {
        var FileUploadProgressHandler = option.onUploadProgress || function() {};
        var FileUploadCompleteHandler = option.onUploadSuccess || function() {};
        var FileUploadErrorHandle = option.onUploadFail || function() {};
        var FilesUploadAddedHandle = option.onUploadFilesAdded || function() {};

        logger.debug("option: ", option);

        var uploader = new plupload.Uploader({
            auto_start : true,
            browse_button : option.browse_button,
            filters : option.filters || {},
            runtimes : "html5,flash,silverlight,html4",
            //runtimes : "flash",
            flash_swf_url : "3rd/plupload-2.3.1/Moxie.swf",
            silverlight_xap_url : "3rd/plupload-2.3.1/Moxie.xap"
        });

        uploader.setOption("chunk_size", option.chunk_size || 0);

        uploader.init();

        uploader.fileMap = {};
        mUploader = uploader;

        uploader.bind("FilesAdded", function(uploader, files) {
            console.log('---①上传文件对象为'+files);
        	//兼容files为空，赋值空数组
        	var files = files || [];
        	//如果files长度为0，直接提示并且返回
        	if(0==files.length){
        		alertMsgBox('文件名称或者文件格式非法，请确认文件名没有特殊字符或者文件名超长');
            	return;
        	}
        	//files判断里面的文件是否存在，如果不存在则直接返回
        	//如果一次性选择多个文件，其中有个文件非法，则直接返回
        	for (var i = 0; i < files.length; i++) {
        		var file = files[i];
                console.log('---②上传单个文件对象为'+file);
                console.log('---③上传单个文件对象为file.size：'+file.size);
                console.log('---④上传单个文件对象为file.name：'+file.name);
                console.log('---⑤上传单个文件对象为file.type：'+file.type);
	            if(!file||!file.size||0>=file.size||!file.name){
	            	alertMsgBox('文件名称或者文件格式非法，请确认文件名没有特殊字符或者文件名超长');
	            	return;
	            }
        	}
        	console.log('---⑥FilesAdded event activated');

            logger.debug("FilesAdded event activated.");



            (function (files) {
                for (var j = 0; j < files.length; j++) {
                    var file = files[j];

                    var transactionId = file.getNative() && file.getNative().transactionId;
                    if (that.checkExist(transactionId) && that.checkExist(uploader.fileMap[transactionId])) {
                        logger.info("resume file. fileName: ", file.name, ", fileId: ", transactionId);
                    } else {
                        transactionId = that.guid();
                    }

                    file.nativeFile = file.getNative();
                    console.log("native size:", file.nativeFile.size, " size: ", file.size)
                    file.nativeFile.fsize = file.nativeFile.size > 0 ? file.nativeFile.size : file.size;

                    if (that.checkExist(file.nativeFile)) {
                        file.nativeFile.transactionId = transactionId;
                    }
                    file.transactionId = transactionId;
                    uploader.fileMap[transactionId] = file;
                }
            })(files);

            FilesUploadAddedHandle(files,uploader);

            for (var i = 0; i < files.length; i++) {
                var file = files[i];	

                uploader.stop();

                (function (target) {
                    that.getFileMd5(target.getNative(), function (code, md5) {

                        var startUploader = function () {
                            var chunk_size = uploader.getOption && uploader.getOption('chunk_size');
                            if (chunk_size === 0 || target.size < chunk_size) {
                                uploader.start();
                            } else {
                                queryChunkInfo(target, function (isSuccess, chunkInfoList) {
                                    if (isSuccess) {
                                        target.chunkInfoList = chunkInfoList;
                                    }

                                    that.getChunkMd5(target.getNative(), chunk_size, function (code, chunkArray) {
                                        if (code === that.Constant.ErrorCode.SUCCESS) {
                                            target.chunkArray = chunkArray;
                                            uploader.start();
                                        }
                                    });
                                });
                            }
                        };

                        if (code === that.Constant.ErrorCode.SUCCESS) {
                            logger.info("getFileMd5 success. fileName: ", target.name);

                            if (that.checkExist(md5)) {
                                target.md5 = md5;

                                detectFileExistence(target, option, function (isExist, fileId) {
                                    if (isExist) {
                                        FileUploadCompleteHandler(target, fileId);
                                        // 秒传成功需要清除掉对应文件
                                        uploader.removeFile(target);
                                    } else {
                                        startUploader();
                                    }
                                });
                            } else {
                                startUploader();
                            }
                        } else {
                            logger.warn("getFileMd5 error. fileName: ", target.name);
                        }
                    });
                })(file);
            }
        });

        uploader.bind("BeforeUpload", function(uploader, file) {
            logger.debug("BeforeUpload event activated. fileName: ", file.name);

            // 决定文件上传方式为分片上传或者直接上传,并准备上传所需参数
            var doFileUpload = function() {
                var chunk_size = uploader.getOption && uploader.getOption('chunk_size');

                logger.debug("uploader.runtime: ", uploader.runtime);
                logger.debug("fileSize: ", file.size, "chunk_size: ", chunk_size);

                var isDirectUpload;
                if ((uploader.runtime === 'html5' || uploader.runtime === 'flash') && chunk_size) {
                    if (chunk_size === 0 || file.size < chunk_size) {
                        logger.info("directUpload because file.size < chunk_size");
                        isDirectUpload = true;
                    } else {
                        isDirectUpload = false;
                    }
                } else {
                    logger.info("directUpload because chunk_size = ", chunk_size);
                    isDirectUpload = true;
                }

                file.isDirectUpload = isDirectUpload;
                if (isDirectUpload) {
                    directUpload(file, uploader, option);
                } else if (that.checkExist(file.chunkInfoList)) {
                    var chunkInfoList = file.chunkInfoList;
                    var fileLoaded = 0;
                    for (var i = 0; i < chunkInfoList.length; i++) {
                        //var chunkId = chunkInfoList[i]["chunkSeq"];
                        fileLoaded += chunkInfoList[i]["chunkLength"];
                    }

                    file.loaded = fileLoaded;
                    file.percent = fileLoaded / file.size;

                    file.chunkSize = chunkInfoList[0]["chunkSize"];
                    file.currentChunk = chunkInfoList.length + 1;

                    logger.info("chunkUploaded will begin from chunk: ", file.currentChunk);

                    chunkUpload(file, uploader, option);
                } else {
                    file.chunkSize = chunk_size;
                    file.currentChunk = 1;

                    chunkUpload(file, uploader, option);
                }
            };

            doFileUpload();
        });

        uploader.bind("UploadProgress", function(uploader, file) {
            logger.debug("UploadProgress event activated. fileName: ", file.name);
            logger.debug("fileSize : ", file.size, "filePercent: ", file.percent);

            FileUploadProgressHandler(file, file.percent);
        });

        uploader.bind("ChunkUploaded", function(uploader, file, result) {
            logger.debug("ChunkUploaded event activated. fileName: ", file.name);

            var chunk_size = uploader.getOption && uploader.getOption('chunk_size');
            var chunkId = Math.ceil(file.loaded / chunk_size);
            var success = true;

            var dataValue = that.parseJSON(result.response);
            if (!(that.Constant.PARA_CODE in dataValue) || !(that.Constant.PARA_DATA in dataValue)) {
                logger.error("chunkUpload failed. fileName: ", file.name, "chunkId: ", chunkId, "dataValue: ", dataValue);
                success = false;
            }

            var resCode = Number(dataValue.code);
            if (resCode !== 0 || dataValue.data === "") {
                logger.error("chunkUpload failed. fileName: ", file.name, "chunkId: ", chunkId, "dataValue: ", dataValue);
                success = false;
            }

            var resultData = that.URLSafeBase64Decode(dataValue.data);
            var plainData = that.parseJSON(resultData);
            if ((plainData.chunkSeq !== chunkId) || (plainData.fileUuid !== file.transactionId)) {
                logger.error("chunkUpload failed. fileName: ", file.name, "chunkId: ", chunkId, "dataValue: ", dataValue);
                success = false;
            }

            if (success === false) {
                uploader.stop();
                FileUploadErrorHandle(file, that.Constant.ErrorCode.ERROR);
                return;
            }

            logger.debug("chunkUpload success. fileName: ", file.name, "chunkId: ", chunkId, "fileSize: ", file.size);

            var leftSize = file.size - file.loaded;
            if (leftSize > 0) {
                file.currentChunk = chunkId + 1;
                file.chunkSize = chunk_size;
                chunkUpload(file, uploader, option);
            }
        });

        uploader.bind("FileUploaded", function(uploader, file, result) {
            logger.debug("FileUploaded event activated. fileName: ", file.name);

            if (file.isDirectUpload) {
                var dataValue = that.parseJSON(result.response);
                if (!(that.Constant.PARA_CODE in dataValue) || !(that.Constant.PARA_DATA in dataValue)) {
                    logger.error("directUpload failed. fileName: ", file.name, "dataValue: ", dataValue);
                    FileUploadErrorHandle(file, that.Constant.ErrorCode.ERROR);
                    return;
                }

                var resCode = Number(dataValue.code);
                if (resCode !== 0 || dataValue.data === "") {
                    logger.error("directUpload failed. fileName: ", file.name, "dataValue: ", dataValue);
                    FileUploadErrorHandle(file, resCode);
                } else {
                    var resultData = that.URLSafeBase64Decode(dataValue.data);
                    var plainData = that.parseJSON(resultData);
                    logger.debug("directUpload success. fileName: ", file.name, "fileSize: ", file.size);
                    FileUploadCompleteHandler(file, plainData.fileId);
                }
            } else {
                mergeAllChunks(file, uploader, option, function(success, fileId) {
                    if (success) {
                        FileUploadCompleteHandler(file, fileId);
                    } else {
                        FileUploadErrorHandle(file, that.Constant.ErrorCode.ERROR);
                    }
                });
            }
        });

        uploader.bind("Error", function(uploader, error) {
            logger.error("Error event activated.");

            var errTip = '';
            var file = error.file;
            if (file) {
                switch (error.code) {
                    case plupload.INIT_ERROR:
                        uploader.destroy();
                        break;
                    default:
                        break;
                }

                //errTip = error.code + '：' + err.message;
                errTip = error.code;
                logger.error("upload error. code: ", errTip);

                FileUploadErrorHandle(file, error.code);
            }
        });
    };

    /**
     * 上传文件
     *
     * @param  {Object} file
     * @return 无
     */
    this.uploadFile = function(file) {
        mUploader.addFile(file);
    };

    /**
     * 取消上传文件
     *
     * @param transactionId {String} 调用上传文件接口时各回调函数中的 file.transactionId.
     * @return 无
     */
    this.cancelUpload = function(transactionId) {
        if (!that.checkExist(transactionId) || !that.checkExist(mUploader)) {
            return that.ErrorCode.ERROR;
        }

        logger.error("cancelUpload. transactionId: ", transactionId);

        var file = mUploader.fileMap[transactionId];
        mUploader.removeFile(file);
    };

    /**
     * 暂停上传文件
     *
     * @param transactionId {String} 调用上传文件接口时各回调函数中的 file.transactionId.
     * @return 无
     */
    this.pauseUpload = function(transactionId) {
        if (!that.checkExist(transactionId) || !that.checkExist(mUploader)) {
            return that.ErrorCode.ERROR;
        }

        logger.error("pauseUpload. transactionId: ", transactionId);

        var file = mUploader.fileMap[transactionId];
        mUploader.removeFile(file);
    };

    /**
     * 继续上传文件
     *
     * @param transactionId {String} 调用上传文件接口时各回调函数中的 file.transactionId.
     * @return 无
     */
    this.resumeUpload = function(transactionId) {
        if (!that.checkExist(transactionId) || !that.checkExist(mUploader)) {
            return that.ErrorCode.ERROR;
        }

        logger.error("resumeUpload. transactionId: ", transactionId);

        var file = mUploader.fileMap[transactionId];
        mUploader.addFile(file.nativeFile);
    };

    /**
     * 根据fileId生成要下载文件的URL
     *
     * @param  {Object} option 必须包含url,fileId字段.
     * url:"String", 下载文件的FS服务器地址.
     * fileId:"String", 要下载的文件Id,用于唯一标识一个文件.
     * @return {String} 文件的URL,用于直接绑定到标签.
     */
    this.generateUrl = function(option) {
        var url = that.getDomain(mFsUrl) + that.Constant.URL_FILE_DOWNLOAD;

        var generate_params = {
            //appId : null,
            //secretKey : null,
            params: get_download_param(option)
        };

        var param = that.getHttpParam(generate_params);
        url += (url.indexOf("?") > 0 ? "" : "?") + param;
        return url;
    };

    /**
     * 根据fileId下载文件
     *
     * @param  {Object} option 必须包含url,fileId字段.
     * url:"String", 下载文件的FS服务器地址.
     * fileId:"String", 要下载的文件Id,用于唯一标识一个文件.
     * @return 无
     */
    this.downloader = function(option) {
        // 由浏览器保存文件
        var saveFile = function (url) {//需要区分浏览器
            logger.info("download file start");
            if(that.isChrome||that.isSafari){//chrome或者safari
                var element = document.createElement('a');
                element.href = url;

                var event = new MouseEvent('click'); // Firefox 兼容性处理
                element.dispatchEvent(event);
            }else{//主要为IE
                if (url.indexOf('?') === -1) {
                    url += '?download';
                }
                window.open(url, '_self');
            }
        };

        var url = that.generateUrl(option);
        saveFile(url);
    };

    /**
     * 根据fileId获取预览文件的URL
     *
     * @param  {Object} option 必须包含url,fileId字段.
     * url:"String", 预览文件的FPS服务器地址.
     * fileId:"String", 要下载的文件Id,用于唯一标识一个文件.
     * onGetPreviewUrlSuccess:"Function", 用于获取文件预览url成功时的回调.
     * onGetPreviewUrlFailure:"Function", 用于获取文件预览url失败时的回调.
     * @return 无
     */
    this.previewUrl = function(option) {
        var GetPreviewUrlSuccessHandler = option.onGetPreviewUrlSuccess || function() {};
        var GetPreviewUrlFailureHandler = option.onGetPreviewUrlFailure || function() {};

        var preview_params = {
            params: get_preview_param(option)
        };

        var params = that.getHttpParam(preview_params);

        detectFilePreview(option, params, function(success, url) {
            if (success) {
                var previewUrl = that.getDomain(url) + that.Constant.URL_FILE_PREVIEW;
                var params = that.getHttpParam(preview_params);
                previewUrl += (previewUrl.indexOf("?") > 0 ? "" : "?") + params;
                GetPreviewUrlSuccessHandler(option.fileId, previewUrl);
            } else {
                GetPreviewUrlFailureHandler(option.fileId, that.Constant.ErrorCode.ERROR);
            }
        });
    };
}

    global.Mstp = new MstpJsSDK();
    global.MstpJsSDK = MstpJsSDK;

})( window );