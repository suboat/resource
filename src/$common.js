/**
 * Created by axetroy on 16-4-24.
 */

let $utils = require('./$utils');
let $q = require('q');

class $common {
  constructor() {

  };

  static get defaultActions() {
    return {
      get: {method: 'GET'},
      query: {method: 'GET'},
      post: {method: 'POST'},
      save: {method: 'POST'},
      create: {method: 'POST'},
      put: {method: 'PUT'},
      update: {method: 'PUT'},
      fetch: {method: 'GET'},
      delete: {method: 'DELETE'},
      remove: {method: 'DELETE'},
      options: {method: 'OPTIONS'},
      head: {method: 'HEAD'},
      patch: {method: 'PATCH'},
      trace: {method: 'TRACE'},
      connect: {method: 'CONNECT'},
      move: {method: 'MOVE'},
      copy: {method: 'COPY'},
      link: {method: 'LINK'},
      unlink: {method: 'UNLINK'},
      wrapped: {method: 'WRAPPED'},
      'extension-mothed': {method: 'Extension-mothed'}
    };
  };

  static get defaultOptions() {
    return {
      cache: false,
      timeout: null
    };
  };

  /**
   * 过滤器 | 变形器，用于数据的变形
   * @param transformList   一个由函数，组成的数组
   * @param value           要过滤的对象
   * @param index           [不填的参数]
   * @returns {*}           返回最终变形的结果
   */
  static transform(transformList = [], value, index = 0) {
    let transformFunction = transformList[index];

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
      return value
    }
  };

  /**
   * 处理函数的返回值
   * @param value
   * @param defaultReturnVal
   * @returns {promise}
   */
  static returnValueHandler(value, defaultReturnVal) {
    let [deferred,val] = [$q.defer(), value];

    if ($utils.isFunction(value)) val = value();

    // false || undefined || null || NaN
    if (!val) {
      deferred.reject(defaultReturnVal);
    }
    // true
    else if ($utils.isBoolean(val)) {
      deferred.resolve(defaultReturnVal);
    }
    // promise
    else if ($utils.isObject(val) && $utils.isFunction(val.then)) {
      return val;
    } else {
      deferred.reject(value);
    }
    return deferred.promise;
  }

}

module.exports = $common;