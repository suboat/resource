/**
 * Created by axetroy on 16-4-24.
 */

let CONFIG = {
  hosts: window.location.origin || window.location.host || '',
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
  }
};

module.exports = CONFIG;