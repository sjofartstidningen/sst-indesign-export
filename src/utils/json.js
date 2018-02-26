const parse = sJSON => eval('(' + sJSON + ')'); // eslint-disable-line
const stringify = (() => {
  const { toString, hasOwnProperty } = Object.prototype;
  const { isArray } = Array;

  const escMap = {
    '"': '\\"',
    '\\': '\\\\',
    '\b': '\\b',
    '\f': '\\f',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
  };

  const escFunc = m =>
    escMap[m] || `\\u${(m.charCodeAt(0) + 0x10000).toString(16).substr(1)}`;

  const escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;

  return value => {
    if (value == null) {
      return 'null';
    } else if (typeof value === 'number') {
      return isFinite(value) ? value.toString() : 'null'; // eslint-disable-line
    } else if (typeof value === 'boolean') {
      return value.toString();
    } else if (typeof value === 'object') {
      if (typeof value.toJSON === 'function') {
        return stringify(value.toJSON());
      } else if (isArray(value)) {
        let res = '[';
        for (let i = 0; i < value.length; i += 1)
          res += (i ? ', ' : '') + stringify(value[i]);
        return `${res}]`;
      } else if (toString.call(value) === '[object Object]') {
        const tmp = [];
        // eslint-disable-next-line
        for (let k in value) {
          if (hasOwnProperty.call(value, k))
            tmp.push(`${stringify(k)}: ${stringify(value[k])}`);
        }
        return `{${tmp.join(', ')}}`;
      }
    }
    return `"${value.toString().replace(escRE, escFunc)}"`;
  };
})();

export { parse, stringify };
