/**
 * Created by axetroy on 16-4-20.
 */

let $utils = require('./$utils');
let $q = require('q');
let $resource = require('./$resource');
let $common = require('./$common');
let GLOBAL = require('./global');
let $cache = require('./$cache');

// 默认的配置
let config = {
  headers: {
    Accept: 'application/json, text/plain, text/html, */*'
  }
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
let $http = function ({
  url='',
  method='',
  headers={},
  withCredentials=false,
  data=null,
  interceptor=$utils.noop,
  timeout=null,
  eventHandlers={},
  cache=false,
  responseType=''
}) {

  if (!url || !method) return $q.reject();


  let deferred = $q.defer();

  let _cache = $cache.get(url + '-' + method);
  if (_cache) {
    let _XHRWrapper = _cache;
    if (_cache) {
      _XHRWrapper.resource.$promise = deferred.promise;
      _XHRWrapper.resource.$resolve ? deferred.resolve(_XHRWrapper) : deferred.reject(_XHRWrapper);
      return _XHRWrapper.resource;
    }
  }

  let XHR = GLOBAL.XMLHttpRequest ? new XMLHttpRequest() :
    GLOBAL.XDomainRequest ? new XDomainRequest() :
      GLOBAL.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") :
        null;

  if (!XHR) {
    console.error('your browser is not support XMLHttpRequest');
    deferred.reject();
    return {$promise: deferred.promise, $resolve: false};
  }

  // CROS
  XHR.withCredentials = !!withCredentials;

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

  XHR.onreadystatechange = ()=> {
    if (XHR.readyState !== 4) return;

    XHR.warpper = XHRWrapper(XHR);

    if (/^(2|3)/.test(XHR.status)) {
      // 经过拦截器筛选
      let inter = interceptor(XHR.warpper, $q);
      $common.returnValueHandler(inter, XHR.warpper)
        .then((response)=> {
          XHR.warpper.resource.$resolve = true;
          cache && $cache.set(url + '-' + method, XHR.warpper, cache);
          deferred.resolve(response || XHR.warpper);
        }, (response)=> {
          XHR.warpper.resource.$resolve = false;
          cache && $cache.set(url + '-' + method, XHR.warpper, cache);
          deferred.reject(response || XHR.warpper);
        });
    } else {
      XHR.warpper.resource.$resolve = false;
      deferred.reject(XHR.warpper);
    }
  };

  // XHR 事件
  let errorFunc = (event, XHRWrapper)=> deferred.reject(XHRWrapper);
  let ErrorHandler = $utils.merge({
    ontimeout: errorFunc,
    onerror: errorFunc,
    onabort: errorFunc
  }, eventHandlers);

  $utils.forEach(ErrorHandler, function (handler = $utils.noop, eventName) {
    XHR[eventName] = (event)=> {
      XHR.warpper = XHRWrapper(XHR);
      $utils.isFunction(handler) && handler(event, XHR.warpper);

      if (/(ontimeout|onerror|onabort)/i.test(eventName)) {
        XHR.warpper.resource.$resolve = false;
        cache && $cache.set(url + '-' + method, XHR.warpper, cache);
        deferred.reject(XHR.warpper);
      }
    }
  });

  XHR.open(method, url, true);

  // 设置头部信息，必须在open服务器之后
  XHR.$$requestHeader = $utils.merge(config.headers, headers);
  $utils.forEach(XHR.$$requestHeader, (value, key)=> XHR.setRequestHeader(key, value));

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
let XHRWrapper = (XHR)=> {
  // config
  let config = {
    headers: XHR.$$requestHeader,
    method: XHR.$$method.toUpperCase(),
    withCredentials: XHR.withCredentials,
    url: XHR.$$url,
    data: XHR.$$data,
    cache: XHR.$$cache,
    responseType: XHR.responseType
  };

  // response header
  let headers = (()=> {
    let _headers = {};
    let respHeaders = XHR.getAllResponseHeaders();
    // response header按换行符分割
    respHeaders.split(/\n/g).forEach(function (str) {
      let match = str.split(':'), key, value;
      if (!match || !match.length || !match[0]) return;
      key = match[0];
      value = match.length <= 1 ? '' : match.slice(1).join(':');
      _headers[key.trim().toLowerCase()] = value.trim();
    });
    return _headers;
  })();

  // response data
  let data = /\/json/i.test(headers['content-type']) ? $utils.fromJson(XHR.response) : XHR.response;

  // the resource
  let resource = $utils.extend(XHR.warpper.resource, data || {});

  return {$$XHR: XHR, config, data, headers, resource, status: XHR.status, statusText: XHR.statusText};
};

[
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'FETCH',
  'HEAD',
  'PATCH',
  'OPTIONS',
  'TRACE',
  'CONNECT',
  'MOVE',
  'COPY',
  'LINK',
  'UNLINK',
  'WRAPPED',
  'Extension-mothed'
].forEach(function (method) {
  /**
   * http 各种方法
   * @param url         真实的url地址
   * @param params      参数
   * @param config      配置项
   * @returns {*}       promise
   */
  $http[method.toLocaleLowerCase()] = function (url = '', params = {}, config = {}) {
    // 除GET方法外，其余带DATA
    let data = /^\s*GET/i.test(method) ? null : Object.keys(params).length ? params : null;
    config = $utils.merge({url, method, data}, config);
    return $http(config);
  };

});

$resource.$http = $http;

module.exports = $http;