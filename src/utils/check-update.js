import { join } from 'path';
import { parse } from './json';
import { map, find, includes } from './index';
import i18n from './i18n';
import pkg from '../../package.json';

const parseVersion = v =>
  map(n => Number.parseInt(n, 10), v.replace(/\D/g, '').split(''));

const versionGreaterThan = (v1, v2) => {
  const parsedV1 = parseVersion(v1);
  const parsedV2 = parseVersion(v2);

  for (let i = 0; i < parsedV1.length; i += 1) {
    if (parsedV1[i] < parsedV2[i]) return false;
  }

  return true;
};

const actionWindow = ({ name, label, action }) => {
  const window = new Window('dialog', name, undefined, {
    independent: true,
  });

  const labelGroup = window.add('group');
  labelGroup.alignment = 'left';
  labelGroup.add('statictext', undefined, label);

  const buttonGroup = window.add('group');
  buttonGroup.alignment = 'right';

  const downloadBtn = buttonGroup.add(
    'button',
    undefined,
    i18n('Download update'),
  );
  buttonGroup.add('button', undefined, i18n('Cancel'), { name: 'cancel' });

  downloadBtn.addEventListener('click', () => {
    window.close();
    action();
  });

  return window.show();
};

function downloadAsset({ url, name }) {
  const headers = `-H 'Accept: application/octet-stream' -H 'User-Agent: ${
    pkg.name
  }/${pkg.version}'`;
  const cmd = `curl ${headers} '${url}' -L`;

  const response = app.doScript(
    'return do shell script item 1 of arguments',
    ScriptLanguage.applescriptLanguage,
    [cmd],
  );

  const scriptsFolder = File($.fileName)
    .parent.fsName.toString()
    .replace(/\\/g, '/');
  const newScript = new File(join(scriptsFolder, name));

  newScript.open('w', undefined, undefined);
  newScript.encoding = 'UTF-8';
  newScript.lineFeed = 'Unix';
  newScript.writeln(response);
  newScript.close();
}

function checkForUpdate(store) {
  const lastCheck = store.get('lastUpdateCheck') || 0;
  const currentDate = Date.now();

  const shouldCheck = currentDate - lastCheck > 1000 * 60 * 60 * 24 * 30;
  if (!shouldCheck) return;

  const [, owner, repo] = /\/(\w+)\/((?:\d|\w|-)+)\.git$/.exec(pkg.repository);

  const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
  const headers = `-H 'User-Agent: ${pkg.name}/${pkg.version}'`;
  const cmd = `curl ${headers} '${githubApiUrl}'`;

  const response = app.doScript(
    'return do shell script item 1 of arguments',
    ScriptLanguage.applescriptLanguage,
    [cmd],
  );

  const { name, assets } = parse(response);

  const shouldUpdate = versionGreaterThan(name, pkg.version);
  const asset = find(x => includes(pkg.name, x.name), assets);

  if (shouldUpdate && asset) {
    const result = actionWindow({
      name: i18n('Update available'),
      label: i18n(
        'A new version of this script is available, would you like to download it?',
      ),
      action: () => downloadAsset(asset),
    });

    if (result !== 2) {
      alert(
        i18n(
          'New script downloaded\nRemember to remove the old version and update any keyboard shortcuts created',
        ),
      );
    }
  }

  store.set('lastUpdateCheck', currentDate);
}

export { checkForUpdate as default, versionGreaterThan };
