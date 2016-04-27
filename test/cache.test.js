/**
 * Created by axetroy on 16-4-27.
 */

var expect = require('chai').expect;

let $cache = require('../src/$cache');

describe('缓存测试', function () {

  it('缓存2次，赌气第2次会得到正确值', function () {
    var cache;
    $cache.set('test', {a: 333}, 2);
    cache = $cache.get('test');
    cache = $cache.get('test');
    expect(cache).to.be.deep.equal({a: 333});
  });

  it('缓存2次，读取第3次会过期', function () {
    var cache;
    $cache.set('test', {a: 333}, 2);
    cache = $cache.get('test');
    cache = $cache.get('test');
    cache = $cache.get('test');
    expect(cache === null).to.be.equal(true);
  });

  it('缓存2次，读取第4次会过期', function () {
    var cache;
    $cache.set('test', {a: 333}, 2);
    cache = $cache.get('test');
    cache = $cache.get('test');
    cache = $cache.get('test');
    cache = $cache.get('test');
    expect(cache === null).to.be.equal(true);
  });

  it('缓存2次，删除，则为null', function () {
    var cache;
    $cache.set('test', {a: 333}, 2);
    $cache.remove('test');
    cache = $cache.get('test');
    expect(cache === null).to.be.equal(true);
  });

  it('缓存次数为true，读取n次，还能读取到数据', function () {
    var cache;
    $cache.set('test', {a: 333}, true);
    cache = $cache.get('test');
    cache = $cache.get('test');
    cache = $cache.get('test');
    cache = $cache.get('test');
    cache = $cache.get('test');
    cache = $cache.get('test');
    cache = $cache.get('test');
    cache = $cache.get('test');
    cache = $cache.get('test');
    cache = $cache.get('test');
    expect(cache).to.be.deep.equal({a: 333});
  });

  it('缓存次数为false，不缓存，读取为null', function () {
    var cache;
    $cache.set('test', {a: 333}, false);
    cache = $cache.get('test');
    expect(cache === null).to.be.equal(true);
  });

});