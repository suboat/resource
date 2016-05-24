let GLOBAL = require('./src/global');
let Q = require('q');
let $http = require('./src/$http');
let $resource = require('./src/$resource');

if (GLOBAL.angular) {
  GLOBAL.angular.module('$resource', [])
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
        return this;
      };
      this.setHosts = (value)=> {
        $resource.hosts = value;
        return this;
      };
      this.setInterceptor = (func)=> {
        $resource.interceptor = func;
        return this;
      };
      this.setTransformHeaders = (func) => {
        $resource.transformHeaders.push(func);
        return this;
      };

      this.$get = ['$q', function ($q) {
        $http.injector('$q', $q);
        $resource.injector('$http', $http);
        return $resource;
      }]
    });
} else {
  $http.injector('$q', Q);
  $resource.injector('$http', $http);
  if (GLOBAL.$ && GLOBAL.jQuery) {
    GLOBAL.$.$resource = $resource;
  } else {
    GLOBAL.$resource = $resource;
  }
}

module.exports = $resource;