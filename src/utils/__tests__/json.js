import * as json from '../json';

describe('util.json', () => {
  test('should be abel to parse a json object', () => {
    const jsonObject = `{
      "hello": "world",
      "foo": 1,
      "bar": "baz"
    }`;

    expect(json.parse(jsonObject)).toEqual({
      hello: 'world',
      foo: 1,
      bar: 'baz',
    });
  });

  test('should be able to stringify a object into json', () => {
    const obj = {
      hello: 'world',
      foo: 1,
      bar: 'baz',
      null: null,
    };

    expect(json.stringify(obj)).toBe(
      '{"hello": "world", "foo": 1, "bar": "baz", "null": null}',
    );
  });
});
