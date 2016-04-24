let $http = require('./src/$http');

let $resource = require('./src/$resource');

let g = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;

if (g.angular) {
  g.angular.module('$resource', [])
    .provider('$resource', function () {

      this.setResponseType = (value)=> {
        $resource.responseType = value;
        return this;
      };

      this.setHeaders = (value)=> {
        $resource.headers = value;
        return this
      };

      this.setWithCredentials = (value)=> {
        $resource.withCredentials = value;
      };

      this.setHosts = (value)=> {
        $resource.hosts = value;
        return this;
      };

      this.setInterceptor = (func)=> {
        $resource.interceptor = func;
        return this;
      };

      this.$get = function () {
        return $resource;
      }
    });
} else if (g.$ && g.jQuery) {
  g.$.fn = $resource;
} else {
  window.$resource = $resource;
}

module.exports = $resource;
