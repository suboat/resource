/**
 * Created by axetroy on 16-4-20.
 */

let $utils = require('./$utils');
let $q = require('q');
let $resource = require('./$resource');

// 默认的请求头
const HEADER = {
  Accept: 'application/json, text/plain, text/html, */*'
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
 * @returns {*}
 */
let $http = function ({url='', method='', headers={}, withCredentials=false, data=null, interceptor=$utils.noop, timeout=null, eventHandlers={}, cache=false}) {

  if (!url || !method) return;

  let deferred = $q.defer();

  let XHR = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : window.XMLHttpRequest ? new XMLHttpRequest() : new XDomainRequest();

  // CROS
  XHR.withCredentials = !!withCredentials;
  // timeout
  if (timeout) XHR.timeout = timeout;

  XHR.$$method = method;

  XHR.$$url = url;

  XHR.$$data = data;
  XHR.$$cache = cache;


  XHR.warper = {
    resource: {
      $promise: deferred.promise
    }
  };

  XHR.onreadystatechange = function (event) {
    if (XHR.readyState !== 4) return;

    if (/^(2|3)/.test(XHR.status)) {

      XHR.warper = XHRWraper(XHR, requestHeader, deferred.promise);

      // 经过拦截器筛选
      let inter = interceptor(XHR.warper);

      // 返回的是promise
      if ($utils.isDefined(inter) && $utils.isObject(inter) && $utils.isFunction(inter.then)) {
        inter.then(function (resp) {
          XHR.warper.resource.$resolve = true;
          deferred.resolve(resp || XHR.warper);
        }, function (error) {
          XHR.warper.resource.$resolve = false;
          deferred.reject(error || XHR.warper);
        });
      }
      // 返回的是布尔值
      else if ($utils.isBoolean(inter)) {
        if (!!interceptor(XHR.warper)) {
          XHR.warper.resource.$resolve = true;
          deferred.resolve(XHR.warper);
        } else {
          XHR.warper.resource.$resolve = false;
          deferred.reject(XHR.warper);
        }
      }

    } else {
      XHR.warper.resource.$resolve = false;
      deferred.reject(XHR.warper);
    }
  };

  // '错误'
  let ErrorHandler = {};
  ['timeout', 'error', 'abort'].forEach((eventName)=> {
    ErrorHandler[`on${eventName}`] = ()=> {
      deferred.reject(XHR.warper);
    };
  });

  ErrorHandler = $utils.merge(ErrorHandler, eventHandlers);

  $utils.forEach(ErrorHandler, function (handler, eventName) {
    XHR[eventName] = (XHR)=> {
      $utils.isFunction(handler) && handler(XHR);
    }
  });

  XHR.open(method, url, true);

  // 设置头部信息
  let requestHeader = $utils.merge(HEADER, headers && $utils.isObject(headers) ? headers : {});
  $utils.forEach(requestHeader, function (value, key) {
    XHR.setRequestHeader(key, value);
  });

  XHR.send(data ? JSON.stringify(data) : null);

  return XHR.warper.resource;
};

/**
 * 对XHR进行包装
 * @param XHR
 * @constructor
 */
let XHRWraper = (XHR, requireHeaders)=> {
  let config = {
    headers: requireHeaders,
    method: XHR.$$method.toUpperCase(),
    withCredentials: XHR.withCredentials,
    url: XHR.$$url,
    data: XHR.$$data,
    cache: XHR.$$cache
  }
  let data = format(XHR);

  // headers
  let headers = getResponseHeaders(XHR);

  let resource = $utils.extend(XHR.warper.resource, {$resolve: false}, data || {})

  return {config, data, headers, resource, status: XHR.status, statusText: XHR.statusText};

}

// 格式化返回头
let getResponseHeaders = (XHR)=> {
  let headers = {};
  let respHeaders = XHR.getAllResponseHeaders();
  respHeaders.split(/\n/g).forEach(function (str, index) {
    let match = /^([\s\S]+)\:([\s\S]+)$/i.exec(str);
    if (!match || !match[1] || !match[2]) return;
    let key = match[1].trim();
    let value = match[2].trim();
    headers[key] = value;
  });
  return headers;
};

/**
 * 格式化response
 * @param XHR
 */
let format = (XHR)=> {

  let response = XHR.response;
  let contentType = XHR.getResponseHeader('content-type');

  // json
  if (/\/json/.test(contentType)) {
    return $utils.fromJSON(response);
  } else {
    return response;
  }

};

['GET',
  'POST',
  'PUT',
  'DELETE',
  'FETCH',
  'HEAD',
  'DELETE',
  'PATCH',
  'OPTIONS',
  'TRACE',
  'CONNECT',
  'MOVE',
  'COPY',
  'LINK',
  'UNLINK',
  'WRAPPED',
  'Extension-mothed']
  .forEach(function (method) {
    $http[method.toLocaleLowerCase()] = function (url, params = {}, config) {
      // 除GET方法外，其余带DATA
      let data = /^\s*GET/i.test(method) ? null : Object.keys(params).length ? params : null;
      config = $utils.merge({url, method, data}, config);
      return $http(config);
    };

  });

$resource.$http = $http;

module.exports = $http;