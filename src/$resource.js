let $utils = require('./$utils');
let $q = require('q');

let $http = function () {

};

let CONFIG = {
  hosts: '',
  withCredentials: false,
  headers: {
    Accept: 'application/json, text/plain, text/html, */*'
  }
}

// 全局的header
let headers = {
  Accept: 'application/json, text/plain, text/html, */*'
};

/**
 * 全局的拦截器
 * @param response
 * @returns {boolean | promise}
 */
let interceptor = (response)=> {
  if (!response || response.status >= 400 || response.data.error || !response.data.success || !response.data || !response.data.data) {
    return $q.reject();
  } else {
    return $q.resolve(response.data);
  }
};

/**
 * $resource请求
 */
class $resource {
  constructor(url, registerParams = {}, actions = {}, {timeout=null, cache=false} = {}) {

    // default actions
    actions = $utils.extend({
      'get': {method: 'GET'},
      'post': {method: 'POST'},
      'put': {method: 'PUT'},
      'delete': {method: 'DELETE'},
      'fetch': {method: 'GET'},
      'save': {method: 'POST'},
      'remove': {method: 'DELETE'},
      'update': {method: 'PUT'}
    }, actions);

    class http {
      constructor() {
        this.url = url;
        this.parmas = registerParams;
      };
    }

    $utils.forEach(actions, (object, methodName) => {

      // 设置header和拦截器和跨域请求
      object.headers = object.headers ? object.headers : CONFIG.headers;
    object.interceptor = object.interceptor ? object.interceptor : interceptor;
    object.withCredentials = object.withCredentials !== undefined ? object.withCredentials : CONFIG.withCredentials;
    /**
     * 函数调用时，真正传入的参数
     * @param params      解析url的参数，如果为post，put等，则会放进requestBody
     * @param privateConfig     私有设置，设置请求头等，只针对当前方法生效
     * @returns {*}       $resource
     */
    http.prototype[methodName] = function (params = {}, privateConfig = {}) {
      let _url = $resource.parseParams(url, params);
      /**
       * 发送http请求
       * arguments:
       *  1: 真正的url地址
       *  2: 参数，如果位post，put等，则为requestBody
       *  3: 配置项
       *  4: 临时配置项，比如只配置此次调用
       */
      return $http[object.method.toLowerCase()](_url, params, {
        headers: object.headers,
        withCredentials: object.withCredentials,
        interceptor: object.interceptor,
        timeout,
        cache
      }, privateConfig);
    };

  });

    return new http();

  };

  // 是否跨域
  static set withCredentials(boolean) {
    CONFIG.withCredentials = !!boolean;
  }

  static get withCredentials() {
    return CONFIG.withCredentials;
  }

  // http
  static set $http(func) {
    $http = func;
  }

  static get $http() {
    return $http;
  }

  // 获取header
  static get headers() {
    return CONFIG.headers;
  };

  // 设置header
  static set headers(json) {
    if (!$utils.isObject(json)) return CONFIG.headers;
    return $utils.extend(CONFIG.headers, json);
  };

  // 获取拦截器
  static get interceptor() {
    return interceptor;
  };

  static set interceptor(func) {
    interceptor = func;
  };

  // 设置api地址
  static set hosts(url) {
    CONFIG.hosts = url;
  }

  static get hosts() {
    return CONFIG.hosts;
  }

  /**
   * 将url和参数解析，得到真正的url地址
   * @param url
   * @param params
   * @returns {*}
   */
  static parseParams(url, params) {
    if (!$utils.isObject(params)) return url;

    $utils.forEach(params, function (value, key) {
      url = url.replace(new RegExp(':' + key, 'g'), value);
    });

    return url;
  };

  /**
   * 注册api
   * @param id          注册api的id
   * @param url         api的url
   * @param params      api的参数
   * @param actions     添加自定义方法的action
   * @param options     设置自定义的options
   * @returns {*}       返回一个$resource实例，可以直接调用[get,post,put...]等方法
   */
  static register(id = Math.random().toFixed(6), url, params, actions, options) {
    if ($resource.q[id]) console.warn(`API ${id} can't be register twice`);
    url = CONFIG.hosts + url;
    $resource.q[id] = new $resource(url, params, actions, options);
    return $resource.q[id];
  };

}

$resource.q = {};

module.exports = $resource;