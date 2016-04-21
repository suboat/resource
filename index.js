/**
 * Created by axetroy on 16-4-20.
 */
let $http = require('./src/$http');

let $resource = require('./src/$resource');

let g = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;

if (typeof module !== "undefined" && typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = $resource;
}
else if (typeof define !== "undefined" && typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
  g.define(function () {
    return $resource
  });
}

if (g.angular) {
  g.angular.module('$resource', [])
    .provider('$resource', function () {
      this.$get = function () {
        return $resource;
      }
    });
} else if (g.$ && g.jQuery) {
  g.$.fn = $resource;
} else {
  window.$resource = $resource;
}