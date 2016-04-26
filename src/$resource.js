let $utils = require('./$utils');
let $common = require('./$common');
let CONFIG = require('./$resource.config');
let $q = require('q');

let $http = function () {

};

/**
 * $resource请求
 */
class $resource {
  constructor(url = '', registerParams = {}, actions = {}, options = {}) {
    // default actions
    actions = $utils.merge($common.defaultActions, actions);
    // default options
    options = $utils.merge($common.defaultOptions, options);

    // actions.uid = Math.random();

    $utils.forEach(actions, (action)=> {
      action.url = url;
      // $utils.extend(action, {url});

      let query = [];
      $utils.forEach(registerParams, (value, key)=> {
        // 匹配url地址上，是否出现  :xxx
        let inlineReg = new RegExp(':' + key, 'g');
        // 匹配params的value值，是否使用通配符绑定数值
        let bindReg = /^\@/;
        if (inlineReg.test(action.url)) {
          if (bindReg.test(value)) {
            action.url = action.url.replace(inlineReg, ':' + value.replace(bindReg, ''))
          } else {
            action.url = action.url.replace(inlineReg, value);
          }
          // action.url = bindReg.test(value) ? action.url.replace(inlineReg, ':' + value.replace(bindReg, '')) : action.url.replace(inlineReg, value);
        } else {
          // 以@开头 例如 '@limit'
          if (bindReg.test(value)) {
            query.push(key + '=' + ':' + value.replace(bindReg, ''))
          } else {
            query.push(key + '=' + value);
          }
          // bindReg.test(value) ? query.push(key + '=' + ':' + value.replace(bindReg, '')) : query.push(key + '=' + value);
        }
      });

      if (query.length) {
        query = query.join('&');
        action.url += (/\?/.test(action.url) ? '&' : '?') + query;
      }

    });
    class Http {
      constructor() {
        this.url = url;
        this.parmas = registerParams;
        this.actions = actions;
        this.options = options;
        this.transformHeaders = $utils.isArray(options.transformHeaders) ?
          options.transformHeaders : [];
      };
    }

    $utils.forEach(actions, (object, action) => {

      // 设置header和拦截器和跨域请求
      let headers = object.headers || CONFIG.headers;
      let interceptor = object.interceptor || CONFIG.interceptor;
      let responseType = object.responseType || CONFIG.responseType;
      let withCredentials = object.withCredentials !== undefined ? !!object.withCredentials : CONFIG.withCredentials;
      /**
       * 实例化之后，真正调用的函数
       * @param realParams      解析url的参数，如果为post，put等，则会放进requestBody
       * @param config      私有设置，设置请求头等，只针对当前方法生效
       * @returns {*}       $resource
       */
      Http.prototype[action] = function (realParams = {}, config = {}) {
        let _url = $resource.parseParams(CONFIG.hosts + object.url, realParams);
        let _config = $utils.merge({
            headers,
            withCredentials,
            interceptor,
            responseType
          }, options, config,
          // 合并所有headers
          {
            headers: $utils.merge(headers, options.headers, config.headers)
          });
        // 转换请求头
        _config.headers = $common.transform(CONFIG.transformHeaders.concat(this.transformHeaders, config.transformHeaders || []), headers);
        /**
         * 发送http请求
         * arguments:
         *  1: 真正的url地址
         *  2: 参数，如果为post，put等，则为requestBody
         *  3: 配置项
         *  4: 临时配置项，比如只配置此次调用
         */
        return $http[object.method.toLowerCase()](_url, realParams, _config);
      };

    });

    return new Http();

  };

  // 是否跨域
  static set withCredentials(boolean) {
    CONFIG.withCredentials = !!boolean;
  };

  static get withCredentials() {
    return CONFIG.withCredentials;
  };

  // 响应类型
  static set responseType(type) {
    CONFIG.responseType = type;
  };

  // http
  static set $http(func) {
    $http = func;
  };

  static get $http() {
    return $http;
  };

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
    CONFIG.interceptor = func;
  };

  // 设置api地址
  static set hosts(url) {
    CONFIG.hosts = url;
  };

  static get hosts() {
    return CONFIG.hosts;
  };

  // 转换请求头
  static get transformHeaders() {
    return CONFIG.transformHeaders;
  };

  /**
   * 将url和参数解析，得到真正的url地址
   * @param url
   * @param params
   * @returns {*}
   */
  static parseParams(url, params = {}) {
    if (!$utils.isObject(params)) return url;

    /**
     * 把参数对应填到url的  :xxx  上
     * 例如：
     * url    /:path/:file.json
     * params {path:'demo',file:'test'}
     *
     * 生成    /demo/test.json
     */
    $utils.forEach(params, function (value, key) {
      url = url.replace(new RegExp(':' + key, 'g'), value);
    });


    /**
     * 如果还有未传入的参数，但是url上面却有通配符
     * 例如：
     * url    /:path/:file.json?:user&pwd=:pwd
     *
     * params {file:'test'}
     *
     * url需要4个字段填充，但是params只传入一个
     * 以下进行处理
     */

    let urlParts = url.split('?');        // 切割url
    let _url = urlParts[0];               // /:path/:file.json
    let queryString = urlParts[1];        // :user&pwd=:pwd

    // 处理查询字符串
    if (queryString && /\:[^\&]+/.test(queryString)) {
      let queryArr = [];

      // 替换查询字符串的通配符
      if (/\:([a-z_\$][\w\$]*)/.test(queryString)) {

        /**
         * 以 & 切割查询字符串
         * [':user','pwd=:pwd']
         */
        queryString.split('&').forEach((group)=> {
          let _match = group.split('=');
          let key = _match[0];                      // 查询字符串的key
          let value = _match[1];                    // 查询字符串的value
          /**
           * 如果不存在value值， :user
           */
          if (!value) {
            // 如果key值是通配符 :user
            if (/^\s*\:([\w]+)/i.test(key)) {
              // 拼接成  user=
              key = key.replace(/^\s*\:([\w]+)/i, '$1');
            }
            queryArr.push(key + '=');
          }
          // 如果存在value值，  pwd=:pwd
          else {
            // 拼接成  pwd=:pwd
            queryArr.push(key + '=' + value);
          }
        });

      }
      url = _url + '?' + queryArr.join('&');
    }

    /**
     * 把未传入的通配符清空
     * :path        >>> ''
     * pwd=:pwd     >>> pwd=''
     */

    url = url.replace(/\:[a-z_\$][\w\$]*/ig, '');

    return url;
  };

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
  static register(id = Math.random().toFixed(6), url = '', params = {}, actions = {}, options = {}) {
    if ($resource.q[id]) console.warn(`API ${id} can't be register twice`);
    let api = new $resource(url, params, actions, options);
    $resource.q[id] = api;
    return api;
  };

}

$resource.q = {};

$resource.$utils = $utils;
$resource.$q = $q;

module.exports = $resource;