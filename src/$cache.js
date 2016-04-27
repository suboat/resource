/**
 * Created by axetroy on 16-4-27.
 */

let $$cache = {};

let $cache = {};


$cache.get = (key)=> {

  if (!key || !$$cache[key]) return null;

  let _cache = $$cache[key];

  // 不存在
  if (!_cache) return null;

  // times设置为boolean
  if (typeof _cache.times === 'boolean') {
    return !!_cache.times ? _cache.value : null;
  }

  // 过期
  if (_cache.used >= _cache.times) {
    delete $$cache[key];
    return null;
  }

  _cache.used++;

  return _cache.value;

};


$cache.set = (key, value, times)=> {
  return $$cache[key] = {
    key,
    times,
    value,
    used: 0
  };
};

$cache.remove = (key)=> {
  delete $$cache[key];
};

module.exports = $cache;