/**
 * Created by axetroy on 16-4-27.
 */

describe('$resource', function () {

  it('test return value must is promise', function (done) {
    var getFile = $resource.register(Math.random(), '/:file.json');
    var promiseLike = getFile.get({file: 'test'}).$promise;
    if (promiseLike.then && _.isFunction(promiseLike.then)) {
      done();
    }
  });

  it('test request headers', function (done) {
    var expectHeaders = {
      Accept: 'application/json, text/plain, text/html, */*'
    };
    var getFile = $resource.register(Math.random(), '/:file.json');
    getFile.get({file: 'test'}).$promise
      .then(function (resp) {
        var headers = resp.config.headers;
        if (_.isEqual(headers, expectHeaders)) {
          done();
        }
      });
  });

  it('test response data', function (done) {
    var expectData = {
      "name": "demo",
      "age": 22
    };
    var getFile = $resource.register(Math.random(), '/:file.json');
    getFile.get({file: 'test'}).$promise
      .then(function (resp) {
        var data = resp.data;
        if (_.isEqual(data, expectData)) {
          done();
        }
      });
  });

  it('test response data2', function (done) {
    var expectData = {
      "name": "demo",
      "age": 22,
      "hello": false,
      "test": [
        "aaa",
        "bbb"
      ]
    };
    var getFile = $resource.register(Math.random(), '/:file.json');
    getFile.get({file: 'test2'}).$promise
      .then(function (resp) {
        var data = resp.data;
        if (_.isEqual(data, expectData)) {
          done();
        }
      });
  });

  it('test response data2', function (done) {
    var expectData = {
      "name": "demo",
      "age": 22,
      "hello": false,
      "test": [
        "aaa",
        "bbb"
      ]
    };
    var getFile = $resource.register(Math.random(), '/:file.json');
    getFile.get({file: 'test2'}).$promise
      .then(function (resp) {
        var data = resp.data;
        if (_.isEqual(data, expectData)) {
          done();
        }
      });
  });

  it('test request url is correct', function (done) {
    var url = '/:file.json';
    var params = {file: 'test2'};
    var getFile = $resource.register(Math.random(), url);
    getFile.get(params).$promise
      .then(function (resp) {
        var _url = resp.config.url;
        url = window.location.origin + $resource.parseParams(url, params);
        if (_.isEqual(_url, url)) {
          done();
        }
      });
  });

  it('test default cache options is false', function (done) {
    var url = '/:file.json';
    var params = {file: 'test2'};
    var getFile = $resource.register(Math.random(), url);
    getFile.get(params).$promise
      .then(function (resp) {
        var config = resp.config;
        if (config.cache === false) {
          done();
        }
      });
  });

  it('test default responseType options is empty string', function (done) {
    var url = '/:file.json';
    var params = {file: 'test2'};
    var getFile = $resource.register(Math.random(), url);
    getFile.get(params).$promise
      .then(function (resp) {
        var config = resp.config;
        if (config.responseType === '') {
          done();
        }
      });
  });

  it('test default withCredentials options is false', function (done) {
    var url = '/:file.json';
    var params = {file: 'test2'};
    var getFile = $resource.register(Math.random(), url);
    getFile.get(params).$promise
      .then(function (resp) {
        var config = resp.config;
        if (config.withCredentials === false) {
          done();
        }
      });
  });

  it('test default resource is correct', function (done) {
    var url = '/:file.json';
    var params = {file: 'test2'};
    var getFile = $resource.register(Math.random(), url);
    getFile.get(params).$promise
      .then(function (resp) {
        var resource = resp.resource;
        if ('$promise' in resource && '$resolve' in resource && resource.$resolve === true) {
          done();
        }
      });
  });

  it('test default cache options is correct apply', function (done) {
    var url = '/:file.json';
    var params = {file: 'test2'};
    var getFile = $resource.register(Math.random(), url, {}, {}, {cache: true});
    var cache;
    getFile.get(params).$promise
      .then(function (resp) {
        cache = resp;
        return getFile.get(params).$promise;
      })
      .then(function (resp) {
        if (resp === cache) {
          done();
        }
      });
  });

  it('test default cache options just cache once', function (done) {
    var url = '/:file.json';
    var params = {file: 'test2'};
    var getFile = $resource.register(Math.random(), url, {}, {}, {cache: false});
    var cache;
    getFile.get(params).$promise
      .then(function (resp) {
        cache = resp;
        return getFile.get(params).$promise;
      })
      .then(function (resp) {
        if (resp === cache) {
          console.info('cache once correct');
        }
        return getFile.get(params).$promise;
      })
      .then(function (resp) {
        consol.log(333);
        if (_.isEqual(resp,cache)) {
          done();
        }
      });
  });

});