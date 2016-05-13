/**
 * Created by axetroy on 16-4-27.
 */

var expect = require('chai').expect;

let $resource = require('../src/$resource');

let parseParams = $resource.parseParams;

let CASE = [
  {
    url: '/:path/:file.json',
    params: {path: 'demo', file: 'test'},
    result: '/demo/test.json'
  },
  {
    url: '/:path/:file.json?:username',
    params: {path: 'demo', file: 'test'},
    result: '/demo/test.json?username='
  },
  {
    url: '/:path/:file.json?username=:username',
    params: {path: 'demo', file: 'test'},
    result: '/demo/test.json?username='
  },
  {
    url: '/:path/:file.json?username=:username',
    params: {path: 'demo', file: 'test', username: false},
    result: '/demo/test.json?username=false'
  },
  {
    url: '/:path/:file.json?username=:username',
    params: {
      path: 'demo', file: 'test', username: function () {
        return true;
      }
    },
    result: '/demo/test.json?username=true'
  },
  {
    url: '/:path/:file.json?username=:username',
    params: {
      path: function () {
        return 'demo'
      }, file: 'test', username: function () {
        return true;
      }
    },
    result: '/demo/test.json?username=true'
  },
  {
    url: '/:path/:file.json?username=:username',
    params: {path: 'demo', file: 'test', username: 'admin'},
    result: '/demo/test.json?username=admin'
  },
  {
    url: '/:path/:file.json?username=:file',
    params: {path: 'demo', file: 'test', username: 'admin'},
    result: '/demo/test.json?username=test'
  },
  {
    url: '/:path/:file.json?username=:path',
    params: {path: 'demo', file: 'test', username: 'admin'},
    result: '/demo/test.json?username=demo'
  },
  {
    url: '/:path/:file.json?username=:username&pwd=:pwd',
    params: {path: 'demo', file: 'test', username: 'admin'},
    result: '/demo/test.json?username=admin&pwd='
  },
  {
    url: '/:path/:file.json?username=:username&pwd=:pwd&:age',
    params: {path: 'demo', file: 'test', username: 'admin'},
    result: '/demo/test.json?username=admin&pwd=&age='
  },
  {
    url: '/:path/:file.json?username=:username&pwd=:pwd&:age',
    params: {path: 'demo', file: 'test', username: 'admin', age: 22},
    result: '/demo/test.json?username=admin&pwd=&age=22'
  },
  {
    url: '/:path/:file.json?:username&:pwd&:age',
    params: {path: 'demo', file: 'test'},
    result: '/demo/test.json?username=&pwd=&age='
  },
  {
    url: '/:path/:file.:type?:username&:pwd&:age',
    params: {path: 'demo', type: 'json', file: 'test'},
    result: '/demo/test.json?username=&pwd=&age='
  },
  {
    url: '/:path/:file.:type?:username&:pwd&:age',
    params: {path: 'demo', type: 'html', file: 'test'},
    result: '/demo/test.html?username=&pwd=&age='
  },
  {
    url: '/:path/:file.:type?:username',
    params: {path: 'demo', type: 'html', file: 'test', username: 0},
    result: '/demo/test.html?username=0'
  },
  {
    url: '/:path/:file.:type?:username',
    params: {path: 'demo', type: 'html', file: 'test', username: false},
    result: '/demo/test.html?username=false'
  },
  {
    url: '/:path/:file.:type?:username',
    params: {path: 'demo', type: 'html', file: 'test', username: true},
    result: '/demo/test.html?username=true'
  },
  {
    url: '/:path/:file.:type?:username&age=:age',
    params: {path: 'demo', type: 'html', file: 'test', age: 22},
    result: '/demo/test.html?username=&age=22'
  }

];

describe('url解析测试,详情看测试用例', function () {

  CASE.forEach(function (d) {
    it(d.url + ' >>> ' + d.result, function () {
      expect(parseParams(d.url, d.params)).to.be.equal(d.result);
    });
  });

});