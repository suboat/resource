/**
 * Created by axetroy on 16-4-24.
 */

let GLOBAL = require('./global');

let CONFIG = {
  hosts: ((g)=> {
    if (!g.location) {
      return '';
    } else {
      return g.location.origin || g.location.host || '';
    }
  })(GLOBAL),
  withCredentials: false,
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
  interceptor: (response, $q)=> {
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