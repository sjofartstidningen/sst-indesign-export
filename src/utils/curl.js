import pkg from '../../package.json';

const defaultHeaders = {
  'User-Agent': `${pkg.name}/${pkg.version}`,
};

function curl(url, { headers = {} } = {}) {
  const mergedHeaders = Object.entries({
    ...defaultHeaders,
    ...headers,
  })
    .map(([key, value]) => `-H '${key}: ${value}'`)
    .join(' ');

  const command = `curl ${mergedHeaders} ${url} -L`;
  const response = app.doScript(
    'return do shell script item 1 of arguments',
    ScriptLanguage.applescriptLanguage,
    [command],
  );

  return response;
}

export { curl as default };
