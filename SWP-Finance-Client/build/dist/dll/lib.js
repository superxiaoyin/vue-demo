var lib =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 105);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(31)('wks');
var uid = __webpack_require__(22);
var Symbol = __webpack_require__(0).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(8);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(19)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(3);
var IE8_DOM_DEFINE = __webpack_require__(39);
var toPrimitive = __webpack_require__(33);
var dP = Object.defineProperty;

exports.f = __webpack_require__(4) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(5);
var createDesc = __webpack_require__(20);
module.exports = __webpack_require__(4) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var core = __webpack_require__(2);
var ctx = __webpack_require__(18);
var hide = __webpack_require__(7);
var has = __webpack_require__(6);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(77);
var defined = __webpack_require__(24);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(66), __esModule: true };

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(68), __esModule: true };

/***/ }),
/* 13 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["callHandler"] = callHandler;
/* harmony export (immutable) */ __webpack_exports__["registerHandler"] = registerHandler;
/* harmony export (immutable) */ __webpack_exports__["GetUserInfoFunction"] = GetUserInfoFunction;
/* harmony export (immutable) */ __webpack_exports__["EncryptionFunction"] = EncryptionFunction;
/* harmony export (immutable) */ __webpack_exports__["DecryptionFunction"] = DecryptionFunction;
/* harmony export (immutable) */ __webpack_exports__["QueryCompanyDetailFunction"] = QueryCompanyDetailFunction;
/* harmony export (immutable) */ __webpack_exports__["CommonDialogFunction"] = CommonDialogFunction;
/* harmony export (immutable) */ __webpack_exports__["ToastFunction"] = ToastFunction;
/* harmony export (immutable) */ __webpack_exports__["PopMenuFunction"] = PopMenuFunction;
/* harmony export (immutable) */ __webpack_exports__["SelectProvinceWidget"] = SelectProvinceWidget;
/* harmony export (immutable) */ __webpack_exports__["FilePreviewWidget"] = FilePreviewWidget;
/* harmony export (immutable) */ __webpack_exports__["SelectTimeWidget"] = SelectTimeWidget;
/* harmony export (immutable) */ __webpack_exports__["addAppViewListener"] = addAppViewListener;
/* harmony export (immutable) */ __webpack_exports__["RegisterMenuFunction"] = RegisterMenuFunction;
/* harmony export (immutable) */ __webpack_exports__["goBackFunction_new"] = goBackFunction_new;
/* harmony export (immutable) */ __webpack_exports__["goBackFunction"] = goBackFunction;
/* harmony export (immutable) */ __webpack_exports__["notifyAppBackEvent"] = notifyAppBackEvent;
/* harmony export (immutable) */ __webpack_exports__["ClearWebViewCache"] = ClearWebViewCache;
/* harmony export (immutable) */ __webpack_exports__["OpenActionFunction"] = OpenActionFunction;
/* harmony export (immutable) */ __webpack_exports__["verifySignFunction"] = verifySignFunction;
/* harmony export (immutable) */ __webpack_exports__["TPayGetDssStatusFunction"] = TPayGetDssStatusFunction;
/* harmony export (immutable) */ __webpack_exports__["ConnectDssBb"] = ConnectDssBb;
/* harmony export (immutable) */ __webpack_exports__["LoginDss"] = LoginDss;
/* harmony export (immutable) */ __webpack_exports__["ModifyDssPsw"] = ModifyDssPsw;
/* harmony export (immutable) */ __webpack_exports__["GetDssAccountList"] = GetDssAccountList;
/* harmony export (immutable) */ __webpack_exports__["CalculatePassword"] = CalculatePassword;
/* harmony export (immutable) */ __webpack_exports__["SetDssUserFun"] = SetDssUserFun;
/* harmony export (immutable) */ __webpack_exports__["GetAppConfigFunction"] = GetAppConfigFunction;
/* harmony export (immutable) */ __webpack_exports__["getBankType"] = getBankType;
/* harmony export (immutable) */ __webpack_exports__["CheckNetWorkFunction"] = CheckNetWorkFunction;
/* harmony export (immutable) */ __webpack_exports__["popWindowFunction"] = popWindowFunction;
/* harmony export (immutable) */ __webpack_exports__["SignDataFunction"] = SignDataFunction;
/* harmony export (immutable) */ __webpack_exports__["EncryptPasswordFunction"] = EncryptPasswordFunction;
/* harmony export (immutable) */ __webpack_exports__["LocationObserverFunction"] = LocationObserverFunction;
/* harmony export (immutable) */ __webpack_exports__["GetLocalDataFunction"] = GetLocalDataFunction;
/* harmony export (immutable) */ __webpack_exports__["registerCommonPushEvent"] = registerCommonPushEvent;
/* harmony export (immutable) */ __webpack_exports__["ReloadPageFunction"] = ReloadPageFunction;
/* harmony export (immutable) */ __webpack_exports__["OpenThirdPartMapFunction"] = OpenThirdPartMapFunction;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__);




function connectWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge);
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady', function () {
      callback(WebViewJavascriptBridge);
    }, false);
  }
}

function callHandler(method, data) {
  return new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (res, rej) {
    connectWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler(method, data, function (responseData) {
        try {
          if (responseData) {
            res(JSON.parse(responseData));
          }
        } catch (e) {
          res(responseData);
        }
      });
    });
  });
}

function registerHandler(method, callback) {
  connectWebViewJavascriptBridge(function (bridge) {
    bridge.registerHandler(method, function (data) {
      callback(data);
    });
  });
}

function GetUserInfoFunction() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return callHandler('GetUserInfoFunction', data);
}

function EncryptionFunction(data) {
  return callHandler('EncryptionFunction', data);
}

function DecryptionFunction(data) {
  return callHandler('DecryptionFunction', data);
}

function QueryCompanyDetailFunction(cpyInfo) {
  return callHandler('QueryCompanyDetailFunction', cpyInfo);
}

function CommonDialogFunction(confirmJson) {
  return callHandler('CommonDialogFunction', __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(confirmJson));
}

function ToastFunction(tips) {
  return callHandler('ToastFunction', {
    toastData: tips,
    duration: 0 });
}

function PopMenuFunction(appData) {
  return callHandler('PopMenuFunction', appData);
}

function SelectProvinceWidget(provinceListAll) {
  return callHandler('SelectProvinceWidgetFunction', provinceListAll);
}

function FilePreviewWidget(previemJson) {
  return callHandler('PreviewFunction', previemJson);
}

function SelectTimeWidget(selectTimeJson) {
  return callHandler('SelectTimeWidgetFunction', selectTimeJson);
}

function addAppViewListener(appViewId, appViewAction, appViewOperator, appViewName, func) {
  callHandler('addAppViewListener', {
    appViewId: appViewId,
    appViewAction: appViewAction,
    appViewOperator: appViewOperator,
    appViewName: appViewName
  });

  registerHandler('appViewCallBack', function (data) {
    if (func) {
      func();
    }
  }.bind(this));
}

function RegisterMenuFunction(menuList) {

  callHandler('RegisterMenuFunction', menuList);

  registerHandler('clickMenuCallBack', function (data) {
    var dataJson = JSON.parse(data);

    if (menuList) {
      for (var i = 0; i < menuList.length; i++) {
        if (dataJson.menuId == menuList[i].menuId && menuList[i].func) {
          menuList[i].func();
          break;
        }
      }
    }
  }.bind(this));
}

function goBackFunction_new(url, backSteps, loadData) {
  var data = { loadData: '', url: url };
  if (backSteps) {
    data.backSteps = backSteps;
  }
  if (loadData) {
    data.loadData = loadData;
  }
  callHandler('goBackFunction', __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(data));
}

function goBackFunction(url) {
  callHandler('goBackFunction', __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({ loadData: '', url: url }));
}

function notifyAppBackEvent() {
  callHandler('notifyAppBackEvent', '');
}

function ClearWebViewCache() {
  callHandler('ClearWebViewCacheHandler', '');
}

function OpenActionFunction(str) {
  return callHandler('OpenActionFunction', str);
}

function verifySignFunction(fnt, signData) {
  return callHandler(fnt, signData);
}

function TPayGetDssStatusFunction() {
  return callHandler('TPayGetDssStatusFunction', '');
}

function ConnectDssBb(dev) {
  return callHandler('ConnectDssBbFunction', dev);
}

function LoginDss(codeUserData) {
  return callHandler('LoginDssFunction', codeUserData);
}

function ModifyDssPsw(dssPswData) {
  return callHandler('ModifyDssPswFunction', dssPswData);
}

function GetDssAccountList() {
  return callHandler('GetDssAccountListFunction', '');
}

function CalculatePassword(signData) {
  return callHandler('CalculatePasswordFunction', signData);
}

function SetDssUserFun(setUserData) {
  return callHandler('SetDssUserFunction', setUserData);
}

function GetAppConfigFunction() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return callHandler('GetAppConfigFunction', data);
}

function getBankType(vm) {
  var _this = vm;
  callHandler('GetAppConfigFunction', { key: 'bankId' }).then(function (data) {
    console.log('before:' + _this.appBankType);
    if (3 === Number(data.value)) {
      _this.appBankType = 2;
    } else {
      _this.appBankType = 1;
    }
    console.log('after:' + _this.appBankType);
  });
}

function CheckNetWorkFunction() {
  return callHandler('CheckNetWorkFunction', '');
}

function popWindowFunction(targetUrl) {
  callHandler('PopWindowFunction', __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({ url: targetUrl }));
}

function SignDataFunction(data) {
  return callHandler('SignDataFunction', data);
}

function EncryptPasswordFunction(data) {
  return callHandler('EncryptPasswordFunction', data);
}

function LocationObserverFunction(data) {
  callHandler('LocationObserverFunction', data);
}

function GetLocalDataFunction(data) {
  var result = { "ret": 0, "IMEI": 1111111111, "terType": 0 };
  return result;
}

function registerCommonPushEvent() {
  callHandler('RegisterCommonPushFunction', '');
}

function ReloadPageFunction() {
  callHandler('ReloadPageFunction', '');
}

function OpenThirdPartMapFunction(data) {
  callHandler('OpenThirdPartMapFunction', data);
}

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(17);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(5).f;
var has = __webpack_require__(6);
var TAG = __webpack_require__(1)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["setStorage"] = setStorage;
/* harmony export (immutable) */ __webpack_exports__["getStorage"] = getStorage;
/* harmony export (immutable) */ __webpack_exports__["deleteStorage"] = deleteStorage;
/* harmony export (immutable) */ __webpack_exports__["deleteStorageByName"] = deleteStorageByName;
/* harmony export (immutable) */ __webpack_exports__["deleteSessionStorage"] = deleteSessionStorage;
/* harmony export (immutable) */ __webpack_exports__["setSessionStorage"] = setSessionStorage;
/* harmony export (immutable) */ __webpack_exports__["getSessionStorage"] = getSessionStorage;
/* harmony export (immutable) */ __webpack_exports__["getUrlParams"] = getUrlParams;
/* harmony export (immutable) */ __webpack_exports__["throttle"] = throttle;
/* harmony export (immutable) */ __webpack_exports__["prefixInteger"] = prefixInteger;
/* harmony export (immutable) */ __webpack_exports__["pad"] = pad;
/* harmony export (immutable) */ __webpack_exports__["insert_flg"] = insert_flg;
/* harmony export (immutable) */ __webpack_exports__["sumStrings"] = sumStrings;
/* harmony export (immutable) */ __webpack_exports__["minusString"] = minusString;
/* harmony export (immutable) */ __webpack_exports__["moneyStringFixTwo"] = moneyStringFixTwo;
/* harmony export (immutable) */ __webpack_exports__["stringFixTwoWithType"] = stringFixTwoWithType;
/* harmony export (immutable) */ __webpack_exports__["transArrToStr"] = transArrToStr;
/* harmony export (immutable) */ __webpack_exports__["moneyUppercase"] = moneyUppercase;
/* harmony export (immutable) */ __webpack_exports__["isEmptyObject"] = isEmptyObject;
/* harmony export (immutable) */ __webpack_exports__["isEqual"] = isEqual;
/* harmony export (immutable) */ __webpack_exports__["utf16to8"] = utf16to8;
/* harmony export (immutable) */ __webpack_exports__["openPage"] = openPage;
/* harmony export (immutable) */ __webpack_exports__["locationPage"] = locationPage;
/* harmony export (immutable) */ __webpack_exports__["goBackPage_new"] = goBackPage_new;
/* harmony export (immutable) */ __webpack_exports__["goBackPage"] = goBackPage;
/* harmony export (immutable) */ __webpack_exports__["CheckNetWork"] = CheckNetWork;
/* harmony export (immutable) */ __webpack_exports__["isPC"] = isPC;
/* harmony export (immutable) */ __webpack_exports__["showToast"] = showToast;
/* harmony export (immutable) */ __webpack_exports__["showSuccessPop"] = showSuccessPop;
/* harmony export (immutable) */ __webpack_exports__["showConfirm"] = showConfirm;
/* harmony export (immutable) */ __webpack_exports__["getClass"] = getClass;
/* harmony export (immutable) */ __webpack_exports__["getBase64Image"] = getBase64Image;
/* harmony export (immutable) */ __webpack_exports__["newTitlePng"] = newTitlePng;
/* harmony export (immutable) */ __webpack_exports__["initTitleMenu"] = initTitleMenu;
/* harmony export (immutable) */ __webpack_exports__["setTitleOnly"] = setTitleOnly;
/* harmony export (immutable) */ __webpack_exports__["genArrValueByKey"] = genArrValueByKey;
/* harmony export (immutable) */ __webpack_exports__["delRepeat"] = delRepeat;
/* harmony export (immutable) */ __webpack_exports__["getIndexUrl"] = getIndexUrl;
/* harmony export (immutable) */ __webpack_exports__["getBLength"] = getBLength;
/* harmony export (immutable) */ __webpack_exports__["checkEmail"] = checkEmail;
/* harmony export (immutable) */ __webpack_exports__["checkWebsite"] = checkWebsite;
/* harmony export (immutable) */ __webpack_exports__["getBankConfig"] = getBankConfig;
/* harmony export (immutable) */ __webpack_exports__["getBankAddress"] = getBankAddress;
/* harmony export (immutable) */ __webpack_exports__["getUrlConfig"] = getUrlConfig;
/* harmony export (immutable) */ __webpack_exports__["getToken"] = getToken;
/* harmony export (immutable) */ __webpack_exports__["openLonginPage"] = openLonginPage;
/* harmony export (immutable) */ __webpack_exports__["GUID"] = GUID;
/* harmony export (immutable) */ __webpack_exports__["getNativeInfo"] = getNativeInfo;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_typeof__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_typeof___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_typeof__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__SnJsBridge_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__lib_ConstantData_js__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__imgBase64Map_js__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_style_themeconfig__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__lib_common_Net_js__ = __webpack_require__(59);











Date.prototype.format = function (fmt) {
    var showDayArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "E+": showDayArr[this.getDay()],
        "D+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds() };
    if (/(y+)/i.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return fmt;
};

Array.prototype.contains = function (ele) {
    for (var i in this) {
        if (this[i] == ele) return true;
    }
    return false;
};

String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
};

String.prototype.compare = function (str) {
    if (this.toLowerCase() == str.toLowerCase()) {
        return true;
    } else {
        return false;
    }
};

function getCookie(key) {
    var str = document.cookie;
    if (!str || str.indexOf(key + "=") < 0) return;
    var cookies = str.split("; ");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        if (cookie.indexOf(key + "=") == 0) {
            var value = cookie.substring(key.length + 1);
            return decodeURI(value);
        }
    }
}

function setCookie(key, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = key + "=" + encodeURI(value) + (expiredays == null ? "" : ";expires=" + exdate.toGMTString() + ";path=/");
}

function delCookie(key) {
    var curVal = getCookie(key);
    var exp = new Date();
    exp.setTime(exp.getTime() - 10);
    if (null != curVal) {
        document.cookie = key + '=' + encodeURI(curVal) + ';expires=' + exp.toGMTString();
    }
}

function setStorage(key, value) {
    if (window.localStorage) {
        var storage = window.localStorage;
        storage.setItem(key, value);
    } else {
        setCookie(key, value, cacheExpiredays);
    }
}

function getStorage(key) {
    if (window.localStorage) {
        var storage = window.localStorage;
        if ("undefined" != typeof storage.getItem(key) && null != storage.getItem(key) && "" != storage.getItem(key)) {
            return storage.getItem(key);
        } else {
            return "";
        }
    } else {
        getCookie(key);
    }
}

function deleteStorage(key) {
    if (window.localStorage) {
        localStorage.removeItem(key);
    } else {
        delCookie(key);
    }
}

function deleteStorageByName(key) {
    if (window.localStorage) {
        for (var i = 0; i < localStorage.length; i++) {
            var storageKey = localStorage.key(i);
            if (storageKey.indexOf(key) > -1) {
                localStorage.removeItem(storageKey);
                i--;
            }
        }
    } else {
        delCookie(key);
    }
}

function deleteSessionStorage(key) {
    if (window.sessionStorage) {
        sessionStorage.removeItem(key);
    } else {
        delCookie(key);
    }
}

function setSessionStorage(key, value) {
    if (window.sessionStorage) {
        var storage = window.sessionStorage;
        storage.setItem(key, value);
    }
}

function getSessionStorage(key) {
    if (window.sessionStorage) {
        var storage = window.sessionStorage;
        if ("undefined" != typeof storage.getItem(key) && null != storage.getItem(key) && "" != storage.getItem(key)) {
            return storage.getItem(key);
        } else {
            return "";
        }
    }
}

function getUrlParams() {
    var url = window.location.href;
    var regexP = /[^#&\?]+=[^#&\?]*/ig,
        res = {};
    var ms = url.match(regexP);
    if (ms) {
        for (var i = 0; i < ms.length; i++) {
            var arr = ms[i].split('=');
            res[arr[0]] = decodeURI(arr[1]);
        }
    }
    return res;
}

function throttle(func, context) {
    if (throttle.ready) {
        throttle.ready = false;
        func.call(context);
        window.setTimeout(function () {
            throttle.ready = true;
        }, 1000);
    }
}
throttle.ready = true;

function prefixInteger(num, length) {
    var num = (num + '').replace(/d/g, '');
    return (Array(length).join('0') + num).slice(-length);
}

function pad(num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}

function insert_flg(str, flg, sn) {
    var newstr = "";

    if (3 > str.length) {
        str = pad(str, 3);
        sn = 1;
    }

    var arr = str.split("");

    for (var i = 0; i < arr.length; i++) {
        if (i == sn) {
            newstr += flg;
        }
        newstr += arr[i];
    }

    return newstr;
}

function sumStrings(a, b) {
    a = a || '';
    b = b || '';
    a = a + "";
    b = b + "";
    var res = '',
        c = 0;
    a = a.split('');
    b = b.split('');
    while (a.length || b.length || c) {
        c += ~~a.pop() + ~~b.pop();
        res = c % 10 + res;
        c = c > 9;
    }
    return res.replace(/^0+/, '');
}

function minusString(a, b) {
    var negativeFlag = false;
    a = a || '';
    b = b || '';
    a = a + "";
    b = b + "";
    var res = '',
        c = 0,
        temp = '',
        tempArr = [];
    if (a.length < b.length) {
        negativeFlag = true;
    } else if (a.length == b.length) {
        var a1 = a.split('');
        var b1 = b.split('');
        while (a1.length) {
            var a2 = ~~a1.shift();
            var b2 = ~~b1.shift();
            if (a2 > b2) {
                break;
            } else if (a2 < b2) {
                negativeFlag = true;
                break;
            }
        }
    }
    if (negativeFlag) {
        temp = a;
        a = b;
        b = temp;
    }
    a = a.split('');
    b = b.split('');
    while (a.length || b.length) {
        c += ~~a.pop() - ~~b.pop() + 10;
        res = c % 10 + res;
        c = c > 9 ? 0 : -1;
    }
    return res.replace(/^0+/, '');
}

function moneyStringFixTwo(ms) {
    var moneyDis = "";
    ms = ms + "";
    ms = ms.replace(/[^\d]/g, '');
    if (ms.length < 3) {
        ms = pad(ms, 3);
    }
    moneyDis = insert_flg(ms, ".", ms.length - 2);
    var l = moneyDis.split(".")[0].split("").reverse(),
        r = moneyDis.split(".")[1],
        t = "";
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
    }
    var moneyDisBig = t.split("").reverse().join("") + "." + r;
    return moneyDisBig;
}

function stringFixTwoWithType(ms, type) {
    var moneyDis = "";
    ms = ms + "";

    if (ms.indexOf(".") > 0) {
        var dotnum = ms.split(".")[1];
        if (dotnum.length == 1) {
            ms = ms + "0";
        } else if (dotnum.length == 0) {
            ms = ms + "00";
        } else if (dotnum.length > 2) {
            var value = parseFloat(ms);
            value = (ms / 100).toFixed(2);
            ms = value + "";
        }
        ms = ms.replace(/,/g, "").replace(".", "");
    }

    if (ms.indexOf(".") < 0) {
        if (ms.length < 3) {
            ms = pad(ms, 3);
        }
        moneyDis = insert_flg(ms, ".", ms.length - 2);
    }
    return moneyDis + type;
}

function transArrToStr(arr, arrJson, str) {
    var result = "";
    if (0 > arr.length) {
        return result;
    }
    arr.forEach(function (i) {
        result += "${" + (arrJson[i] || '0') + "}" + str;
    });

    if (0 < result.length) {
        result = result.substr(0, result.length - 1);
    }
    return result;
}

function moneyUppercase(num) {
    var Num = num + "";
    Num = insert_flg(Num, ".", Num.length - 2);
    var part = Num.split(".");
    var newchar = "";
    var perchar = "";
    var tmpnewchar = "";
    for (var i = part[0].length - 1; i >= 0; i--) {
        if (part[0].length > 20) {
            tipsBox("数字过大，无法计算");return "";
        }
        tmpnewchar = "";
        perchar = part[0].charAt(i);
        switch (perchar) {
            case "0":
                tmpnewchar = "零" + tmpnewchar;break;
            case "1":
                tmpnewchar = "壹" + tmpnewchar;break;
            case "2":
                tmpnewchar = "贰" + tmpnewchar;break;
            case "3":
                tmpnewchar = "叁" + tmpnewchar;break;
            case "4":
                tmpnewchar = "肆" + tmpnewchar;break;
            case "5":
                tmpnewchar = "伍" + tmpnewchar;break;
            case "6":
                tmpnewchar = "陆" + tmpnewchar;break;
            case "7":
                tmpnewchar = "柒" + tmpnewchar;break;
            case "8":
                tmpnewchar = "捌" + tmpnewchar;break;
            case "9":
                tmpnewchar = "玖" + tmpnewchar;break;
        }
        switch ((part[0].length - i - 1) % 8) {
            case 0:
                switch ((part[0].length - i - 1) / 8) {
                    case 0:
                        tmpnewchar = tmpnewchar + "元";
                        break;
                    case 1:
                        tmpnewchar = tmpnewchar + "亿";
                        break;
                    default:
                        break;
                }

                break;
            case 1:
                if (perchar != 0) tmpnewchar = tmpnewchar + "拾";break;
            case 2:
                if (perchar != 0) tmpnewchar = tmpnewchar + "佰";break;
            case 3:
                if (perchar != 0) tmpnewchar = tmpnewchar + "仟";break;
            case 4:
                if (part[0].substr(0, 4) > 0) tmpnewchar = tmpnewchar + "万";break;
            case 5:
                if (perchar != 0) tmpnewchar = tmpnewchar + "拾";break;
            case 6:
                if (perchar != 0) tmpnewchar = tmpnewchar + "佰";break;
            case 7:
                if (perchar != 0) tmpnewchar = tmpnewchar + "仟";break;
        }
        newchar = tmpnewchar + newchar;
    }
    if (Num.indexOf(".") != -1) {
        if (part[1].length > 2) {
            part[1] = part[1].substr(0, 2);
        }
        for (var i = 0; i < part[1].length; i++) {
            tmpnewchar = "";
            perchar = part[1].charAt(i);
            switch (perchar) {
                case "0":
                    tmpnewchar = "零" + tmpnewchar;break;
                case "1":
                    tmpnewchar = "壹" + tmpnewchar;break;
                case "2":
                    tmpnewchar = "贰" + tmpnewchar;break;
                case "3":
                    tmpnewchar = "叁" + tmpnewchar;break;
                case "4":
                    tmpnewchar = "肆" + tmpnewchar;break;
                case "5":
                    tmpnewchar = "伍" + tmpnewchar;break;
                case "6":
                    tmpnewchar = "陆" + tmpnewchar;break;
                case "7":
                    tmpnewchar = "柒" + tmpnewchar;break;
                case "8":
                    tmpnewchar = "捌" + tmpnewchar;break;
                case "9":
                    tmpnewchar = "玖" + tmpnewchar;break;
            }
            if (i == 0) tmpnewchar = tmpnewchar + "角";
            if (i == 1) tmpnewchar = tmpnewchar + "分";
            newchar = newchar + tmpnewchar;
        }
    }
    while (newchar.search("零零") != -1) {
        newchar = newchar.replace("零零", "零");
    }
    newchar = newchar.replace("零亿", "亿");
    newchar = newchar.replaceAll("零万", "万");
    newchar = newchar.replace("亿万", "亿");
    newchar = newchar.replace("零元", "元");
    newchar = newchar.replace("零角", "");
    newchar = newchar.replace("零分", "");
    if (newchar == "") {
        newchar = "零元";
    }
    if (newchar.charAt(newchar.length - 1) == "元") {
        newchar = newchar + "整";
    }
    if (newchar.charAt(newchar.length - 1) == "拾" || newchar.charAt(newchar.length - 1) == "佰" || newchar.charAt(newchar.length - 1) == "仟" || newchar.charAt(newchar.length - 1) == "万") {
        newchar = newchar + "元整";
    }
    if (newchar == "元整") {
        newchar = "零元";
    }
    if (newchar.substring(0, 1) == "元") {
        newchar = newchar.substring(1, newchar.length);
    }
    return newchar;
}

function isEmptyObject(e) {
    for (var t in e) {
        return !1;
    }
    return !0;
}

function isEqual(x, y) {
    if (x === y) {
        return true;
    }

    if (!(x instanceof Object) || !(y instanceof Object)) {
        return false;
    }

    if (x.constructor !== y.constructor) {
        return false;
    }

    for (var p in x) {
        if (x.hasOwnProperty(p)) {
            if (!y.hasOwnProperty(p)) {
                return false;
            }

            if (x[p] === y[p]) {
                continue;
            }

            if (__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_typeof___default()(x[p]) !== "object") {
                return false;
            }

            if (!isEqual(x[p], y[p])) {
                return false;
            }
        }
    }

    for (p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
            return false;
        }
    }
    return true;
}

function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x0001 && c <= 0x007F) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | c >> 12 & 0x0F);
            out += String.fromCharCode(0x80 | c >> 6 & 0x3F);
            out += String.fromCharCode(0x80 | c >> 0 & 0x3F);
        } else {
            out += String.fromCharCode(0xC0 | c >> 6 & 0x1F);
            out += String.fromCharCode(0x80 | c >> 0 & 0x3F);
        }
    }
    return out;
}

function openPage(url) {
    CheckNetWork(function () {
        window.open(url);
    }, this);
}

function locationPage(url) {
    CheckNetWork(function () {
        window.location.href = url;
    }, this);
}

function goBackPage_new(url, backSteps, loadData) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__SnJsBridge_js__["goBackFunction_new"])(url, backSteps, loadData);
}

function goBackPage(url) {
    CheckNetWork(function () {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__SnJsBridge_js__["goBackFunction"])(url);
    }, this);
}

function CheckNetWork(func, content) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__SnJsBridge_js__["CheckNetWorkFunction"])().then(function (statusData) {
        if (statusData.contectState) {
            if (func) {
                func.call(content);
            }
        } else {
            showToast('网络连接不可用', 'middle');
        }
        return statusData;
    });
}

function isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;break;
        }
    }
    return flag;
}

function tipsBox(tipsText, delayTime) {
    var time = 200;
    if (delayTime != undefined) {
        time = delayTime;
    }
    if ($(".tipsBox").length == 0) {
        $("body").append("<div class='tipsBox' style='display:none;position:fixed;width:100%;bottom:30%;left:0;text-align:center;z-index:1101'><span style='max-width:60%;margin:0 auto;display:inline-block;border-radius:5px;padding:12px 24px;font-size:16px;color:#fff;background:rgba(0,0,0,0.9);box-shadow:1px 1px 5px #b2b2b2'>" + tipsText + "</span></div>");
        $(".tipsBox").stop().delay(time).animate({ opacity: 'show' }, 0).delay(2000).animate({ opacity: 'hide' }, 350, function () {
            $(".tipsBox").remove();
        });
        $(document).on("click", ".tipsBox", function () {
            $(".tipsBox").stop().animate({ opacity: 'hide' }, 150, function () {
                $(".tipsBox").remove();
            });
        });
    }
}

function showToast(tips, position, time, type) {

    tipsBox(tips, time);
    return;

    var type = type || 'text';
    var position = position || 'middle';
    var time = time || 2000;
    __WEBPACK_IMPORTED_MODULE_3_vue___default.a.$vux.toast.show({
        text: tips,
        time: time,
        position: position,
        type: type
    });
}

function successPop(successText, delayTime) {
    var time = 200;
    if (delayTime != undefined) {
        time = delayTime;
    }
    $("body").append('<div class="sub_prompt_box"><div class="sub_prompt"><div></div><span>' + successText + '</span></div></div>');
    $(".sub_prompt_box").stop().delay(time).animate({ opacity: 'show' }, 0).delay(2000).animate({ opacity: 'hide' }, 350, function () {
        $(".sub_prompt_box").remove();
    });
}

function showSuccessPop(successText, delayTime) {
    successPop(successText, delayTime);
}

function showConfirm(content, rightFunction, type, strLeftBtn, strRightBtn, title, leftFunction, H5Flag) {
    var type = type || 2;
    if (!H5Flag) {
        if (2 == type) {
            strLeftBtn = strLeftBtn || '取消';
            strRightBtn = strRightBtn || '确认';
            if (isPC()) {
                var tempFun = rightFunction;
                rightFunction = leftFunction;
                leftFunction = tempFun;
                var tempText = strRightBtn;
                strRightBtn = strLeftBtn || '取消';
                strLeftBtn = tempText || '确认';
            }
        };
        var confirmJson = {
            requestCode: 0,
            strTitle: title,
            message: content,
            strLeftBtn: strLeftBtn,
            rightBtnFontColor: __WEBPACK_IMPORTED_MODULE_7__components_style_themeconfig__["themeColor"] || '#478aee',
            strRightBtn: strRightBtn
        };

        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__SnJsBridge_js__["CommonDialogFunction"])(confirmJson).then(function (data) {
            if (3 == data.clickType) {
                if (rightFunction) {
                    rightFunction();
                }
            } else if (2 == data.clickType) {
                if (leftFunction) {
                    leftFunction();
                }
            }
        });
    } else {
        if (2 == type) {
            __WEBPACK_IMPORTED_MODULE_3_vue___default.a.$vux.confirm.show({
                title: title || '',
                content: content,
                onShow: function onShow() {
                    console.log('show');
                },
                onHide: function onHide() {
                    console.log('hide');
                },
                onCancel: function onCancel() {
                    leftFunction();
                },
                onConfirm: function onConfirm() {
                    rightFunction();
                }
            });
        } else {
            alert(content);
        }
    }
}

function getClass(object) {
    return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace("data:image/png;base64,", "");
}
function newTitlePng(src) {
    var img = document.createElement('img');
    var baseImg;
    var data = '';
    img.src = src;
    img.onload = function () {
        data = getBase64Image(img);
        console.log('img:' + data);
        return data;
    };
}

function initTitleMenu(menuList) {
    var helpUrl = '';
    var path = '';
    if (isPC()) {
        path = 'pc';
        helpUrl = 'yqt.html?active=90';
    } else {
        path = 'app';
        helpUrl = 'yqt.html?active=97';
    }
    var imgBase64MapJson = __WEBPACK_IMPORTED_MODULE_6__imgBase64Map_js__["imgBase64Map"][path];
    var menuMap = {
        menuTitle: { name: menuList[0], menuId: 'title', type: 3 }
    };
    var titleMenuList = [menuMap.menuTitle];
    for (var i = 1; i < menuList.length; i++) {
        var menuName = menuList[i];
        if ('String' == getClass(menuName)) {
            titleMenuList.push(menuMap[menuName]);
        } else if ('Object' == getClass(menuName)) {
            titleMenuList.push(menuName);
        }
    }
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__SnJsBridge_js__["RegisterMenuFunction"])(titleMenuList);
}

function setTitleOnly(title) {
    initTitleMenu([title]);
}

function genArrValueByKey(Arr, Object) {
    var res = JSON.parse(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify___default()(Arr));
    res.map(function (item, index) {
        if ('money' == item.type && Object[item.value]) {
            return item.value = moneyStringFixTwo(Object[item.value]);
        } else if ('date' == item.type && Object[item.value]) {
            return item.value = new Date(Object[item.value] * 1000).format(item.frt);
        } else if (Object[item.value]) {
            return item.value = Object[item.value];
        }
    });
    return res;
}

function delRepeat(arr1, arr2) {
    var arr = arr1.concat(arr2);
    var lastArr = [];
    for (var i = 0; i < arr.length; i++) {
        if (!unique(arr[i], lastArr)) {
            lastArr.push(arr[i]);
        }
    }
    return lastArr;
}
function unique(n, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (n == arr[i]) {
            return true;
        }
    }
    return false;
}

function getIndexUrl() {
    var getIndexUrl = 'yqt.html?active=1';
    if (!!getStorage('indexUrl')) {
        getIndexUrl = JSON.parse(getStorage('indexUrl'));
    }
    return getIndexUrl;
}

function getBLength(str) {
    var realLength = 0;
    var len = str.length;
    var charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
            realLength += 1;
        } else {
            realLength += 2;
        }
    }
    return realLength;
}

function checkEmail(value) {
    if (!!value && value != "") {
        var websiteCheck = /(^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$)|(^$)/.test(value);
        if (!websiteCheck) {
            return false;
        }
    }
    return true;
}

function checkWebsite(value) {
    if (!!value && value != "") {
        var reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
        if (!reg.test(value)) {
            return false;
        }
    }
    return true;
}

function getBankConfig() {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__lib_common_Net_js__["doPost"])('common/getBankConfig.do', {}).then(function (result) {
        if (!!result && result.data && !!result.data.bankInfo) {
            var bankconfig = result.data.bankInfo[0];
            bankconfig.iconImg = './resource/img/bankicon/' + bankconfig.iconId + '.png';
            return bankconfig;
        }
    });
}

function getBankAddress() {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__lib_common_Net_js__["doPost"])('common/getBankAddress.do', {}).then(function (result) {
        if (!!result && result.data) {
            var bankAddress = result.data;
            return bankAddress;
        }
    });
}

function getUrlConfig() {
    var param = {};
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__lib_common_Net_js__["doPost"])('common/getUrlConfig.do', param, null, true).then(function (result) {
        if (!!result) {
            var urlConfig = result;
            domainMap.forEach(function (item) {
                if (item.id != 'travelURL') {
                    urlConfig[item.id] = result.pageSubPath[item.zkId] + item.name;
                }
            });

            return urlConfig;
        }
    });
}

function getToken() {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__lib_common_Net_js__["doPost"])('openAccount/getToken.do').then(function (result) {
        if (!!result && result.data) {
            return result.data;
        }
    });
}

function openLonginPage() {
    var openLonginJson = {
        action: 'IntentAction_LoginPage',
        dataList: []
    };
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__SnJsBridge_js__["OpenActionFunction"])(openLonginJson).then(function (data) {});
}

function GUID() {
    this.date = new Date();
    if (typeof this.newGUID != 'function') {
        GUID.prototype.newGUID = function () {
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
        };

        GUID.prototype.getGUIDDate = function () {
            return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
        };

        GUID.prototype.getGUIDTime = function () {
            return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10));
        };

        GUID.prototype.addZero = function (num) {
            if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
                return '0' + Math.floor(num);
            } else {
                return num.toString();
            }
        };
        GUID.prototype.hexadecimal = function (num, x, y) {
            if (y != undefined) {
                return parseInt(num.toString(), y).toString(x);
            } else {
                return parseInt(num.toString()).toString(x);
            }
        };

        GUID.prototype.formatGUID = function (guidStr) {
            var str1 = guidStr.slice(0, 8) + '-',
                str2 = guidStr.slice(8, 12) + '-',
                str3 = guidStr.slice(12, 16) + '-',
                str4 = guidStr.slice(16, 20) + '-',
                str5 = guidStr.slice(20);
            return str1 + str2 + str3 + str4 + str5;
        };
    }
}

function getNativeInfo(nativeInfo) {
    return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (res, rej) {
        if (nativeInfo.UAId) {
            res(nativeInfo);
        } else {
            return GetUserInfoFunction().then(function (uaData) {
                if (!!uaData) {
                    nativeInfo.UAId = uaData.UAId;
                    nativeInfo.cpyId = uaData.cpyId;
                    nativeInfo.UAName = uaData.uName;
                    nativeInfo.orgId = uaData.orgId;
                    nativeInfo.orgName = uaData.orgName;
                    nativeInfo.uPhone = uaData.uPhone;
                    if (!!uaData.deviceId) {
                        nativeInfo.deviceId = uaData.deviceId;
                    }
                    if (!!uaData.token) {
                        nativeInfo.token = JSON.parse(uaData.token);
                    }
                    res(nativeInfo);
                }
            });
        }
    });
}

__WEBPACK_IMPORTED_MODULE_3_vue___default.a.filter('imgUrl', function (value) {
    if (!value) return '';
    value = "resource/img/" + value + ".png";
    return value;
});

__WEBPACK_IMPORTED_MODULE_3_vue___default.a.filter('moneyFrt', function (value, frtZeroFlag) {
    if (!value || 0 == value) {
        if (frtZeroFlag) {
            return '0.00';
        }
        return '0';
    }

    if (-1 == value) return '无金额';
    return moneyStringFixTwo(value);
});

__WEBPACK_IMPORTED_MODULE_3_vue___default.a.filter('unitsFrt', function (value, unit, pointlength) {
    if (pointlength == 2) {
        value = stringFixTwoWithType(value, '');
    }
    if (pointlength == 1) {
        value = value / 10;
    }
    if (!!unit) {
        if (!value) return '0' + unit;
        return value + unit;
    } else {
        return value;
    }
});

__WEBPACK_IMPORTED_MODULE_3_vue___default.a.filter('replaceChar', function (value, str, begin, end) {
    var value = value + '';
    var fstStr = value.substring(0, begin);
    var scdStr = value.substring(begin, end);
    var lstStr = value.substring(end, value.length);
    return fstStr + scdStr.replace(/\w/g, str) + lstStr;
});

__WEBPACK_IMPORTED_MODULE_3_vue___default.a.filter('radioFrt', function (value, radioList) {
    var text = '';
    if (!value && 0 != value) return text;
    var reg = new RegExp("^[0-9]*$");
    if (reg.test(value)) {
        if (!!radioList) {
            radioList.forEach(function (item) {
                if (value == item.id) {
                    text = item.text;
                }
            });
        }
    } else {
        text = value;
    }
    return text;
});

__WEBPACK_IMPORTED_MODULE_3_vue___default.a.filter('selectFrt', function (value, selectList, textFlag) {
    var text = '';
    if (textFlag) return value;
    if (!value && 0 != value) return text;
    if (!!selectList) {
        selectList.forEach(function (item) {
            if (value == item.value) {
                text = item.dispValue;
            }
        });
    }
    return text;
});

__WEBPACK_IMPORTED_MODULE_3_vue___default.a.filter('dateFrt', function (value, formatDate) {
    var text = '';
    if (formatDate.serverFormat == 'timestamp') {
        var dateVelue = Number(value);
        if (isNaN(dateVelue)) {
            text = value;
        } else {
            text = new Date(dateVelue * 1000).format(formatDate.format);
        }
    } else if (formatDate.serverFormat == 'YYYYMMDD') {
        var dataStr = value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8);
        text = new Date(dataStr).format(formatDate.format);
    } else {
        var dateVelue = Number(value);
        if (isNaN(dateVelue)) {
            text = value;
        } else {
            text = new Date(dateVelue * 1000).format(formatDate);
        }
    }
    return text;
});

__WEBPACK_IMPORTED_MODULE_3_vue___default.a.filter('strTrueLength', function (str) {
    var re = /[\u4E00-\u9FA5]/g;
    var tempL = str.length;
    var tempCL = 0;
    if ('' == str.match(re) || null == str.match(re)) {
        tempCL = 0;
    } else {
        tempCL = str.match(re).length;
    }
    var tempTL = Math.ceil((tempL - tempCL) * 0.5 + tempCL);
    return tempTL;
});

__WEBPACK_IMPORTED_MODULE_3_vue___default.a.filter('bankFrt', function (account) {
    var bankType = getStorage("bankType") || 1;
    return (__WEBPACK_IMPORTED_MODULE_5__lib_ConstantData_js__["bankMap"][bankType] || {}).name + "(" + account.slice(-4) + ")";
});

__WEBPACK_IMPORTED_MODULE_3_vue___default.a.filter('iconFrt', function (account) {
    var bankType = getStorage("bankType") || 1;
    return "resource/img/tempicon/" + (__WEBPACK_IMPORTED_MODULE_5__lib_ConstantData_js__["bankMap"][bankType] || {}).icon;
});

__WEBPACK_IMPORTED_MODULE_3_vue___default.a.filter('percentFrt', function (percent) {
    if (percent == 0) {
        return 0;
    }
    var str = Number(percent / 1000).toFixed(3);
    str += "%";
    return str;
});

__WEBPACK_IMPORTED_MODULE_3_vue___default.a.directive('imgfid', function (el, binding) {
    var imgBlob = undefined;
    var blob = binding.value;
    if (blob != undefined && blob != "") {
        try {
            imgBlob = new Blob([blob], { type: 'image/png' });
        } catch (e) {
            window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
            if (e.name == 'TypeError' && window.BlobBuilder) {
                var bb = new BlobBuilder();
                bb.append(blob);
                imgBlob = bb.getBlob("image/png");
            } else if (e.name == "InvalidStateError") {
                imgBlob = new Blob([blob], { type: "image/png" });
            }
        }
        var reader = new FileReader();
        reader.readAsDataURL(imgBlob);
        reader.onload = function () {
            el.setAttribute('src', this.result || defaultImgBlob);
        };
    }
});

/***/ }),
/* 24 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(8);
var document = __webpack_require__(0).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(17);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(44);
var enumBugKeys = __webpack_require__(26);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(31)('keys');
var uid = __webpack_require__(22);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(2);
var global = __webpack_require__(0);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(15) ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 32 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(8);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var core = __webpack_require__(2);
var LIBRARY = __webpack_require__(15);
var wksExt = __webpack_require__(35);
var defineProperty = __webpack_require__(5).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(1);


/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

var Base64 = function Base64() {
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    var _utf8_encode = function _utf8_encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
                utftext += String.fromCharCode(c >> 6 | 192);
                utftext += String.fromCharCode(c & 63 | 128);
            } else {
                utftext += String.fromCharCode(c >> 12 | 224);
                utftext += String.fromCharCode(c >> 6 & 63 | 128);
                utftext += String.fromCharCode(c & 63 | 128);
            }
        }
        return utftext;
    };

    var _utf8_decode = function _utf8_decode(utftext) {
        var string = "";
        var i = 0;
        var c = 0,
            c1 = 0,
            c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if (c > 191 && c < 224) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode((c & 31) << 6 | c2 & 63);
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                var c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                i += 3;
            }
        }
        return string;
    };

    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = (chr1 & 3) << 4 | chr2 >> 4;
            enc3 = (chr2 & 15) << 2 | chr3 >> 6;
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    };

    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = enc1 << 2 | enc2 >> 4;
            chr2 = (enc2 & 15) << 4 | enc3 >> 2;
            chr3 = (enc3 & 3) << 6 | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    };

    this.encodeImg = function (img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
        var dataURL = canvas.toDataURL("image/" + ext);
        return dataURL;
    };
};
/* harmony default export */ __webpack_exports__["default"] = (new Base64());

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(13);
var TAG = __webpack_require__(1)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(0).document;
module.exports = document && document.documentElement;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(4) && !__webpack_require__(19)(function () {
  return Object.defineProperty(__webpack_require__(25)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(15);
var $export = __webpack_require__(9);
var redefine = __webpack_require__(47);
var hide = __webpack_require__(7);
var Iterators = __webpack_require__(14);
var $iterCreate = __webpack_require__(81);
var setToStringTag = __webpack_require__(21);
var getPrototypeOf = __webpack_require__(89);
var ITERATOR = __webpack_require__(1)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(3);
var dPs = __webpack_require__(86);
var enumBugKeys = __webpack_require__(26);
var IE_PROTO = __webpack_require__(30)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(25)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(38).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(44);
var hiddenKeys = __webpack_require__(26).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 43 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(6);
var toIObject = __webpack_require__(10);
var arrayIndexOf = __webpack_require__(73)(false);
var IE_PROTO = __webpack_require__(30)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(3);
var isObject = __webpack_require__(8);
var newPromiseCapability = __webpack_require__(27);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(3);
var aFunction = __webpack_require__(17);
var SPECIES = __webpack_require__(1)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(18);
var invoke = __webpack_require__(76);
var html = __webpack_require__(38);
var cel = __webpack_require__(25);
var global = __webpack_require__(0);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(13)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(32);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 51 */
/***/ (function(module, exports) {



/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(92)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(40)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(97);
var global = __webpack_require__(0);
var hide = __webpack_require__(7);
var Iterators = __webpack_require__(14);
var TO_STRING_TAG = __webpack_require__(1)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["formRequest"] = formRequest;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nativeInfo", function() { return nativeInfo; });
/* harmony export (immutable) */ __webpack_exports__["cryptPost"] = cryptPost;
/* harmony export (immutable) */ __webpack_exports__["noCryptPost"] = noCryptPost;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__SnJsBridge_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__extend_js__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lib_base64_js__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__config_request_config__ = __webpack_require__(56);







var urlhost = 'https://tsblackbox.tixin4u.com:18093/SSP-Reservation/home/';
if (window.CLIENT_HOST) {
    urlhost = window.CLIENT_HOST;
}


function formRequest(method, url, data, responseType) {

    function getClass(object) {
        return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
    }
    return new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (res, rej) {
        var tempData = '',
            sendData = null;
        for (var o in data) {
            if (data.hasOwnProperty(o)) {
                tempData += '&' + o + '=' + data[o];
            }
        }
        tempData = tempData.slice(1);
        var xhr = new window.XMLHttpRequest();
        if (method == 'GET') {
            var and = url.indexOf('?') == -1 ? '?' : '&';
            url += and + tempData;
        } else {
            sendData = tempData;
        }
        xhr.open(method, url);
        xhr.timeout = 30000;
        xhr.ontimeout = function (event) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__extend_js__["showToast"])('请求超时');
            rej('xhr.status is not 200');
        };
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;');
        if ('json' != responseType && 'JSON' != responseType) {
            xhr.responseType = responseType || 'text';
        }
        xhr.onreadystatechange = function (e) {
            if (e.currentTarget.readyState === 4) {
                if (e.currentTarget.status == 200) {
                    if ('json' == responseType || 'JSON' == responseType) {
                        var returnRes = e.currentTarget.response;
                        try {
                            if (getClass(returnRes) === 'Object') {
                                res(returnRes);
                            } else if (getClass(returnRes) === 'String') {
                                res(JSON.parse(returnRes));
                            }
                        } catch (e) {
                            res(returnRes);
                        }
                    } else if ('arraybuffer' == responseType) {
                        res(xhr.response);
                    }
                } else {
                    rej('xhr.status is not 200');
                }
            }
        };
        xhr.send(sendData);
    }).catch(function (error) {
        console.log("formRequest Error = " + __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(error));
    });
}

var nativeInfo = {};

function cryptPost(url) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var vm = arguments[2];
    var noCryptType = arguments[3];

    if (noCryptType) {
        var reqUrl = urlhost + url;
        return formRequest('POST', reqUrl, data, 'json').then(function (result) {
            if (result && result.success) {
                return result.result;
            } else {
                var error = result ? result.message : url + ' is error, no message';

                throw new Error(error);
            }
        });
    }
    return new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (res, rej) {
        if (nativeInfo.UAId) {
            res(nativeInfo);
        } else {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__SnJsBridge_js__["GetUserInfoFunction"])({
                isNeedSeesion: true
            }).then(function (uaData) {
                if (uaData) {
                    nativeInfo.UAId = uaData.UAId;
                    nativeInfo.cpyId = uaData.cpyId;
                    nativeInfo.UAName = uaData.uName;
                    nativeInfo.orgId = uaData.orgId;
                    nativeInfo.orgName = uaData.orgName;
                    nativeInfo.uPhone = uaData.uPhone;
                    try {
                        var lgParam = JSON.parse(uaData.lgParam);
                        lgParam.seq = Number(new Date()) / 1000 + '';
                        nativeInfo.lgParam = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(lgParam);
                    } catch (e) {
                        var lgParam = { session: uaData.lgParam };
                        lgParam.seq = Number(new Date()) / 1000 + '';
                        nativeInfo.lgParam = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(lgParam);
                    }
                    if (!!uaData.deviceId) {
                        nativeInfo.deviceId = uaData.deviceId;
                    }
                    if (!!uaData.token) {
                        nativeInfo.token = JSON.parse(uaData.token);
                    }
                    console.log('nativeInfo:' + __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(nativeInfo));
                    res(nativeInfo);
                }
            });
        }
    }).then(function (nativeInfo) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__SnJsBridge_js__["CheckNetWorkFunction"])().then(function (statusData) {
            if (statusData.contectState) {
                if (nativeInfo.UAId) {
                    data.UAId = nativeInfo.UAId;
                    data.cpyId = nativeInfo.cpyId;
                    data.lgParam = nativeInfo.lgParam;
                }
                if (__WEBPACK_IMPORTED_MODULE_5__config_request_config__["cryptPostFlag"]) {
                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__SnJsBridge_js__["EncryptionFunction"])(data).then(function (eData) {
                        var d = {
                            cryptPostFlag: __WEBPACK_IMPORTED_MODULE_5__config_request_config__["cryptPostFlag"],
                            bdata: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({
                                data: eData.encryptData,
                                zip: eData.zip,
                                key: eData.key
                            })
                        };
                        return requestPost(url, vm, d, eData);
                    });
                } else {
                    var d = {
                        cryptPostFlag: __WEBPACK_IMPORTED_MODULE_5__config_request_config__["cryptPostFlag"],
                        bdata: __WEBPACK_IMPORTED_MODULE_4__lib_base64_js__["default"].encode(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(data))
                    };
                    return requestPost(url, vm, d, {});
                }
            } else {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__extend_js__["showToast"])('网络连接不可用', 'middle');
                rej('网络连接不可用');
            }
        });
    });
}

function requestPost(url, vm, d, eData) {
    var reqUrl = urlhost + url;
    return formRequest('POST', reqUrl, d, 'json').then(function (result) {
        if (result && result.success) {
            if (__WEBPACK_IMPORTED_MODULE_5__config_request_config__["cryptPostFlag"]) {
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__SnJsBridge_js__["DecryptionFunction"])({
                    zip: eData.zip,
                    key: eData.key,
                    data: (result.result || {}).data
                }).then(function (dData) {
                    try {
                        return JSON.parse(__WEBPACK_IMPORTED_MODULE_4__lib_base64_js__["default"].decode(dData));
                    } catch (e) {
                        return __WEBPACK_IMPORTED_MODULE_4__lib_base64_js__["default"].decode(dData);
                    }
                });
            } else {
                return (result.result || {}).data;
            }
        } else {
            if (508 == result.result.code) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__extend_js__["openLonginPage"])();
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__extend_js__["goBackPage"])('');
                return;
            }
            if (vm) {
                vm.toastShow = false;
            }
            if (result.message) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__extend_js__["showConfirm"])(result.message, null, 1, '确定');
            }

            throw new Error(error);
        }
    });
}

function noCryptPost(url) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var reqUrl = urlhost + url;
    return formRequest('POST', reqUrl, data, 'json').then(function (result) {
        if (result && result.success) {
            return result.result;
        } else {
            var error = result ? result.message : url + ' is error, no message';

            throw new Error(error);
        }
    });
}

/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "themeColor", function() { return themeColor; });

var themeColor = '#E8422E';

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cryptPostFlag", function() { return cryptPostFlag; });

var cryptPostFlag = false;

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FlowTypeData", function() { return FlowTypeData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TempletTypeData", function() { return TempletTypeData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PayTypeData", function() { return PayTypeData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TempletPayMap", function() { return TempletPayMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PayTypeArr", function() { return PayTypeArr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "billTypeMap", function() { return billTypeMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "billMap", function() { return billMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "oaIpMap", function() { return oaIpMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bankMap", function() { return bankMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transObjMap", function() { return transObjMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transTypeMap", function() { return transTypeMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transMethodMap", function() { return transMethodMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OptTypeData", function() { return OptTypeData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CheckDevTypeData", function() { return CheckDevTypeData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FailPayTypeData", function() { return FailPayTypeData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DraftOptType", function() { return DraftOptType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UrgeOptType", function() { return UrgeOptType; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__);


var _TempletPayMap, _billTypeMap, _transTypeMap;

var App_Config = {
	APP_ID: 1,
	APP_NAME: ''
};

var ConstantData = {
	DEFAULT_TEMPLETID: 1,
	GET_PUBACC_URL: 'dss/apply/getPubAcc.html',
	LOADING_DEFAULT: "加载中...",
	LOADING_CAL: "计算中...",
	DETAIL_URL: "dss.html?active=3&payType=3" };

var FlowTypeData = {
	MY_APPLYING_FLOWTYPE: 1,

	MY_APPLYED_FLOWTYPE: 4,

	MY_APPROVING_FLOWTYPE: 0,

	MY_APPROVED_FLOWTYPE: 2,

	NOTIFY_ME_FLOWTYPE: 3
};

var TempletTypeData = {
	INNERTRANSFER_TEMPLETTYPE: 9,

	OUTERTRANSFER_TEMPLETTYPE: 10,

	CREDCARD_TEMPLETTYPE: 11,

	DIGITALCHECK_TEMPLETTYPE: 12,

	SALARY_TEMPLETTYPE: 14,

	FINANCIAL_BUY_TEMPLETTYPE: 16,

	FINANCIAL_REDEEM_TEMPLETTYPE: 17,

	BALANCE_MATCH_TEMPLETTYPE: 18,

	BALANCE_NOTMATCH_TEMPLETTYPE: 19,

	WEALTH_BUT_TEMPLETTYPE: 20,

	BATCHTRANSFER_TEMPLETTYPE: 21,

	DSS_CHECK_TEMPLETTYPE: 22,

	DSS_BANKDRAFT_TEMPLETTYPE: 23,

	DSS_BANKERSORDER_TEMPLETTYPE: 24,

	DSS_REMITTANCE_TEMPLETTYPE: 25,

	DSS_OTHER_TEMPLETTYPE: 26,

	DSS_YUDAOCARD_ENCHASHMENT_TEMPLETTYPE: 27,

	DSS_YUDAOCARD_TRANSFER_TEMPLETTYPE: 28
};

var PayTypeData = {
	TRANSFER_TYPE: 1000,

	DSS_TYPE: 1003,

	CREDCARD_TYPE: 1001,

	DIGITALCHECK_TYPE: 1002,

	SALARY_TYPE: 1200,

	WEALTH_BUT_TYPE: 1400,

	WEALTH_REDEEM_TYPE: 1401,

	BALANCE_TYPE: 1300
};

var TempletPayMap = (_TempletPayMap = {}, __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_TempletPayMap, TempletTypeData.INNERTRANSFER_TEMPLETTYPE, PayTypeData.TRANSFER_TYPE), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_TempletPayMap, TempletTypeData.OUTERTRANSFER_TEMPLETTYPE, PayTypeData.TRANSFER_TYPE), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_TempletPayMap, TempletTypeData.CREDCARD_TEMPLETTYPE, PayTypeData.CREDCARD_TYPE), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_TempletPayMap, TempletTypeData.DIGITALCHECK_TEMPLETTYPE, PayTypeData.DIGITALCHECK_TYPE), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_TempletPayMap, TempletTypeData.SALARY_TEMPLETTYPE, PayTypeData.SALARY_TYPE), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_TempletPayMap, TempletTypeData.WEALTH_BUT_TEMPLETTYPE, PayTypeData.WEALTH_BUT_TYPE), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_TempletPayMap, TempletTypeData.FINANCIAL_BUY_TEMPLETTYPE, PayTypeData.WEALTH_BUT_TYPE), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_TempletPayMap, TempletTypeData.FINANCIAL_REDEEM_TEMPLETTYPE, PayTypeData.WEALTH_REDEEM_TYPE), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_TempletPayMap, TempletTypeData.BALANCE_MATCH_TEMPLETTYPE, PayTypeData.BALANCE_TYPE), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_TempletPayMap, TempletTypeData.BALANCE_NOTMATCH_TEMPLETTYPE, PayTypeData.BALANCE_TYPE), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_TempletPayMap, TempletTypeData.BATCHTRANSFER_TEMPLETTYPE, PayTypeData.BATCHTRANSFER_TYPE), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_TempletPayMap, TempletTypeData.DSS_CHECK_TEMPLETTYPE, PayTypeData.DSS_TEMPLET_TYPE), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_TempletPayMap, TempletTypeData.DSS_BANKDRAFT_TEMPLETTYPE, PayTypeData.DSS_TEMPLET_TYPE), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_TempletPayMap, TempletTypeData.DSS_BANKERSORDER_TEMPLETTYPE, PayTypeData.DSS_TEMPLET_TYPE), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_TempletPayMap, TempletTypeData.DSS_REMITTANCE_TEMPLETTYPE, PayTypeData.DSS_TEMPLET_TYPE), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_TempletPayMap, TempletTypeData.DSS_OTHER_TEMPLETTYPE, PayTypeData.DSS_TEMPLET_TYPE), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_TempletPayMap, TempletTypeData.DSS_YUDAOCARD_ENCHASHMENT_TEMPLETTYPE, PayTypeData.DSS_TEMPLET_TYPE), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_TempletPayMap, TempletTypeData.DSS_YUDAOCARD_TRANSFER_TEMPLETTYPE, PayTypeData.DSS_TEMPLET_TYPE), _TempletPayMap);

var PayTypeArr = [{ id: PayTypeData.TRANSFER_TYPE, name: '转账支付' }, { id: PayTypeData.DSS_TYPE, name: '票据支付' }, { id: PayTypeData.CREDCARD_TYPE, name: '结算卡' }, { id: PayTypeData.DIGITALCHECK_TYPE, name: '数字支票' }, { id: PayTypeData.SALARY_TYPE, name: '代发工资' }];

var billTypeMap = (_billTypeMap = {}, __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_billTypeMap, PayTypeData.DIGITALCHECK_TYPE, { id: '', value: 53 }), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_billTypeMap, PayTypeData.CREDCARD_TYPE, { id: '', value: 53 }), _billTypeMap);

var billMap = {
	49: { name: '支票' },
	50: { name: '银行汇票申请书' },
	51: { name: '银行本票申请书' },
	52: { name: '汇兑凭证' },
	53: { name: '其他' },
	54: { name: '禹道卡取现' },
	55: { name: '禹道卡转账' }
};

var oaIpMap = {
	"develop_server_host": {
		ip: "https://tsblackbox.tixin4u.com:18086"
	},
	"heihe_server_host": {
		ip: "https://tsblackbox.tixin4u.com:18091"
	},
	"shahe_server_host": {
		ip: "https://tssandbox.tixin4u.com:18088"
	},
	"release_server_host": {
		ip: "https://oa.tixin4u.com:18080"
	}
};

var bankMap = {
	1: {
		name: "厦门银行",
		icon: "4.png" },
	2: {
		name: "华夏银行",
		icon: "5.png" },
	3: {
		name: "北京银行"
	}
};

var transObjMap = {
	defaultObj: { id: 1, name: '企业' },
	'1': { id: 1, name: '企业' },
	'2': { id: 2, name: '个人' }
};

var transTypeMap = (_transTypeMap = {
	defaultObj: { id: 1, name: '行内' }
}, __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_transTypeMap, TempletTypeData.INNERTRANSFER_TEMPLETTYPE, { id: 1, name: '行内' }), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_transTypeMap, TempletTypeData.OUTERTRANSFER_TEMPLETTYPE, { id: 2, name: '跨行' }), _transTypeMap);

var transMethodMap = {
	defaultMethod: { id: '2', name: '实时' },
	'1': { id: '1', name: '普通' },
	'2': { id: '2', name: '实时' }
};

var OptTypeData = {
	AGREE_TYPE: 1,

	DISAGREE_TYPE: 2,

	TRANSMIT_TYPE: 3,

	BEATBACK_TYPE: 4
};

var CheckDevTypeData = {
	MANAGER_SUCCESS_TYPE: 1,

	MANAGER_FAIL_TYPE: 2,

	OTHER_SUCCESS_TYPE: 3,

	OTHER_FAIL_OTHER_COMPANY: 4,

	OTHER_FAIL_NOT_OWNER: 5
};

var FailPayTypeData = {
	DETAIL_STATUS_REPAY: 9,

	DETAIL_STATUS_FAIL: 8

};

var DraftOptType = {
	DRAFT_SAVE: 1,

	DRAFT_QUIT: 2
};

var UrgeOptType = {
	URGE_FIRST: 1,

	URGE_SECOND: 2
};

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["doPostRequest"] = doPostRequest;
/* harmony export (immutable) */ __webpack_exports__["isSuccess"] = isSuccess;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__SnJsBridge_js__ = __webpack_require__(16);




function doPostRequest(url) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var p = new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (res, rej) {
        var cryptKey = "";
        var zip = 1;
        var keyType = 24;
        encryptData(data).then(function (encryptData) {
            cryptKey = encryptData.key;
            zip = encryptData.zip;
            keyType = encryptData.keyType;
            return sendPost('POST', url, encryptData, 'json');
        }).then(function (response) {
            return decryptData(response, cryptKey, zip, keyType);
        }).then(function (decryptData) {
            res(decryptData);
        }).catch(function (e) {
            console.log("formRequest e = " + __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(e));
            rej(e);
        });
    });
    return p;
}

function encryptData() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var p = new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (res, rej) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__SnJsBridge_js__["EncryptionFunction"])(data).then(function (eData) {
            var d = {
                bdata: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({
                    data: eData.encryptData,
                    zip: eData.zip,
                    key: eData.key,
                    keyType: eData.keyType
                }),
                key: eData.key,
                zip: eData.zip,
                keyType: eData.keyType
            };

            res(d);
        });
    });
    return p;
}

function decryptData(result, key, zip, keyType) {
    var p = new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (res, rej) {
        var response = result;
        if ('string' == typeof result) {
            response = JSON.parse(result);
        }

        var ret = {
            code: response.code,
            ecode: response.ecode,
            emsg: response.emsg,
            desc: response.rdesc,
            data: response.data
        };
        if (isSuccess(response) && !!response.data) {
            var d = {
                zip: zip,
                key: key,
                keyType: keyType,
                data: response.data
            };
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__SnJsBridge_js__["DecryptionFunction"])(d).then(function (result) {
                ret.data = result;
                res(ret);
            });
        } else {
            res(ret);
        }
    });
    return p;
}

function isSuccess(result) {
    if (result && result.code == 0) {
        return true;
    } else {
        return false;
    }
}

function sendPost(method, url, data, responseType) {

    function getClass(object) {
        return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
    }
    return new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (res, rej) {
        var tempData = '',
            sendData = null;
        for (var o in data) {
            if (data.hasOwnProperty(o)) {
                tempData += '&' + o + '=' + data[o];
            }
        }
        tempData = tempData.slice(1);
        var xhr = new window.XMLHttpRequest();
        if (method == 'GET') {
            var and = url.indexOf('?') == -1 ? '?' : '&';
            url += and + tempData;
        } else {
            sendData = tempData;
        }
        xhr.open(method, url);
        xhr.timeout = 30000;
        xhr.ontimeout = function (event) {
            console.log("sendPost - ontimeout..." + event);
            var errInfo = {
                errorCode: "100001",
                errorDesc: "请求超时"
            };
            rej(errInfo);
        };
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;');
        if ('json' != responseType && 'JSON' != responseType) {
            xhr.responseType = responseType || 'text';
        }
        xhr.onreadystatechange = function (e) {
            if (e.currentTarget.readyState === 4) {
                if (e.currentTarget.status == 200) {
                    if ('json' == responseType || 'JSON' == responseType) {
                        var returnRes = e.currentTarget.response;
                        try {
                            if (getClass(returnRes) === 'Object') {
                                res(returnRes);
                            } else if (getClass(returnRes) === 'String') {
                                res(JSON.parse(returnRes));
                            }
                        } catch (e) {
                            res(returnRes);
                        }
                    } else if ('arraybuffer' == responseType) {
                        res(xhr.response);
                    }
                } else {
                    console.log("formRequest - xhr.status is not 200");
                    var errInfo = {
                        errorCode: "100002",
                        errorDesc: "网络异常" + e.currentTarget.status
                    };
                    rej(errInfo);
                }
            }
        };
        xhr.send(sendData);
    });
}

/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["doPost"] = doPost;
/* harmony export (immutable) */ __webpack_exports__["doPostWithoutUser"] = doPostWithoutUser;
/* harmony export (immutable) */ __webpack_exports__["doPostWithoutUserCompleteUrl"] = doPostWithoutUserCompleteUrl;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nativeInfo", function() { return nativeInfo; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__SnJsBridge_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__extend_js__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__HttpProtocol__ = __webpack_require__(58);






var urlhost = '/yqt/';
if (window.CLIENT_HOST) {
    urlhost = window.CLIENT_HOST;
}

var seqIndex = 0;
var tempSep = 0;

function newSeq() {
    var seqGUID = new __WEBPACK_IMPORTED_MODULE_3__extend_js__["GUID"]();
    var seq = Math.round(Number(new Date())) + "" + Math.round(Math.random(seqGUID.newGUID()) * 1000);
    return seq;
}

function doPost(url) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var showBisError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var reqUrl = urlhost + url;
    var p = new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (res, rej) {
        checkNetWrok().then(function () {
            return getUserInfo(data);
        }).then(function (result) {
            data.UAId = result.UAId;
            data.cpyId = result.cpyId;
            try {
                data.lgParam = JSON.parse(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(result.lgParam));
                data.lgParam.seq = newSeq();
            } catch (e) {
                console.log('从app获取session失败');
            }

            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__HttpProtocol__["doPostRequest"])(reqUrl, JSON.parse(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(data)));
        }).then(function (result) {
            result = handleResult(result, showBisError);

            res(compatiableData(result));
        }).catch(function (e) {
            console.log("formRequest e = " + __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(e));
            var desc = e.errorDesc || "请求失败";
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__extend_js__["showToast"])(desc);
            rej(e);
        });
    });
    return p;
}

function doPostWithoutUser(url) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var showBisError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var reqUrl = urlhost + url;
    var p = new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (res, rej) {
        checkNetWrok().then(function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__HttpProtocol__["doPostRequest"])(reqUrl, data);
        }).then(function (result) {
            result = handleResult(result, showBisError);

            res(compatiableData(result));
        }).catch(function (e) {
            console.log("formRequest e = " + __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(e));
            var desc = e.errorDesc || "请求失败";
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__extend_js__["showToast"])(desc);
            rej(e);
        });
    });
    return p;
}

function doPostWithoutUserCompleteUrl(url) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var showBisError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var reqUrl = url;
    var p = new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (res, rej) {
        checkNetWrok().then(function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__HttpProtocol__["doPostRequest"])(reqUrl, data);
        }).then(function (result) {
            result = handleResult(result, showBisError);

            res(compatiableData(result));
        }).catch(function (e) {
            console.log("formRequest e = " + __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(e));
            var desc = e.errorDesc || "请求失败";
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__extend_js__["showToast"])(desc);
            rej(e);
        });
    });
    return p;
}

function handleResult(result) {
    var showBisError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__HttpProtocol__["isSuccess"])(result)) {
        var localDesc = '';

        if (!!result.emsg) {
            localDesc = result.emsg;
        } else {
            result.desc = transferErrorDesc(result);
            localDesc = result.desc;
        }

        if (!!result.ecode) {
            localDesc += "[" + result.ecode + "]";
        }
        if (showBisError) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__extend_js__["showToast"])(localDesc);
        }

        result.edesc = localDesc;
    }
    return result;
}

var nativeInfo = {};
function getUserInfo() {
    var p = new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (res, rej) {
        if (nativeInfo.UAId) {
            res(nativeInfo);
        } else {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__SnJsBridge_js__["GetUserInfoFunction"])({
                isNeedSeesion: true
            }).then(function (uaData) {
                if (uaData) {
                    nativeInfo.UAId = uaData.UAId;
                    nativeInfo.cpyId = uaData.cpyId;
                    nativeInfo.UAName = uaData.uName;
                    nativeInfo.orgId = uaData.orgId;
                    nativeInfo.orgName = uaData.orgName;
                    nativeInfo.uPhone = uaData.uPhone;

                    var lgParam = {};
                    try {
                        lgParam = JSON.parse(uaData.lgParam);
                    } catch (e) {
                        lgParam = { session: uaData.lgParam };
                    }
                    nativeInfo.lgParam = lgParam;


                    if (!!uaData.deviceId) {
                        nativeInfo.deviceId = uaData.deviceId;
                    }
                    if (!!uaData.token) {
                        nativeInfo.token = JSON.parse(uaData.token);
                    }
                    res(nativeInfo);
                } else {
                    var errInfo = {
                        errorCode: "100003",
                        errorDesc: "用户信息获取失败"
                    };
                    console.log("GetUserInfo - getuser info from native failed...");
                    rej(errInfo);
                }
            });
        }
    });
    return p;
}

function checkNetWrok() {
    var p = new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (res, rej) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__SnJsBridge_js__["CheckNetWorkFunction"])().then(function (statusData) {
            if (statusData.contectState) {
                res(statusData);
            } else {
                var errInfo = {
                    errorCode: "100004",
                    errorDesc: "网络连接不可用"
                };
                rej(errInfo);
            }
        });
    });
    return p;
}

function compatiableData(result) {
    if (!!result.data) {
        result.data["code"] = result.code;
        return result.data;
    }
    return result;
}

function transferErrorDesc(result) {
    if (result && result.code) {
        var desc = ERROR_MAP[result.code];
        if (result.code === 600003 || result.code === 36006) {
            var list = result.desc.split("[600003]");
            desc = replaceOuterBrackets(list[list.length - 1].trim());
        } else if (isEmptyStr(desc)) {
            desc = "抱歉，网络不给力，请您稍后重试!";
        }
        result.desc = desc;
    }
    return result.desc;
}

function replaceOuterBrackets(str) {
    if (str.indexOf('[') > -1) {
        var tmpstr = str.replace('[', '+^');
        tmpstr = tmpstr.replace(/(.*)]/, '$1+^');
        return tmpstr.split('+^')[1];
    }
    return str;
}

function isEmptyStr(obj) {
    if (obj == null || obj == "" || typeof obj == "undefined") {
        return true;
    } else {
        return false;
    }
}

var ERROR_MAP = {
    '-1': "网络不给力，请您稍后重试!",
    '-5': "网络不给力，请您稍后重试!",
    107: "验证码错误",
    507: "请求参数错误",
    508: "请求参数错误",
    122: "登录超时，请重新登录!",
    3061: "银行卡与银行不匹配",
    3602: "联网核查未获取到用户图像",
    3603: "上传用户图像失败",
    3604: "校验Ⅱ类户开通权限失败",
    3605: "交易密码加密失败",
    100001: "该用户暂不支持电子缴费",
    100002: "验证码已过期",
    34000004: "账户密码校验失败",
    34000005: "用户未认证，请认证后再执行开户操作",
    34000006: "验证码校验失败",
    34000007: "用户认证中，请稍后再试",
    12000001: "未找到用户认证信息",
    72000002: "人脸对比不通过",
    72000003: "获取三方查询系统工作时间异常",
    72000004: "当前操作不在工作时间段，请稍后重试",
    680002: "电表类型不匹配",
    35012: "账户认证未通过",
    12000002: "证件信息已过期",
    340020: "该银行卡已被添加，请勿重复添加"
};

/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "imgBase64Map", function() { return imgBase64Map; });

var imgBase64Map = {
	pc: {
		path_1_0: 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAYFBMVEUAAABHiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu5Hiu68zIufAAAAIHRSTlMAZF9PaIdFnG82dFOQfXlYST88LSkSiSENgyYXB9jBrHW0duwAAAC8SURBVBjTZc4JDoMgFEXRz2cGAcHi0Np2/7ssg0aT3kTzPIFEuFqJCejHOl9axBjHBTLHvXxyVlBJZIw5Dd4CuPJs5Syj/fJkymsIfRAKC7UT0FBR6h1YwyQlgq03hJzzgS3Bzp9QF+5u6SN0nJwyCtKwVtNDbqhn73yGkVsdybZAw7OXRUwAHe+tzwOTnHlLEpj8gU+GPSXKrmgC3Hs0pF8zcn3HmvhkgXfsOqD4Q0hveqE6V5yR9HCrJ39oVggQ19BGpgAAAABJRU5ErkJggg=='
	},
	app: {
		path_1_0: 'iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAk1BMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ROyVeAAAAMXRSTlMAmrSdsaOIDhnMHggTPQS5q2S9pyLdeq5CgWkRxWFXlcG/bzqLXFSPNSctUEpF1tLwYeMVTAAAApNJREFUSMfN1tfCmjAYgOGQMGRIgPCDDJEpy9H7v7pWVlxJxZP2PQI+HvYB4IN0NwkEIhLB610drEpvaiwShASECMRys4a7QSzKx04BwIy6KoBpoH1sd2IsF/frwRUWH9qTIybm412EWXymq8X2pd1mHG0dqwFjUaOAeWPcLBirP8/9yofJhojLJeZZbs5ni8UNmBKtyn4qHw8dpBWYMlEsLc/ZvnjzIjyA9zXwsOyvHzJhWVHktJuxwMByVoC3GGxxYPKxRgSdgXUZa3ycwAQwMKjwiY+91GXijnh8XMOIiQ10eMSGHXi3gkQfdhck5R471m1mG9ObI484SR18K/WL4ViCcIfNQ3ybOen0HATxEReISLescrhXRUB3GITDkKBiwtYjBoY7pkzn8qOHNzfMjOkuEOI/MDneAFauJPNxiHdMfPZtPi58j4k9p+NjXSCs69aIpPMxqJyQMcnVHvwFK8jq3g5aSCKKGZ1TFIHXNgd1B55xe97NncdT5nGgv1ijvOTgGe+IaM35cDi2EsRl+2S18hLoLziJU2fpchy2RZ6KTuYdNY9I9RZLsdLb+7nwON2sXmFc9/NHHvWygxNq7x+YSaPjVsa+X4fVscpLS4SBS0cUMzPbHPnWEApbEzAw22vbU38qNCoZmNu/xG37PVYkSX+Po0hhFc3fNRGMd9j1aplZ6Wkjlt5j+0fl9NNzcVdLiF3dcjGIXI1dBPiY3/+Hze8xgWGz/Is1+jp89DH0fThGNp9hqmEmhfvwT7ZkfYqpxrE9Lsn+x5hqRx1/DssVmOr0mn+NQRJfwy8w1flqTHWqhiBYjane19aXGFROJpK1mGrsEONbbO4hTPjYGDBLiwI3lNUGYGoi8sMy/dP4Db+rPbunBi32AAAAAElFTkSuQmCC'
	}
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(67), __esModule: true };

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(69), __esModule: true };

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(70), __esModule: true };

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(61);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(63);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(62);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(2);
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(98);
var $Object = __webpack_require__(2).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(51);
__webpack_require__(52);
__webpack_require__(53);
__webpack_require__(99);
__webpack_require__(101);
__webpack_require__(102);
module.exports = __webpack_require__(2).Promise;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(100);
__webpack_require__(51);
__webpack_require__(103);
__webpack_require__(104);
module.exports = __webpack_require__(2).Symbol;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(52);
__webpack_require__(53);
module.exports = __webpack_require__(35).f('iterator');


/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(10);
var toLength = __webpack_require__(50);
var toAbsoluteIndex = __webpack_require__(93);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(28);
var gOPS = __webpack_require__(43);
var pIE = __webpack_require__(29);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(18);
var call = __webpack_require__(80);
var isArrayIter = __webpack_require__(78);
var anObject = __webpack_require__(3);
var toLength = __webpack_require__(50);
var getIterFn = __webpack_require__(96);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 76 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(13);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(14);
var ITERATOR = __webpack_require__(1)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(13);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(3);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(41);
var descriptor = __webpack_require__(20);
var setToStringTag = __webpack_require__(21);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(7)(IteratorPrototype, __webpack_require__(1)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(1)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 83 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(22)('meta');
var isObject = __webpack_require__(8);
var has = __webpack_require__(6);
var setDesc = __webpack_require__(5).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(19)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var macrotask = __webpack_require__(49).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(13)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(5);
var anObject = __webpack_require__(3);
var getKeys = __webpack_require__(28);

module.exports = __webpack_require__(4) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(29);
var createDesc = __webpack_require__(20);
var toIObject = __webpack_require__(10);
var toPrimitive = __webpack_require__(33);
var has = __webpack_require__(6);
var IE8_DOM_DEFINE = __webpack_require__(39);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(4) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(10);
var gOPN = __webpack_require__(42).f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(6);
var toObject = __webpack_require__(94);
var IE_PROTO = __webpack_require__(30)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(7);
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(0);
var core = __webpack_require__(2);
var dP = __webpack_require__(5);
var DESCRIPTORS = __webpack_require__(4);
var SPECIES = __webpack_require__(1)('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(32);
var defined = __webpack_require__(24);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(32);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(24);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(37);
var ITERATOR = __webpack_require__(1)('iterator');
var Iterators = __webpack_require__(14);
module.exports = __webpack_require__(2).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(71);
var step = __webpack_require__(83);
var Iterators = __webpack_require__(14);
var toIObject = __webpack_require__(10);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(40)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(9);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(4), 'Object', { defineProperty: __webpack_require__(5).f });


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(15);
var global = __webpack_require__(0);
var ctx = __webpack_require__(18);
var classof = __webpack_require__(37);
var $export = __webpack_require__(9);
var isObject = __webpack_require__(8);
var aFunction = __webpack_require__(17);
var anInstance = __webpack_require__(72);
var forOf = __webpack_require__(75);
var speciesConstructor = __webpack_require__(48);
var task = __webpack_require__(49).set;
var microtask = __webpack_require__(85)();
var newPromiseCapabilityModule = __webpack_require__(27);
var perform = __webpack_require__(45);
var userAgent = __webpack_require__(95);
var promiseResolve = __webpack_require__(46);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(1)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(90)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(21)($Promise, PROMISE);
__webpack_require__(91)(PROMISE);
Wrapper = __webpack_require__(2)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(82)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(0);
var has = __webpack_require__(6);
var DESCRIPTORS = __webpack_require__(4);
var $export = __webpack_require__(9);
var redefine = __webpack_require__(47);
var META = __webpack_require__(84).KEY;
var $fails = __webpack_require__(19);
var shared = __webpack_require__(31);
var setToStringTag = __webpack_require__(21);
var uid = __webpack_require__(22);
var wks = __webpack_require__(1);
var wksExt = __webpack_require__(35);
var wksDefine = __webpack_require__(34);
var enumKeys = __webpack_require__(74);
var isArray = __webpack_require__(79);
var anObject = __webpack_require__(3);
var isObject = __webpack_require__(8);
var toIObject = __webpack_require__(10);
var toPrimitive = __webpack_require__(33);
var createDesc = __webpack_require__(20);
var _create = __webpack_require__(41);
var gOPNExt = __webpack_require__(88);
var $GOPD = __webpack_require__(87);
var $DP = __webpack_require__(5);
var $keys = __webpack_require__(28);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(42).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(29).f = $propertyIsEnumerable;
  __webpack_require__(43).f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(15)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(7)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(9);
var core = __webpack_require__(2);
var global = __webpack_require__(0);
var speciesConstructor = __webpack_require__(48);
var promiseResolve = __webpack_require__(46);

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(9);
var newPromiseCapability = __webpack_require__(27);
var perform = __webpack_require__(45);

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(34)('asyncIterator');


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(34)('observable');


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__;

/***/ }),
/* 106 */
/***/ (function(module, exports) {

module.exports = Vue;

/***/ })
/******/ ]);