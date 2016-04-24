
let $http = require('./src/$http');

let $resource = require('./src/$resource');

let g = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;

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

module.exports = $resource;