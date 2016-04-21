/**
 * Created by axetroy on 16-4-20.
 */

let $utils = require('./$utils');
let $q = require('q');
let $resource = require('./$resource');

// 默认的请求头
const HEADER = {
  Accept: 'application/json, text/plain, text/html, */*',
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

  if (cache) {
    // 如果已有缓存
    let cache = getCache(url);
    if (cache) {
      if (cache.status === 1) {
        let XHR = cache.XHR;
        let response = format(XHR);
        deferred.resolve(response);
      } else {
        deferred.reject(cache.XHR);
      }
      return deferred.promise;
    }
  }

  let XHR = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();

  // CROS
  if (withCredentials !== undefined) XHR.withCredentials = withCredentials;
  // timeout
  if (timeout) XHR.timeout = timeout;

  XHR.onreadystatechange = function (event) {
    if (XHR.readyState !== 4) return;

    let response = format(XHR);

    if (/^(2|3)/.test(XHR.status)) {

      // 经过拦截器筛选
      let inter = interceptor(response);

      // 返回的是promise
      if ($utils.isDefined(inter) && $utils.isObject(inter) && $utils.isFunction(inter.then)) {
        inter.then(function () {
          setCache(url, 1, XHR);
          deferred.resolve(response);
        }, function () {
          setCache(url, 0, XHR);
          deferred.reject(response);
        });
      }
      // 返回的是布尔值
      else if ($utils.isBoolean(inter)) {
        if (!!interceptor(response)) {
          setCache(url, 1, XHR);
          deferred.resolve(response);
        } else {
          setCache(url, 0, XHR);
          deferred.reject(response);
        }
      }

    } else {
      setCache(url, 0, XHR);
      deferred.reject(response);
    }
  };

  // '错误'
  let ErrorHandler = {};
  ['timeout', 'error', 'abort'].forEach((eventName)=> {
    ErrorHandler[`on${eventName}`] = ()=> {
      setCache(url, 0, XHR);
      deferred.reject(XHR);
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
  headers = $utils.merge(HEADER, headers && $utils.isObject(headers) ? headers : {});
  $utils.forEach(headers, function (value, key) {
    XHR.setRequestHeader(key, value);
  });

  XHR.send(data ? JSON.stringify(data) : null);

  return deferred.promise;
};

$http.cache = {};

let setCache = (url, status, XHR)=> {
  $http.cache[url] = {
    status,
    XHR
  };
};

let getCache = (url)=> {
  return cache = $http.cache[url];
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
      let deferred = $q.defer();
      // 除GET方法外，其余带DATA
      let data = /^\s*GET/i.test(method) ? null : params;
      config = $utils.merge({url, method, data}, config);
      $http(config).then(function (resp) {
        deferred.resolve(resp);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

  });

$resource.$http = $http;

module.exports = $http;