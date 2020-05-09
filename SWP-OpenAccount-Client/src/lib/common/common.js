var seqIndex = 0;
(function () {
    // 全局公用方法
    window.Common = {
        /**
         * 公用参数加密Ajax请求
         */
        AjaxFun: function (method, url, json, successfun, errorfun) {
            // if (!!Common.getAllCookie('lgParam')) {
            //     var lgParam = JSON.parse(decodeURIComponent(Common.getAllCookie('lgParam')));
            //     lgParam.seq = Number(new Date()) + seqIndex++;
            //     json['lgParam'] = JSON.stringify(lgParam);
            // }

            var aesKey = CommonCrypt.getAesKey();
            var encrypteddata = CommonCrypt.encrypt(JSON.stringify(json), aesKey);
            var encryptedKey = CommonCrypt.encryptKey(aesKey);

            var d = {
                bdata: JSON.stringify({
                    data: encrypteddata,
                    zip: 0,
                    key: encryptedKey,
                    keyType: 17,
                }),
            };
            // var d = {
            //     bdata: JSON.stringify({
            //         data: Base64.encode(JSON.stringify(json)),
            //         zip: 0,
            //         key: '',
            //         keyType: 1,
            //     }),
            //     key: '',
            //     zip: 0,
            //     keyType: 1,
            // };
            $.ajax({
                type: method,
                cache: false,
                url: url,
                data: d,
                success: function (data) {
                    if (data.code == 0) {
                        var dataJson = '';
                        if (!!data.data) {
                            // dataJson = JSON.parse(Base64.decode(data.data));
                            var cryptData = data.data;
                            dataJson = JSON.parse(CommonCrypt.decrypt(cryptData, aesKey));
                        }
                        var resultjson = {
                            success: true,
                            result: dataJson
                        };
                        successfun(resultjson);
                    } else {
                        if (data.code == "122" || data.code == "507") {
                            Common.toast("登录信息过期，请重新登录!");
                        } else {
                            var resultjson = {
                                success: false,
                                result: data
                            };
                            successfun(resultjson);
                            // if (data.code == '490002') {
                            //     Common.toast("小应用ID已存在!");
                            // } else {
                            //     Common.toast(data.rdesc || '服务器繁忙,请稍后再试.');
                            // }
                        }
                    }
                },
                error: function (data) {
                    try {
                        errorfun(data);
                    } catch (e) {
                        Common.toast('服务器繁忙,请稍后再试.');
                    }
                }
            });
        },

        // 公用提示方法
        toast: function (tipsText, delayTime) {
            var time = 200;
            if (!!delayTime) {
                time = delayTime;
            }
            if ($(".tipsBox").length == 0) {
                $("body").append("<div class='tipsBox' style='display:none;position:fixed;width:100%;bottom:30%;left:0;text-align:center;z-index:1101'><span style='max-width:60%;margin:0 auto;display:inline-block;border-radius:5px;padding:12px 24px;font-size:16px;color:#fff;background:rgba(0,0,0,0.9);box-shadow:1px 1px 5px #b2b2b2'>" + tipsText + "</span></div>");
                $(".tipsBox").stop().delay(time).animate({ opacity: 'show' }, 0).delay(2000).animate({ opacity: 'hide' }, 350, function () { $(".tipsBox").remove() });
                $(document).on("click", ".tipsBox", function () { //点击tipsbox隐藏
                    $(".tipsBox").stop().animate({ opacity: 'hide' }, 150, function () { $(".tipsBox").remove() });
                })
            }else{
                $(".tipsBox").stop().delay(time).animate({ opacity: 'show' }, 0).delay(2000).animate({ opacity: 'hide' }, 350, function () { $(".tipsBox").remove() });
                $(document).on("click", ".tipsBox", function () { //点击tipsbox隐藏
                    $(".tipsBox").stop().animate({ opacity: 'hide' }, 150, function () { $(".tipsBox").remove() });
                })
            }
        },

        /*
        * 生成不重复请求seq
        */
        newSeq: function() {
            var seqGUID = new Common.GUID(); // guid用于生成不重复请求seq
            var seq = Math.round(Number(new Date())) + "" + Math.round(Math.random(seqGUID.newGUID()) * 1000);
            return seq;
        },

        /**
         * 生产随机数 函数
         */
        GUID: function() {
            this.date = new Date();   /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
            if (typeof this.newGUID != 'function') {   /* 生成GUID码 */
                Common.GUID.prototype.newGUID = function () {
                    this.date = new Date();
                    var guidStr = '';
                    var sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
                    var sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
                    for (var i = 0; i < 9; i++) {
                        guidStr += Math.floor(Math.random() * 16).toString(16);
                    }
                    guidStr += sexadecimalDate;
                    guidStr += sexadecimalTime;
                    while (guidStr.length < 32) {
                        guidStr += Math.floor(Math.random() * 16).toString(16);
                    }
                    return this.formatGUID(guidStr);
                }
                Common.GUID.prototype.newGUID1 = function () {
                    this.date = new Date();
                    var guidStr = '';
                    var sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
                    var sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
                    for (var i = 0; i < 9; i++) {
                        guidStr += Math.floor(Math.random() * 16).toString(16);
                    }
                    guidStr += sexadecimalDate;
                    guidStr += sexadecimalTime;
                    while (guidStr.length < 32) {
                        guidStr += Math.floor(Math.random() * 16).toString(16);
                    }
                    return guidStr;
                }
                /* * 功能：获取当前日期的GUID格式，即8位数的日期：19700101 * 返回值：返回GUID日期格式的字条串 */
                Common.GUID.prototype.getGUIDDate = function () {
                    return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
                }
                /* * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933 * 返回值：返回GUID日期格式的字条串 */
                Common.GUID.prototype.getGUIDTime = function () {
                    return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10));
                }
                /* * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现 * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串 * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串 */
                Common.GUID.prototype.addZero = function (num) {
                    if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
                        return '0' + Math.floor(num);
                    } else {
                        return num.toString();
                    }
                }
                /*  * 功能：将y进制的数值，转换为x进制的数值 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10 * 返回值：返回转换后的字符串 */
                Common.GUID.prototype.hexadecimal = function (num, x, y) {
                    if (y != undefined) { return parseInt(num.toString(), y).toString(x); }
                    else { return parseInt(num.toString()).toString(x); }
                }
                /* * 功能：格式化32位的字符串为GUID模式的字符串 * 参数：第1个参数表示32位的字符串 * 返回值：标准GUID格式的字符串 */
                Common.GUID.prototype.formatGUID = function (guidStr) {
                    var str1 = guidStr.slice(0, 8) + '-', str2 = guidStr.slice(8, 12) + '-', str3 = guidStr.slice(12, 16) + '-', str4 = guidStr.slice(16, 20) + '-', str5 = guidStr.slice(20);
                    return str1 + str2 + str3 + str4 + str5;
                }
            }
        },

        
        /**
         * 生成AES加密key
         * @param len
         * @returns
         */
        getAesKey: function (len) {
            len = len || 16;
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            var maxPos = $chars.length;
            var keyStr = '';
            for (var i = 0; i < len; i++) {
                keyStr += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return keyStr;
        },

        /**
         * AES加密
         * @param word
         * @returns {*}
         */
        encrypt: function (word, keyStr) {
            var key = CryptoJS.enc.Utf8.parse(keyStr);
            var srcs = CryptoJS.enc.Utf8.parse(word);
            var encrypted = CryptoJS.AES.encrypt(srcs, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });

            return encrypted.toString();
        },

        /**
         * AES解密
         * @param word
         * @returns {*}
         */
        decrypt: function (word, keyStr) {
            var key = CryptoJS.enc.Utf8.parse(keyStr);
            var decrypt = CryptoJS.AES.decrypt(word, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return CryptoJS.enc.Utf8.stringify(decrypt).toString();
        },
    }
})()