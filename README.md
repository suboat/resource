## 基于原生XMLHTTPRequest,ES6语法编写，符合restful接口的http库

## 文档目录

1. [使用方法](#使用方法)
1. [$resource](#resource对象)
    1. [属性](#resource的属性)
        1. [responseType](#responsetype)
        1. [headers](#headers)
        1. [withCredentials](#withcredentials)
        1. [hosts](#hosts)
        1. [interceptor](#interceptor)
        1. [transformHeaders](#transformHeaders)
        1. [q](#q)
        1. [$utils](#utils)
    1. [方法](#resource的方法)
        1. [$resource()](#resource)
            1. [$resource的实例](#resource实例)
        1. [$resource.register()](#register)
        1. [$resource.$http()](#http)
1. [response的数据结构](#response的数据结构)
1. [demo](#例子)
    1. [获取一个json文件](#获取一个json文件)
    1. [获取某个用户信息](#获取某个用户信息)
    1. [自定义某个API的headers](#自定义某个api的headers)
    1. [指定某个action的请求头](#指定某个action的请求头)
1. [构建项目](#构建项目)

## 使用方法

bower:
```bash
// 尚未上传至bower
bower install resource
```

npm:
```bash
// 尚未上传至npm
bower install resource
```

```javascript
import $resource from 'resource';
// or
var $resource = require('resource');
```

## $resource对象

整包输出$resource对象

分别以3中情况输出

- AngularJs

    自动生成一个$resource模块，里面有$resource服务

    - $resourceProvider
        - .setResponseType(type)

            设置响应类型

        - .setHeaders(headers)

            设置全局的请求头

        - .setWithCredentials(boolean)

            设置是否跨域

        - .setHosts(hosts)

            设置API地址

        - .setInterceptor(func)

            设置响应拦截器

    - $resource

        $resource服务就是$resource

- jQuery

    挂载到 $.fn.$resource 下

- window

    以上两个条件都不满足，则挂载在全局作用于下

### $resource的属性

####  responseType

设置响应类型，默认为:'',比如设置为json

```javascript
$resource.responseType='json';
```

可选的responseType
- ''
- 'text'
- 'arraybuffer'
- 'blob'
- 'document'
- 'json'

#### headers

设置全局的请求头，默认值:``{Accept: 'application/json, text/plain, text/html, */*'}``

```javascript
$resource.headers = {
  admin:true
}
```

#### withCredentials

设置是否跨域，默认值：false

```javascript
$resource.withCredentials = true;
```

#### hosts

设置接口的hosts地址，默认值：``window.location.host``

```javascript
$resource.hosts = 'localhost:8080';
```

#### interceptor

设置对response的拦截器

- response，不是纯粹的response，而是经过包装之后。结果与ngResource包装的基本一致

    [response的数据结构](#response的数据结构)

- $q，promise的[Q](https://github.com/kriskowal/q)库
- return
    - promise
        - 如果promise为``reject``，则调用的``then``为``reject``，``resolve``也一样
        - 如果带data``$q.resolve(data)``，则最后调用的结果就是data
    - boolean
        - 如果为true，则视为``resolve``，为false视为``reject``
        - data默认为response
        - ``return false`` 等效于 ``return $q.reject(response)``
        - ``return true`` 等效于 ``return $q.resolve(response)``
    - any
        - 结果既不是promise，也不是boolean
        - 一律视为``reject``，``reject``的data则为返回的值
        - ``return undefined`` 等效于 ``return $q.reject(undefined)``

```javascript
/**
* 默认拦截器
* @param response
* @param $q
* @returns {* | boolean | promise}
*/
$resource.interceptor = function(response, $q){
    if (!response || response.status >= 400 || !response.data) {
      return $q.reject();
    } else {
      return $q.resolve();
    }
}
```

#### transformHeaders

对请求头的转换器

这个是全局的，意味着，发出的每一个请求，含有头部信息，都会经过这个列表的函数变形

默认为空数组:[]

```javascript
/**
* 对请求头的数据，进行转换
* @param url          请求头
* @returns {*}        可以返回任意值，返回的值会经过下一轮的转换器转换，最后输出最终值
*/
var transform = function(headers){
  // 给所有 headers 添加 test = 'test' 
  headers.test = 'test';
  return headers
}
$resource.transformHeaders.push(transform)
````

#### q

$resource.q

返回通过``$resource.register(id,url,params,actions,options)``注册的api

### $utils

$resource.$utils

内部的工具集合


```javascript
var $utils = $resource.$utils;
console.log($utils);
{
  noop,
  isDefined,
  isUndefined,
  isArray,
  isDate,
  isBoolean,
  isElement,
  isNumber,
  isObject,
  isString,
  isFunction,
  isRegExp,
  isWindow,
  isFile,
  isBlob,
  isTypedArray,
  isArrayBuffer,
  equals,
  merge,
  extend,
  copy,
  forEach,
  fromJson,
  toJson
}
```

### $resource的方法

#### register

$resource.register(id,url,params,actions,options)

注册api，对$resource的一层包装

- ``id``:string
    - 必填，注册api的唯一标识符
- ``url``:string
    - 必填，api的url地址，为相对地址，比如``'/:path/:file.json'``
- ``params``:object
    - 绑定url中的通配符至传入到调用方法的params
- ``actions``:object
    - 自定义方法
    ```bash
    {action1: {method:?, params:?, isArray:?, headers:?, ...},
     action2: {method:?, params:?, isArray:?, headers:?, ...},
     ...}
    ```
    - 默认的actions
    ```javascript
    var defaultActions = {
      get: {method: 'GET'},
      query: {method: 'GET'},
      post: {method: 'POST'},
      save: {method: 'POST'},
      create: {method: 'POST'},
      put: {method: 'PUT'},
      update: {method: 'PUT'},
      fetch: {method: 'GET'},
      delete: {method: 'DELETE'},
      remove: {method: 'DELETE'},
      options: {method: 'OPTIONS'},
      head: {method: 'HEAD'},
      patch: {method: 'PATCH'},
      trace: {method: 'TRACE'},
      connect: {method: 'CONNECT'},
      move: {method: 'MOVE'},
      copy: {method: 'COPY'},
      link: {method: 'LINK'},
      unlink: {method: 'UNLINK'},
      wrapped: {method: 'WRAPPED'},
      'extension-mothed': {method: 'Extension-mothed'}
    }
    ```
- ``options``:object

    自定义配置，通过该api注册的所有方法，都通过这个配置，优先级低于actions

    - ``headers``:object
        - 设置请求头
    - ``interceptor``:function
        - 设置拦截器，通过这个api的方法，都使用这个拦截器
    - ``withCredentials``：boolean
        - 设置是否跨域
- ``return``：返回一个``new $resource(url,params,actions,options)``

#### $resource

new $resource(url,params,actions,options)

生成一个$resource实例

- url:与$resource.register一致
- params：与$resource.register一致
- actions：与$resource.register一致
- options：与$resource.register一致

- return
    > 返回一个内部的Http对象

##### $resource实例

$resource的实例为一个内部的Http对象

> 该Http对象的原型(prototype)包含了所有actions的方法，包括默认actions和自定义actions

> 例如``new $resource(url,params,actions,options).get().$promise.then();``

> 例如``new $resource(url,params,actions,options).post().$promise.then();``

> 例如``new $resource(url,params,actions,options).put().$promise.then();``

###### Http\[action\](params,config)

- action
    方法，如get，post，put...

- params
    参数，用于解析url地址，如果为post,put等方法，则会作为requestBody随着请求发送服务器

    例如： url:'/user/:uid'

    params:{uid:'testUser'}

    则会把地址解析成``'/user/testUser'``

- config
    配置项，与 $resource(url,params,actions,options) 中的 options一致

    属于临时配置项，临时配置当前调用的方法

#### $http

$resource的底层方法，每个$resource实例，都会调用$http

$resource.$http(config);

- **config**
    - url
    - method
    - headers
    - withCredentials
    - data
    - interceptor
    - timeout(尚未实现)
    - eventHandlers
    - cache(尚未实现)
    - responseType
- return
    - response.resource
        - $promise
        - $resolve
        - ...(response.data)

### response的数据结构

```javascript
var userApi = new $resource('/user/:uid',{uid:'@uid'});
userApi.get({user:'testUser'}).$promise
    .then(function(response){
      console.log(response);
    },function(response){
      console.error(response);
    });
```

**response**

- $$XHR：XMLHttpRequest
- config
    - cache:boolean,是否缓存
    - data:any,requestBody的数据
    - headers:object，请求头
    - method:string，请求方法
    - responseType:string，响应类型
    - url:string，请求的url地址
    - withCredentials:boolean，是否跨域
- data:any，真正的后台返回的数据
- headers:object
- resource
    - $promise:promise
    - $resolve:boolean
    - ...(response.data)
- status:number，状态码
- statusText:string，状态提示文本

### 例子

#### 获取一个json文件
```javascript
var getJson = $resource.register('getJson','/data/:file.json');
getJson.get({file:'demo'}).$promise
    .then(function(resp){
      var json = resp.data;
      console.log(json);
    },function(error){
      console.log(error);
    });
```
通过``new $resource()``的方法
```javascript
var getJson = new $resource('/data/:file.json');
getJson.get({file:'demo'}).$promise
    .then(function(resp){
      var json = resp.data;
      console.log(json);
    },function(error){
      console.log(error);
    });
```

#### 获取某个用户信息
```javascript
var getUser = $resource.register('userApi','/user/:uid');
getUser.get({uid:'testUser'}).$promise
    .then(function(resp){
      console.log(resp);
    },function(error){
      console.error(error);
    });
```

#### 自定义某个API的headers

```javascript
var getUser = $resource.register('userApi','/user/:uid',{uid:'@uid'},{},{
  headers:{
    auth:'test'
  }
});
getUser.get({uid:'1'}).$promise
    .then(function(resp){
      console.log(resp);
    },function(error){
      console.error(error);
    });
```

通过getUser调用的所有方法，请求头都会加上{auth:'test'},比如

```bash
getUser.get();
getUser.post();
getUser.put();
...
````

#### 指定某个action的请求头

```javascript
var getUser = $resource.register('userApi','/user/:uid',{uid:'@uid'},{
  // 自定义的actions
  info:{
    method:'GET',
    headers:{
      auth:'test'
    }
  }
});

// info方法，会添加请求头{auth:'test'}

getUser.info({uid:'1'}).$promise
    .then(function(resp){
      console.log(resp);
    },function(error){
      console.error(error);
    });
```


### 构建项目

```bash
git clone https://github.com/suboat/resource.git
cd resource
npm install
npm run build
```