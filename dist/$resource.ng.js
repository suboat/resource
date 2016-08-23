
      /*
      2016-08-23T01:45:19.151Z
      */
      
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["resource"] = factory();
	else
		root["resource"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(48);


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	/**
	 * Created by axetroy on 16-4-27.
	 */

	var GLOBAL = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : undefined;

	module.exports = GLOBAL;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _global = __webpack_require__(2);

	var _global2 = _interopRequireDefault(_global);

	var _$utils = __webpack_require__(7);

	var _$cache = __webpack_require__(44);

	var _$cache2 = _interopRequireDefault(_$cache);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var injection = {};

	// 默认的配置
	/**
	 * Created by axetroy on 16-4-20.
	 */

	var config = {
	  headers: {
	    Accept: 'application/json, text/plain, text/html, */*'
	  }
	};

	var returnValueHandler = function returnValueHandler(value, defaultReturnVal) {
	  var deferred = $http.invoke('$q').defer();
	  var val = value;


	  if ((0, _$utils.isFunction)(value)) val = value();

	  // false || undefined || null || NaN
	  if (!val) {
	    deferred.reject(defaultReturnVal);
	  }
	  // true
	  else if ((0, _$utils.isBoolean)(val)) {
	      deferred.resolve(defaultReturnVal);
	    }
	    // promise
	    else if ((0, _$utils.isObject)(val) && (0, _$utils.isFunction)(val.then)) {
	        return val;
	      } else {
	        deferred.reject(value);
	      }
	  return deferred.promise;
	};

	/**
	 * 发送http请求
	 * @param url
	 * @param method
	 * @param headers
	 * @param withCredentials
	 * @param data
	 * @param interceptor
	 * @param timeout
	 * @param eventHandlers
	 * @param cache
	 * @param responseType
	 * @returns {*}   promise
	 */
	var $http = function $http(_ref) {
	  var _ref$url = _ref.url;
	  var url = _ref$url === undefined ? '' : _ref$url;
	  var _ref$method = _ref.method;
	  var method = _ref$method === undefined ? '' : _ref$method;
	  var _ref$headers = _ref.headers;
	  var headers = _ref$headers === undefined ? {} : _ref$headers;
	  var _ref$withCredentials = _ref.withCredentials;
	  var withCredentials = _ref$withCredentials === undefined ? false : _ref$withCredentials;
	  var _ref$data = _ref.data;
	  var data = _ref$data === undefined ? null : _ref$data;
	  var _ref$interceptor = _ref.interceptor;
	  var interceptor = _ref$interceptor === undefined ? _$utils.noop : _ref$interceptor;
	  var _ref$timeout = _ref.timeout;
	  var timeout = _ref$timeout === undefined ? null : _ref$timeout;
	  var _ref$eventHandlers = _ref.eventHandlers;
	  var eventHandlers = _ref$eventHandlers === undefined ? {} : _ref$eventHandlers;
	  var _ref$cache = _ref.cache;
	  var cache = _ref$cache === undefined ? false : _ref$cache;
	  var _ref$responseType = _ref.responseType;
	  var responseType = _ref$responseType === undefined ? '' : _ref$responseType;


	  if (!url || !method) return $http.invoke('$q').reject();

	  var deferred = $http.invoke('$q').defer();

	  var _cache = _$cache2.default.get(url + '-' + method);
	  if (_cache) {
	    var _XHRWrapper = _cache;
	    if (_cache) {
	      _XHRWrapper.resource.$promise = deferred.promise;
	      _XHRWrapper.resource.$resolve ? deferred.resolve(_XHRWrapper) : deferred.reject(_XHRWrapper);
	      return _XHRWrapper.resource;
	    }
	  }

	  var XHR = _global2.default.XMLHttpRequest ? new XMLHttpRequest() : _global2.default.XDomainRequest ? new XDomainRequest() : _global2.default.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : null;

	  if (!XHR) {
	    console.error('your browser is not support XMLHttpRequest');
	    deferred.reject();
	    return { $promise: deferred.promise, $resolve: false };
	  }

	  // CROS
	  try {
	    // avoid some error in shit IE
	    XHR.withCredentials = !!withCredentials;
	  } catch (e) {}

	  // timeout
	  if (!!timeout) XHR.timeout = timeout;

	  XHR.$$method = method;
	  XHR.$$url = url;
	  XHR.$$data = data;
	  XHR.$$cache = cache;

	  XHR.warpper = {
	    resource: {
	      $promise: deferred.promise,
	      $resolve: false
	    }
	  };

	  XHR.onreadystatechange = function () {
	    if (XHR.readyState !== 4) return;

	    XHR.warpper = XHRWrapper(XHR);

	    if (/^(2|3)/.test(XHR.status)) {
	      // 经过拦截器筛选
	      var inter = interceptor(XHR.warpper, $http.invoke('$q'));
	      returnValueHandler(inter, XHR.warpper).then(function (response) {
	        XHR.warpper.resource.$resolve = true;
	        cache && _$cache2.default.set(url + '-' + method, XHR.warpper, cache);
	        deferred.resolve(response || XHR.warpper);
	      }, function (response) {
	        XHR.warpper.resource.$resolve = false;
	        cache && _$cache2.default.set(url + '-' + method, XHR.warpper, cache);
	        deferred.reject(response || XHR.warpper);
	      });
	    } else {
	      XHR.warpper.resource.$resolve = false;
	      deferred.reject(XHR.warpper);
	    }
	  };

	  // XHR 事件
	  var errorFunc = function errorFunc(event, XHRWrapper) {
	    return deferred.reject(XHRWrapper);
	  };
	  var ErrorHandler = (0, _$utils.merge)({
	    ontimeout: errorFunc,
	    onerror: errorFunc,
	    onabort: errorFunc
	  }, eventHandlers);

	  (0, _$utils.forEach)(ErrorHandler, function () {
	    var handler = arguments.length <= 0 || arguments[0] === undefined ? _$utils.noop : arguments[0];
	    var eventName = arguments[1];

	    XHR[eventName] = function (event) {
	      XHR.warpper = XHRWrapper(XHR);
	      (0, _$utils.isFunction)(handler) && handler(event, XHR.warpper);

	      if (/(ontimeout|onerror|onabort)/i.test(eventName)) {
	        XHR.warpper.resource.$resolve = false;
	        cache && _$cache2.default.set(url + '-' + method, XHR.warpper, cache);
	        deferred.reject(XHR.warpper);
	      }
	    };
	  });

	  XHR.open(method, url, true);

	  // 设置头部信息，必须在open服务器之后
	  XHR.$$requestHeader = (0, _$utils.merge)(config.headers, headers);
	  (0, _$utils.forEach)(XHR.$$requestHeader, function (value, key) {
	    return XHR.setRequestHeader(key, value);
	  });

	  /*
	   响应头，默认使用json
	   text
	   arraybuffer
	   blob
	   document
	   json
	   */
	  XHR.responseType = responseType;

	  XHR.send(data ? JSON.stringify(data) : null);

	  return XHR.warpper.resource;
	};

	/**
	 * 对XHR对象进行包装
	 * @param XHR
	 * @constructor
	 */
	var XHRWrapper = function XHRWrapper(XHR) {
	  // config
	  var config = {
	    headers: XHR.$$requestHeader,
	    method: XHR.$$method.toUpperCase(),
	    withCredentials: XHR.withCredentials,
	    url: XHR.$$url,
	    data: XHR.$$data,
	    cache: XHR.$$cache,
	    responseType: XHR.responseType
	  };

	  // response header
	  var headers = function () {
	    var _headers = {};
	    var respHeaders = XHR.getAllResponseHeaders();
	    // response header按换行符分割
	    respHeaders.split(/\n/g).forEach(function (str) {
	      var match = str.split(':'),
	          key = void 0,
	          value = void 0;
	      if (!match || !match.length || !match[0]) return;
	      key = match[0];
	      value = match.length <= 1 ? '' : match.slice(1).join(':');
	      _headers[key.trim().toLowerCase()] = value.trim();
	    });
	    return _headers;
	  }();

	  // response data
	  var data = /\/json/i.test(headers['content-type']) ? (0, _$utils.fromJson)(XHR.response) : XHR.response;

	  // the resource
	  var resource = (0, _$utils.extend)(XHR.warpper.resource, data || {});

	  return { $$XHR: XHR, config: config, data: data, headers: headers, resource: resource, status: XHR.status, statusText: XHR.statusText };
	};

	['GET', 'POST', 'PUT', 'DELETE', 'FETCH', 'HEAD', 'PATCH', 'OPTIONS', 'TRACE', 'CONNECT', 'MOVE', 'COPY', 'LINK', 'UNLINK', 'WRAPPED', 'Extension-mothed'].forEach(function (method) {
	  /**
	   * http 各种方法
	   * @param url         真实的url地址
	   * @param params      参数
	   * @param config      配置项
	   * @returns {*}       promise
	   */
	  $http[method.toLocaleLowerCase()] = function () {
	    var url = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	    var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	    var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    // 除GET方法外，其余带DATA
	    var data = /^\s*GET/i.test(method) ? null : params;
	    config = (0, _$utils.merge)({ url: url, method: method, data: data }, config);
	    return $http(config);
	  };
	});

	$http.injector = function (key, object) {
	  injection[key] = object;
	};

	$http.invoke = function (key) {
	  return injection[key];
	};

	module.exports = $http;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * Created by axetroy on 16-4-17.
	 */

	// object.assign for merge and copy
	__webpack_require__(8);

	var TYPED_ARRAY_REGEXP = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array\]$/;

	var noop = void 0;
	var toString = Object.prototype.toString;
	var createMap = void 0;
	var _equals = void 0;
	var merge = void 0;
	var extend = void 0;
	var copy = void 0;
	var forEach = void 0;
	var toJson = void 0;
	var fromJson = void 0;

	var isDefined = void 0;
	var isUndefined = void 0;
	var isArray = void 0;
	var isDate = void 0;
	var isBoolean = void 0;
	var isElement = void 0;
	var isNumber = void 0;
	var isObject = void 0;
	var isString = void 0;
	var isFunction = void 0;
	var isRegExp = void 0;
	var isWindow = void 0;
	var isFile = void 0;
	var isBlob = void 0;
	var isTypedArray = void 0;
	var isArrayBuffer = void 0;

	noop = function noop() {};

	createMap = function createMap() {
	  return Object.create(null);
	};

	isDefined = function isDefined($$defined) {
	  return !isUndefined($$defined);
	};
	isUndefined = function isUndefined(value, undefined) {
	  return typeof value === 'undefined' || value === undefined;
	};
	isArray = Array.isArray;
	isDate = function isDate(date) {
	  return toString.call(date) === '[object Date]';
	};
	isBoolean = function isBoolean(value) {
	  return typeof value === 'boolean' || value instanceof Boolean;
	};
	isElement = function isElement(node) {
	  return !!(node && (node.nodeName || node.prop && node.attr));
	};
	isNumber = function isNumber(value) {
	  return isNaN(value) ? false : typeof value === 'number' || value instanceof Number;
	};
	isObject = function isObject(value) {
	  return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
	};
	isString = function isString(value) {
	  return typeof value === 'string' || value instanceof String;
	};
	isFunction = function isFunction(value) {
	  return typeof value === 'function';
	};
	isRegExp = function isRegExp(value) {
	  return toString.call(value) === '[object RegExp]';
	};
	isWindow = function isWindow(obj) {
	  return obj && obj.window === obj;
	};
	isFile = function isFile(obj) {
	  return toString.call(obj) === '[object File]';
	};
	isBlob = function isBlob(obj) {
	  return toString.call(obj) === '[object Blob]';
	};
	isTypedArray = function isTypedArray(value) {
	  return value && isNumber(value.length) && TYPED_ARRAY_REGEXP.test(toString.call(value));
	};
	isArrayBuffer = function isArrayBuffer(obj) {
	  return toString.call(obj) === '[object ArrayBuffer]';
	};

	_equals = function equals(o1, o2) {
	  if (o1 === o2) return true;
	  if (o1 === null || o2 === null) return false;
	  if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
	  var t1 = typeof o1 === 'undefined' ? 'undefined' : _typeof(o1),
	      t2 = typeof o2 === 'undefined' ? 'undefined' : _typeof(o2);
	  if (t1 === t2 && t1 === 'object') {
	    // array
	    if (isArray(o1)) {
	      if (!isArray(o2)) return false;
	      var length = o1.length;
	      if (length === o2.length) {
	        for (var key = 0; key < length; key++) {
	          if (!_equals(o1[key], o2[key])) return false;
	        }
	        return true;
	      }
	    }
	    //date
	    else if (isDate(o1)) {
	        if (!isDate(o2)) return false;
	        return _equals(o1.getTime(), o2.getTime());
	      }
	      // RegExp
	      else if (isRegExp(o1)) {
	          if (!isRegExp(o2)) return false;
	          return o1.toString() === o2.toString();
	        } else {
	          if (isWindow(o1) || isWindow(o2)) return false;

	          for (var attr in o2) {
	            if (o2.hasOwnProperty(attr)) {
	              if (!attr in o1 || o2[attr] !== o1[attr]) return false;
	            }
	          }

	          return true;
	        }
	  } else if (t1 === 'function') {
	    if (t2 !== 'function') return false;
	    return o1.toString() === o2.toString();
	  } else {
	    return o1 === o2;
	  }
	  return false;
	};

	merge = function merge() {
	  for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
	    sources[_key] = arguments[_key];
	  }

	  return Object.assign.apply(Object, [{}].concat(sources));
	};

	extend = function extend(target) {
	  for (var _len2 = arguments.length, source = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	    source[_key2 - 1] = arguments[_key2];
	  }

	  return Object.assign.apply(Object, [target].concat(source));
	};

	copy = function copy(obj) {
	  return merge(obj);
	};

	forEach = function forEach(obj, func) {
	  if (isArray(obj)) {
	    return obj.forEach(func);
	  } else if (isObject(obj) && Object.keys(obj).length) {
	    for (var attr in obj) {
	      if (obj.hasOwnProperty(attr)) {
	        func(obj[attr], attr);
	      }
	    }
	  } else {}
	};

	fromJson = function fromJson(jsonString) {
	  var json = null;
	  if (!isString(jsonString) && isObject(jsonString)) return jsonString;
	  try {
	    json = JSON.parse(jsonString);
	  } catch (e) {}
	  return json;
	};

	toJson = function toJson(object) {
	  var str = null;
	  try {
	    str = JSON.stringify(object);
	  } catch (e) {}
	  return str;
	};

	module.exports = {
	  noop: noop,
	  isDefined: isDefined,
	  isUndefined: isUndefined,
	  isArray: isArray,
	  isDate: isDate,
	  isBoolean: isBoolean,
	  isElement: isElement,
	  isNumber: isNumber,
	  isObject: isObject,
	  isString: isString,
	  isFunction: isFunction,
	  isRegExp: isRegExp,
	  isWindow: isWindow,
	  isFile: isFile,
	  isBlob: isBlob,
	  isTypedArray: isTypedArray,
	  isArrayBuffer: isArrayBuffer,
	  equals: _equals,
	  merge: merge,
	  extend: extend,
	  copy: copy,
	  forEach: forEach,
	  fromJson: fromJson,
	  toJson: toJson
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(9);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(27)});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(10)
	  , core      = __webpack_require__(11)
	  , hide      = __webpack_require__(12)
	  , redefine  = __webpack_require__(22)
	  , ctx       = __webpack_require__(25)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
	    , key, own, out, exp;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // extend global
	    if(target)redefine(target, key, out, type & $export.U);
	    // export
	    if(exports[key] != out)hide(exports, key, exp);
	    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
	  }
	};
	global.core = core;
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

/***/ },
/* 10 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 11 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(13)
	  , createDesc = __webpack_require__(21);
	module.exports = __webpack_require__(17) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(14)
	  , IE8_DOM_DEFINE = __webpack_require__(16)
	  , toPrimitive    = __webpack_require__(20)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(17) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(15);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(17) && !__webpack_require__(18)(function(){
	  return Object.defineProperty(__webpack_require__(19)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(18)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(15)
	  , document = __webpack_require__(10).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(15);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(10)
	  , hide      = __webpack_require__(12)
	  , has       = __webpack_require__(23)
	  , SRC       = __webpack_require__(24)('src')
	  , TO_STRING = 'toString'
	  , $toString = Function[TO_STRING]
	  , TPL       = ('' + $toString).split(TO_STRING);

	__webpack_require__(11).inspectSource = function(it){
	  return $toString.call(it);
	};

	(module.exports = function(O, key, val, safe){
	  var isFunction = typeof val == 'function';
	  if(isFunction)has(val, 'name') || hide(val, 'name', key);
	  if(O[key] === val)return;
	  if(isFunction)has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
	  if(O === global){
	    O[key] = val;
	  } else {
	    if(!safe){
	      delete O[key];
	      hide(O, key, val);
	    } else {
	      if(O[key])O[key] = val;
	      else hide(O, key, val);
	    }
	  }
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, TO_STRING, function toString(){
	  return typeof this == 'function' && this[SRC] || $toString.call(this);
	});

/***/ },
/* 23 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(26);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(28)
	  , gOPS     = __webpack_require__(41)
	  , pIE      = __webpack_require__(42)
	  , toObject = __webpack_require__(43)
	  , IObject  = __webpack_require__(31)
	  , $assign  = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(18)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(29)
	  , enumBugKeys = __webpack_require__(40);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(23)
	  , toIObject    = __webpack_require__(30)
	  , arrayIndexOf = __webpack_require__(34)(false)
	  , IE_PROTO     = __webpack_require__(38)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(31)
	  , defined = __webpack_require__(33);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(32);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(30)
	  , toLength  = __webpack_require__(35)
	  , toIndex   = __webpack_require__(37);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(36)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 36 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(36)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(39)('keys')
	  , uid    = __webpack_require__(24);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(10)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 40 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 41 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 42 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(33);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Created by axetroy on 16-4-27.
	 */

	var $$cache = {};

	var $cache = {};

	$cache.get = function (key) {

	  if (!key || !$$cache[key]) return null;

	  var _cache = $$cache[key];

	  // 不存在
	  if (!_cache) return null;

	  // times设置为boolean
	  if (typeof _cache.times === 'boolean') {
	    return !!_cache.times ? _cache.value : null;
	  }

	  // 过期
	  if (_cache.used >= _cache.times) {
	    delete $$cache[key];
	    return null;
	  }

	  _cache.used++;

	  return _cache.value;
	};

	$cache.set = function (key, value, times) {
	  return $$cache[key] = {
	    key: key,
	    times: times,
	    value: value,
	    used: 0
	  };
	};

	$cache.remove = function (key) {
	  delete $$cache[key];
	};

	module.exports = $cache;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var $utils = __webpack_require__(7);
	var $common = __webpack_require__(46);
	var CONFIG = __webpack_require__(47);

	var injection = {};

	/**
	 * $resource请求
	 */

	var $resource = function () {
	  function $resource() {
	    var url = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	    var registerParams = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	    var actions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

	    _classCallCheck(this, $resource);

	    // default actions
	    actions = $utils.merge($common.defaultActions, actions);
	    // default options
	    options = $utils.merge($common.defaultOptions, { cache: CONFIG.cache }, options);

	    $utils.forEach(actions, function (action) {
	      action.url = url;

	      var query = [];
	      $utils.forEach(registerParams, function (value, key) {
	        var INLINE_REG = new RegExp(':' + key, 'g');
	        value = value.indexOf('@') === 0 ? value.replace('@', '') : value;
	        if (INLINE_REG.test(action.url)) {
	          action.url = action.url.replace(INLINE_REG, value);
	        } else {
	          query.push(key + '=' + value);
	        }
	      });

	      if (query.length) {
	        query = query.join('&');
	        action.url += (/\?/.test(action.url) ? '&' : '?') + query;
	      }
	    });

	    var transformHeaders = $utils.isArray(options.transformHeaders) ? options.transformHeaders : [];

	    var Http = function Http() {
	      _classCallCheck(this, Http);

	      this.url = url;
	      this.parmas = registerParams;
	      this.actions = actions;
	      this.options = options;
	      this.transformHeaders = transformHeaders;
	    };

	    $utils.forEach(actions, function (object, action) {

	      // 设置header和拦截器和跨域请求
	      var _object$headers = object.headers;
	      var headers = _object$headers === undefined ? CONFIG.headers : _object$headers;
	      var _object$interceptor = object.interceptor;
	      var interceptor = _object$interceptor === undefined ? CONFIG.interceptor : _object$interceptor;
	      var _object$responseType = object.responseType;
	      var responseType = _object$responseType === undefined ? CONFIG.responseType : _object$responseType;
	      var _object$withCredentia = object.withCredentials;
	      var withCredentials = _object$withCredentia === undefined ? CONFIG.withCredentials : _object$withCredentia;

	      /**
	       * 实例化之后，真正调用的函数
	       * @param realParams      解析url的参数，如果为post，put等，则会放进requestBody
	       * @param config      私有设置，设置请求头等，只针对当前方法生效
	       * @returns {*}       $resource
	       */

	      Http.prototype[action] = function () {
	        var realParams = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	        var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	        var body = $resource.parseParams(CONFIG.hosts + object.url, realParams);
	        var _config = $utils.merge({
	          headers: headers,
	          withCredentials: withCredentials,
	          interceptor: interceptor,
	          responseType: responseType
	        }, options, config,
	        // 合并所有headers
	        {
	          headers: $utils.merge(headers, options.headers, config.headers)
	        });
	        // 转换请求头
	        _config.headers = $common.transform(CONFIG.transformHeaders.concat(transformHeaders, config.transformHeaders || []), _config.headers);
	        /**
	         * 发送http请求
	         * arguments:
	         *  1: 真正的url地址
	         *  2: 参数，如果为post，put等，则为requestBody
	         *  3: 配置项
	         *  4: 临时配置项，比如只配置此次调用
	         */
	        var $http = $resource.invoke('$http');
	        return $http[object.method.toLowerCase()](body, realParams, _config);
	      };
	    });

	    return new Http();
	  }

	  _createClass($resource, null, [{
	    key: 'parseParams',


	    /**
	     * 将url和参数解析，得到真正的url地址
	     * @param url
	     * @param params
	     * @returns {*}
	     */
	    value: function parseParams(url) {
	      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	      if (!$utils.isObject(params)) return url;

	      var urlParts = url.split('?');
	      var _urlParts$ = urlParts[0];
	      var body = _urlParts$ === undefined ? '' : _urlParts$;
	      var _urlParts$2 = urlParts[1];
	      var query = _urlParts$2 === undefined ? '' : _urlParts$2;


	      if ($utils.isArray(params)) {} else if ($utils.isObject(params)) {
	        // 处理body
	        $utils.forEach(params, function (value, key) {
	          value = $utils.isFunction(value) ? value() : value;
	          body = body.replace(new RegExp(':' + key, 'g'), value);
	        });
	      }

	      // 把body中，未匹配的通配符去掉
	      body = body.replace(/\:[a-z_\$][\w\$]*/ig, '');

	      // 处理query
	      if (query) {
	        (function () {
	          var queryArr = [];

	          /**
	           * 替换查询字符串的通配符
	           * 以 & 切割查询字符串
	           * [':user','pwd=:pwd']
	           */
	          query.split('&').forEach(function (group) {
	            if (group === '') return;
	            var _match = group.split('=');
	            var key = _match[0] || '';
	            var value = _match[1] || '';
	            if (!value) {
	              if (/^\:/.test(key)) {
	                key = key.replace(/^\:/, '');
	                var _value = params[key];
	                value = _value === undefined || _value === null ? '' : _value;
	              }
	            } else {
	              key = /^\:/.test(key) ? key.replace(/^\:/, '') : key;
	              if (/^\:/.test(value)) {
	                var _value2 = value.replace(/^\:/, '');
	                var paramsVal = params[_value2];
	                paramsVal = $utils.isFunction(paramsVal) ? paramsVal() : paramsVal;
	                value = paramsVal === undefined || paramsVal === null || $utils.isNumber(paramsVal) && isNaN(paramsVal) ? '' : paramsVal;
	              }
	            }
	            queryArr.push(key + '=' + value);
	          });

	          query = queryArr.length ? queryArr.join('&') : '';

	          // 把query中，未匹配的统配符，转换成  xxx=
	          query = query.replace(/\:([^\&\=]+)/ig, '$1');
	        })();
	      }

	      // 拼接url
	      url = query ? body + '?' + query : body;

	      return url;
	    }
	  }, {
	    key: 'register',


	    /**
	     * 注册api
	     * @param id          注册api的id
	     * @param url         api的url
	     * @param params      api的参数
	     * @param actions     添加自定义方法的action
	     * @param options     设置自定义的options
	     *            cache
	     *            timeout
	     *            withCredentials
	     *            headers
	     *            responseType
	     *            interceptor
	     *            eventHandlers
	     * @returns {*}       返回一个$resource实例，可以直接调用[get,post,put...]等方法
	     */
	    value: function register() {
	      var id = arguments.length <= 0 || arguments[0] === undefined ? Math.random().toFixed(6) : arguments[0];
	      var url = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	      var params = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	      var actions = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
	      var options = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

	      if ($resource.q[id]) {
	        console.warn('API ' + id + ' can\'t be register twice');
	        id += Math.random().toFixed(6);
	      }
	      var api = new $resource(url, params, actions, options);
	      $resource.q[id] = api;
	      return api;
	    }
	  }, {
	    key: 'injector',
	    value: function injector(key, object) {
	      injection[key] = object;
	    }
	  }, {
	    key: 'invoke',
	    value: function invoke(key) {
	      return injection[key];
	    }
	  }, {
	    key: 'withCredentials',


	    // 是否跨域
	    set: function set(boolean) {
	      CONFIG.withCredentials = !!boolean;
	    },
	    get: function get() {
	      return CONFIG.withCredentials;
	    }
	  }, {
	    key: 'responseType',


	    // 响应类型
	    set: function set(type) {
	      CONFIG.responseType = type;
	    }
	  }, {
	    key: 'headers',


	    // 获取header
	    get: function get() {
	      return CONFIG.headers;
	    },


	    // 设置header
	    set: function set(json) {
	      if (!$utils.isObject(json)) return CONFIG.headers;
	      return $utils.extend(CONFIG.headers, json);
	    }
	  }, {
	    key: 'interceptor',


	    // 获取拦截器
	    get: function get() {
	      return interceptor;
	    },
	    set: function set(func) {
	      CONFIG.interceptor = func;
	    }
	  }, {
	    key: 'hosts',


	    // 设置api地址
	    set: function set(url) {
	      CONFIG.hosts = url;
	    },
	    get: function get() {
	      return CONFIG.hosts;
	    }
	  }, {
	    key: 'cache',
	    set: function set(boolean) {
	      CONFIG.cache = boolean;
	    }

	    // 转换请求头

	  }, {
	    key: 'transformHeaders',
	    get: function get() {
	      return CONFIG.transformHeaders;
	    }
	  }]);

	  return $resource;
	}();

	$resource.q = {};

	module.exports = $resource;

/***/ },
/* 46 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by axetroy on 16-4-24.
	 */

	var $common = function () {
	  function $common() {
	    _classCallCheck(this, $common);
	  }

	  _createClass($common, null, [{
	    key: 'transform',


	    /**
	     * 过滤器 | 变形器，用于数据的变形
	     * @param transformList   一个由函数，组成的数组
	     * @param value           要过滤的对象
	     * @param index           [不填的参数]
	     * @returns {*}           返回最终变形的结果
	     */
	    value: function transform() {
	      var transformList = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	      var value = arguments[1];
	      var index = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

	      var transformFunction = transformList[index];

	      if (!transformList || !transformList.length) return value;

	      // 传入的不是函数，则跳过
	      if (typeof transformFunction !== 'function') return $common.transform(value, ++index);

	      if (index < transformList.length - 1) {
	        value = transformFunction(value);
	        return $common.transform(transformList, value, ++index);
	      } else if (index === transformList.length - 1) {
	        // 最后一个
	        return transformFunction(value);
	      } else {
	        return value;
	      }
	    }
	  }, {
	    key: 'defaultActions',
	    get: function get() {
	      return {
	        get: { method: 'GET' },
	        query: { method: 'GET' },
	        post: { method: 'POST' },
	        save: { method: 'POST' },
	        create: { method: 'POST' },
	        put: { method: 'PUT' },
	        update: { method: 'PUT' },
	        fetch: { method: 'GET' },
	        delete: { method: 'DELETE' },
	        remove: { method: 'DELETE' },
	        options: { method: 'OPTIONS' },
	        head: { method: 'HEAD' },
	        patch: { method: 'PATCH' },
	        trace: { method: 'TRACE' },
	        connect: { method: 'CONNECT' },
	        move: { method: 'MOVE' },
	        copy: { method: 'COPY' },
	        link: { method: 'LINK' },
	        unlink: { method: 'UNLINK' },
	        wrapped: { method: 'WRAPPED' },
	        'extension-mothed': { method: 'Extension-mothed' }
	      };
	    }
	  }, {
	    key: 'defaultOptions',
	    get: function get() {
	      return {
	        cache: false,
	        timeout: null
	      };
	    }
	  }]);

	  return $common;
	}();

	module.exports = $common;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Created by axetroy on 16-4-24.
	 */

	var GLOBAL = __webpack_require__(2);

	var CONFIG = {
	  hosts: function (g) {
	    if (!g.location) {
	      return '';
	    } else {
	      return g.location.origin || g.location.host || '';
	    }
	  }(GLOBAL),
	  withCredentials: false,
	  cache: false,
	  responseType: '',
	  headers: {
	    Accept: 'application/json, text/plain, text/html, */*'
	  },
	  /**
	   * 默认拦截器
	   * @param response
	   * @param $q
	   * @returns {* | boolean | promise}
	   */
	  interceptor: function interceptor(response, $q) {
	    if (!response || response.status >= 400 || !response.data) {
	      return $q.reject();
	    } else {
	      return $q.resolve();
	    }
	  },
	  /**
	   * 默认的转换请求头数组
	   * 里面只能存储function
	   */
	  transformHeaders: [],
	  /**
	   * 默认的转换响应头头数组
	   * 里面只能存储function
	   */
	  transformResponseHeaders: []
	};

	module.exports = CONFIG;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var $http = __webpack_require__(6);
	var $resource = __webpack_require__(45);
	var MODULE_NAME = '$resource';

	angular.module(MODULE_NAME, []).provider(MODULE_NAME, function () {
	  var _this = this;

	  this.setResponseType = function (value) {
	    $resource.responseType = value;
	    return _this;
	  };
	  this.setHeaders = function (value) {
	    $resource.headers = value;
	    return _this;
	  };
	  this.setWithCredentials = function (value) {
	    $resource.withCredentials = value;
	    return _this;
	  };
	  this.setHosts = function (value) {
	    $resource.hosts = value;
	    return _this;
	  };
	  this.setInterceptor = function (func) {
	    $resource.interceptor = func;
	    return _this;
	  };
	  this.setTransformHeaders = function (func) {
	    $resource.transformHeaders.push(func);
	    return _this;
	  };
	  this.$get = ['$q', function ($q) {
	    $http.injector('$q', $q);
	    $resource.injector('$http', $http);
	    return $resource;
	  }];
	});

	exports.default = MODULE_NAME;

/***/ }
/******/ ])
});
;