/**
 * Created by axetroy on 16-4-24.
 */

let $utils = require('./$utils');
let CONFIG = require('./$resource.config');

let defaultActions = {
  get: {
    method: 'GET',
    url: '',
    params: {},
    isArray: false,
    transformRequest: $utils.noop,
    transformResponse: $utils.noop,
    cache: false,
    timeout: null,
    cancellable: false,
    withCredentials: CONFIG.withCredentials,
    responseType: '',
    interceptor: null
  },
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
};

let defaultOptions = {
  cache: false,
  timeout: null
};

class $common {
  constructor() {

  };

  static get defaultActions() {
    return defaultActions;
  };

  static get defaultOptions() {
    return defaultOptions;
  };

}

module.exports = $common;