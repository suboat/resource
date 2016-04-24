## 基于原生XMLHTTPRequest,ES6语法编写，符合restful接口的http库

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
require('resource');
```

## $resource对象

整包输出$resource对象

### $resource的属性

- .responseType

> 设置响应类型，默认为:'',比如设置为json

```javascript
$resource.responseType='json';
```

- .headers

> 设置全局的请求头，默认值:{}

```javascript
$resource.headers = {
  admin:true
}
```

- .withCredentials

> 设置是否跨域，默认值：false

```javascript
$resource.withCredentials = true;
```

- .hosts

> 设置接口的hosts地址，默认值：``window.location.host``

```javascript
$resource.hosts = 'localhost:8080';
```

- .interceptor
    - response，不是纯粹的response，而是经过包装之后。结果与ngResource包装的基本一致
    - $q，promise的[Q](https://github.com/kriskowal/q)库
    - return
        - promise
            - 如果promise的``reject``，则调用的``then``为``reject``，``resolve``也一样
            - 如果带data``$q.resolve(data)``，则最后调用的结果就是data
        - boolean
            - 如果为true，则视为``resolve``，为false视为``reject``
            - data默认为response
        - any
            - 结果既不是promise，也不是boolean
            - 一律视为``reject``，``reject``的data则为返回的值
            - ``return undefined`` 等效于 ``return $q.reject(undefined)``

> 设置对response的拦截器

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

### $resource的方法

- .register(id,url,params,actions,options)
    > 注册api，对$resource的一层包装
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
        > 自定义配置，通过该api注册的所有方法，都通过这个配置，优先级低于actions
        - ``headers``:object
            - 设置请求头
        - ``interceptor``:function
             TODO
            - 设置拦截器，通过这个api的方法，都使用这个拦截器
        - ``withCredentials``：boolean
            - TODO
            - 设置是否跨域
    - ``return``：返回一个``new $resource(url,params,actions,options)``

- $resource(url,params,actions,options)
    > 生成一个$resource实例
    - url:与$resource.register一致
    - params：与$resource.register一致
    - actions：与$resource.register一致
    - options：与$resource.register一致
    - return
        > 返回一个内部的Http对象
        > 该Http对象的原型(prototype)包含了所有actions的方法，包括默认actions和自定义actions
        > 例如``new $resource(url,params,actions,options).get().$promise.then();``
        > 例如``new $resource(url,params,actions,options).post().$promise.then();``
        > 例如``new $resource(url,params,actions,options).put().$promise.then();``
### 例子

- 获取一个json文件
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

- 获取某个用户信息
```javascript
var getUser = $resource.register('userApi','/user/:uid');
getUser.get({uid:'1'}).$promise
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