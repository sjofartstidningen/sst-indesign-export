import * as utils from '../';

describe('utils.parseRange', () => {
  test('should parse a string input to a range', () => {
    expect(utils.parseRange('1-5')).toEqual([1, 2, 3, 4, 5]);
    expect(utils.parseRange('1,3-5')).toEqual([1, 3, 4, 5]);
    expect(utils.parseRange('1,6,3-5')).toEqual([1, 3, 4, 5, 6]);
    expect(utils.parseRange('1,3,5')).toEqual([1, 3, 5]);
    expect(utils.parseRange('1')).toEqual([1]);
    expect(() => utils.parseRange('2-1')).toThrow(Error);
    expect(() => utils.parseRange('a-b')).toThrow(Error);
    expect(() => utils.parseRange('foo')).toThrow(Error);
    expect(() => utils.parseRange('1-c')).toThrow(Error);
  });
});

describe('utils.every', () => {
  test('should test whether every iten in array pass the test', () => {
    const isAbove0 = n => n > 0;
    expect(utils.every(isAbove0, [1, 2, 3, 4])).toBeTruthy();
    expect(utils.every(isAbove0, [-1, 2, 3, 4])).toBeFalsy();
    expect(utils.every(isAbove0, [-1, -2, -3, -4])).toBeFalsy();
  });
});

describe('utils.some', () => {
  test('should test whether some iten in array pass the test', () => {
    const isAbove0 = n => n > 0;
    expect(utils.some(isAbove0, [1, 2, 3, 4])).toBeTruthy();
    expect(utils.some(isAbove0, [-1, -2, -3, 4])).toBeTruthy();
    expect(utils.some(isAbove0, [-1, -2, -3, -4])).toBeFalsy();
  });
});

describe('utils.findIndex', () => {
  test('should return the index when a match occurs', () => {
    const isFoo = n => n === 'foo';
    expect(utils.findIndex(isFoo, ['foo', 'bar', 'baz'])).toBe(0);
    expect(utils.findIndex(isFoo, ['bar', 'baz'])).toBe(-1);
    expect(utils.findIndex(isFoo, ['bar', 'baz', 'foo'])).toBe(2);
  });
});

describe('utils.padStart', () => {
  test('Should pad a string to the start', () => {
    expect(utils.padStart(3, '0', '1')).toBe('001');
    expect(utils.padStart(3, '0', 1)).toBe('001');
    expect(utils.padStart(3, null, 'foo')).toBe('foo');
    expect(utils.padStart(3, null, 'fooo')).toBe('fooo');
  });
});
