/**
 * Created by axetroy on 16-4-27.
 */

let GLOBAL = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;

module.exports = GLOBAL;
