const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const { promisify } = require('util');
const pkg = require('../package.json');

const writeFile = promisify(fs.writeFile);
const exec = promisify(cp.exec);

async function prepare(pluginConfig, { nextRelease: { version }, logger }) {
  const newPkg = Object.assign({}, pkg, { version });
  const content = JSON.stringify(newPkg, null, 2);
  await writeFile(path.join(__dirname, '../package.json'), content, 'utf8');

  logger.log(`Wrote version ${version} to package.json`);
  logger.log(`Will rebuild project`);

  await exec('yarn run build');
  logger.log('Rebuilt project');
}

module.exports = { prepare };
