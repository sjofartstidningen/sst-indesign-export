/* eslint-disable */

if (!Number.isNaN) {
  Number.isNaN = isNaN;
}

if (!Number.parseInt) {
  Number.parseInt = parseInt;
}

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}
