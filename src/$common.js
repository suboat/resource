/**
 * Created by axetroy on 16-4-24.
 */

let $utils = require('./$utils');
let CONFIG = require('./$resource.config');

let defaultActions = {
  get: {
    method: 'GET',
    url: '',
    params: {},
    isArray: false,
    transformRequest: $utils.noop,
    transformResponse: $utils.noop,
    cache: false,
    timeout: null,
    cancellable: false,
    withCredentials: CONFIG.withCredentials,
    responseType: '',
    interceptor: null
  },
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

let defaultOptions = {
  cache: false,
  timeout: null
};

class $common {
  constructor() {

  };

  static get defaultActions() {
    return defaultActions;
  };

  static get defaultOptions() {
    return defaultOptions;
  };

  static transformHeaders(headers) {
    return JSON.stringify(headers);
  }

  /**
   * 过滤器 | 变形器，用于数据的变形
   * @param transformList   一个由函数，组成的数组
   * @param value           要过滤的对象
   * @param index           [不填的参数]
   * @returns {*}           返回最终变形的结果
   */
  static transform(transformList, value, index = 0) {
    let transformFunction = transformList[index];
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
  }

}

module.exports = $common;