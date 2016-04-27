let $http = require('./src/$http');

let $resource = require('./src/$resource');

let GLOBAL = require('./src/global');

if (GLOBAL.angular) {
  GLOBAL.angular.module('$resource', [])
    .provider('$resource', function () {

      let $resourceProvider = this;

      $resourceProvider.setResponseType = (value)=> {
        $resource.responseType = value;
        return $resourceProvider;
      };

      $resourceProvider.setHeaders = (value)=> {
        $resource.headers = value;
        return $resourceProvider
      };

      $resourceProvider.setWithCredentials = (value)=> {
        $resource.withCredentials = value;
        return $resourceProvider;
      };

      $resourceProvider.setHosts = (value)=> {
        $resource.hosts = value;
        return $resourceProvider;
      };

      $resourceProvider.setInterceptor = (func)=> {
        $resource.interceptor = func;
        return $resourceProvider;
      };

      $resourceProvider.setTransformHeaders = function (func) {
        $resource.transformHeaders.push(func);
        return $resourceProvider;
      };

      $resourceProvider.$get = function () {
        return $resource;
      }
    });
} else if (GLOBAL.$ && GLOBAL.jQuery) {
  GLOBAL.$.fn = $resource;
} else {
  GLOBAL.$resource = $resource;
}

module.exports = $resource;
