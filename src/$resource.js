let $utils = require('./$utils');
let $common = require('./$common');
let CONFIG = require('./$resource.config');

let injection = {};

/**
 * $resource请求
 */
class $resource {
  constructor(url = '', registerParams = {}, actions = {}, options = {}) {
    // default actions
    actions = $utils.merge($common.defaultActions, actions);
    // default options
    options = $utils.merge($common.defaultOptions, {cache: CONFIG.cache}, options);

    $utils.forEach(actions, (action)=> {
      action.url = url;

      let query = [];
      $utils.forEach(registerParams, (value, key)=> {
        const INLINE_REG = new RegExp(':' + key, 'g');
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

    let transformHeaders = $utils.isArray(options.transformHeaders) ? options.transformHeaders : [];

    class Http {
      constructor() {
        this.url = url;
        this.parmas = registerParams;
        this.actions = actions;
        this.options = options;
        this.transformHeaders = transformHeaders;
      };
    }

    $utils.forEach(actions, (object, action) => {

      // 设置header和拦截器和跨域请求
      let {
        headers=CONFIG.headers,
        interceptor=CONFIG.interceptor,
        responseType = CONFIG.responseType,
        withCredentials=CONFIG.withCredentials
      } = object;

      /**
       * 实例化之后，真正调用的函数
       * @param realParams      解析url的参数，如果为post，put等，则会放进requestBody
       * @param config      私有设置，设置请求头等，只针对当前方法生效
       * @returns {*}       $resource
       */
      Http.prototype[action] = function (realParams = {}, config = {}) {
        let body = $resource.parseParams(CONFIG.hosts + object.url, realParams);
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
        _config.headers = $common.transform(CONFIG.transformHeaders.concat(transformHeaders, config.transformHeaders || []), _config.headers);
        /**
         * 发送http请求
         * arguments:
         *  1: 真正的url地址
         *  2: 参数，如果为post，put等，则为requestBody
         *  3: 配置项
         *  4: 临时配置项，比如只配置此次调用
         */
        let $http = $resource.invoke('$http');
        return $http[object.method.toLowerCase()](body, realParams, _config);
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
  }

  static set cache(boolean) {
    CONFIG.cache = boolean;
  }

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

    let urlParts = url.split('?');
    let [body='',query=''] = [urlParts[0], urlParts[1]];

    if ($utils.isArray(params)) {

    } else if ($utils.isObject(params)) {
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
      let queryArr = [];

      /**
       * 替换查询字符串的通配符
       * 以 & 切割查询字符串
       * [':user','pwd=:pwd']
       */
      query.split('&').forEach((group)=> {
        if (group === '') return;
        let _match = group.split('=');
        let key = _match[0] || '';
        let value = _match[1] || '';
        if (!value) {
          if (/^\:/.test(key)) {
            key = key.replace(/^\:/, '');
            let _value = params[key];
            value = _value === undefined || _value === null ? '' : _value;
          }
        }
        else {
          key = /^\:/.test(key) ? key.replace(/^\:/, '') : key;
          if (/^\:/.test(value)) {
            let _value = value.replace(/^\:/, '');
            let paramsVal = params[_value];
            paramsVal = $utils.isFunction(paramsVal) ? paramsVal() : paramsVal;
            value = paramsVal === undefined ||
            paramsVal === null ||
            $utils.isNumber(paramsVal) && isNaN(paramsVal) ? '' : paramsVal;
          }
        }
        queryArr.push(key + '=' + value);
      });

      query = queryArr.length ? queryArr.join('&') : '';

      // 把query中，未匹配的统配符，转换成  xxx=
      query = query.replace(/\:([^\&\=]+)/ig, '$1');

    }

    // 拼接url
    url = query ? body + '?' + query : body;

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
    if ($resource.q[id]) {
      console.warn(`API ${id} can't be register twice`);
      id += Math.random().toFixed(6);
    }
    let api = new $resource(url, params, actions, options);
    $resource.q[id] = api;
    return api;
  };

  static injector(key, object) {
    injection[key] = object;
  }

  static invoke(key) {
    return injection[key];
  }

}

module.exports = $resource;