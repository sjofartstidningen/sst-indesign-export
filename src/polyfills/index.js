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
