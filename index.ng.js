let $http = require('./src/$http');
let $resource = require('./src/$resource');
const MODULE_NAME = '$resource';

angular.module(MODULE_NAME, [])
  .provider(MODULE_NAME, function () {
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

export default MODULE_NAME;
