const range = (from, to) => {
  const too = to + 1;
  if (from > to) {
    throw new Error(
      `From (${from}) must be greater than or equal to to (${to})`,
    );
  }

  const len = too - from;

  const arr = Array(len);
  let idx = 0;

  while (idx + from < too) {
    arr[idx] = idx + from;
    idx += 1;
  }

  return arr;
};

const forEach = (fn, arr) => {
  if (Array.prototype.forEach) arr.forEach(fn);

  let idx = 0;
  const len = arr.length;

  while (idx < len) {
    fn(arr[idx]);
    idx += 1;
  }
};

const reduce = (fn, init, arr) => {
  if (Array.prototype.reduce) return arr.reduce(fn, init);

  let idx = 0;
  let accumulator = init;
  const len = arr.length;

  while (idx < len) {
    accumulator = fn(accumulator, arr[idx]);
    idx += 1;
  }

  return accumulator;
};

const map = (fn, arr) => {
  if (Array.prototype.map) return arr.map(fn);
  return reduce((acc, item) => acc.concat(fn(item)), [], arr);
};

const filter = (pred, arr) =>
  reduce(
    (acc, item) => {
      if (pred(item)) return acc.concat(item);
      return acc;
    },
    [],
    arr,
  );

const every = (predicate, arr) =>
  reduce(
    (acc, item) => {
      const isTrue = predicate(item);
      if (isTrue) return acc;
      return false;
    },
    true,
    arr,
  );

const some = (predicate, arr) =>
  reduce(
    (acc, item) => {
      const isTrue = predicate(item);
      if (isTrue) return true;
      return acc;
    },
    false,
    arr,
  );

const findIndex = (predicate, arr) => {
  const len = arr.length;
  let i = 0;
  while (i < len) {
    if (predicate(arr[i])) return i;
    i += 1;
  }

  return -1;
};

const pipe = (init, ...fns) => reduce((f, g) => x => g(f(x)), init, fns);

const toNumber = str => Number(str);

const clamp = (min, max, n) => {
  if (n < min) return min;
  if (n > max) return max;
  return n;
};

const padStart = (length, fill = ' ', str) => {
  let newStr = `${str}`;
  const strLen = newStr.length;
  if (strLen >= length) return str;

  while (newStr.length < length) {
    newStr = `${fill}${newStr}`;
  }

  return newStr;
};

/**
 * Parse a range formatted input (eg. "1,3,6-10") to an array of numbers
 *
 * @param {String} str
 * @returns {Array<Number>}
 */
const parseRange = str => {
  try {
    const cleanedInput = str.replace(/\s+/g, '');
    const separateInputs = cleanedInput.split(',');

    const unsortedRange = reduce(
      (acc, input) => {
        const val = toNumber(input);
        if (!Number.isNaN(val)) return acc.concat(val);

        const [from, to] = map(toNumber, input.split('-'));
        const r = range(from, to);

        return acc.concat(r);
      },
      [],
      separateInputs,
    );

    return unsortedRange.sort((a, b) => {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });
  } catch (err) {
    throw err;
  }
};

export {
  range,
  forEach,
  reduce,
  map,
  filter,
  every,
  some,
  findIndex,
  pipe,
  toNumber,
  clamp,
  padStart,
  parseRange,
};
