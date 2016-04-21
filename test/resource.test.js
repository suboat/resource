/**
 * Created by axetroy on 16-4-20.
 */
var expect = require('chai').expect;

var $resource = require('../src/$resource');

describe('resource的url解析', function () {


  it('/api/user/:method', function () {
    var case1 = $resource.parseParams('/api/user/:method', {method: 'login'});
    var case2 = $resource.parseParams('/api/user/:method', {method: 'register'});

    expect(case1).to.be.deep.equal('/api/user/login');

    expect(case2).to.be.deep.equal('/api/user/register');


  });

  it('/api/user/:method/?from=:from', function () {
    var case1 = $resource.parseParams('/api/user/:method/?from=:from', {method: 'login', from: 'admin'});

    expect(case1).to.be.deep.equal('/api/user/login/?from=admin');

  });

  it('/api/user/:uid', function () {
    var case1 = $resource.parseParams('/api/user/:uid', {uid: '33123'});

    expect(case1).to.be.deep.equal('/api/user/33123');

  });

  it('/api/user/?uid=:uid', function () {
    var case1 = $resource.parseParams('/api/user/?uid=:uid', {uid: '33123'});

    expect(case1).to.be.deep.equal('/api/user/?uid=33123');

  });

});
