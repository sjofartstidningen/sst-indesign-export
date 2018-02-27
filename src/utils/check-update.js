import { join } from 'path';
import { parse } from './json';
import { map, find, includes } from './index';
import i18n from './i18n';
import errors from './errors';
import pkg from '../../package.json';

/**
 * Parse a version string (e.g. v1.0.0) into an array of [major, minor, patch]
 *
 * @param {String}  v  Semver string
 */
const parseVersion = v =>
  map(n => Number.parseInt(n, 10), v.replace(/\D/g, '').split(''));

/**
 * Check if a version is greater than another version, accepting two strings.
 *
 * The strings can contain additional chars (e.g. "v" or anything else) as long
 * as three numbers can be extracted. Return true if v1 is greater than v2.
 *
 * Otherwise it will return false.
 *
 * @param {String}  v1  Semver string
 * @param {String}  v2  Semver string
 * @returns boolean
 */
const versionGreaterThan = (v1, v2) => {
  const ver1 = parseVersion(v1);
  const ver2 = parseVersion(v2);

  for (let i = 0; i < 3; i += 1) {
    const n1 = ver1[i];
    const n2 = ver2[i];

    if (n1 > n2) return true;
    if (n2 > n1) return false;

    if (!Number.isNaN(n1) && Number.isNaN(n2)) return true;
    if (Number.isNaN(n1) && !Number.isNaN(n2)) return false;
  }

  return false;
};

/**
 * Create a window with an actionable button.
 *
 * @param {Object}   config
 * @param {String}   config.name         Name of window
 * @param {String}   config.label        Label text
 * @param {String}   config.actionButton Button label text
 * @param {Function} config.action       Action to take on click
 * @returns Number? Returns 2 if user clicks cancel, otherwis undefined
 */
const actionWindow = ({ name, label, actionButton, action }) => {
  const window = new Window('dialog', name, undefined, {
    independent: true,
  });

  const labelGroup = window.add('group');
  labelGroup.alignment = 'left';
  labelGroup.add('statictext', undefined, label);

  const buttonGroup = window.add('group');
  buttonGroup.alignment = 'right';

  const downloadBtn = buttonGroup.add('button', undefined, actionButton);
  buttonGroup.add('button', undefined, i18n('Cancel'), { name: 'cancel' });

  downloadBtn.addEventListener('click', () => {
    window.close();
    action();
  });

  return window.show();
};

/**
 * Download an asset from github and place it at the same location as the
 * current running script.
 *
 * @param {Object} asset
 * @param {String} asset.url  Url to download asset from github
 * @param {String} asset.name Name of the file to write to
 */
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

/**
 * This function will check if an update is available at the moment.
 * The check will only occur once a month.
 *
 * The store param should have the methods "get" and "set" to retrieve and
 * define configurations. It is used to see when the last check for an update
 * was made, and also update it once a check was mad succesfully.
 *
 * @param {ConfigStore} store ConfigStore instance
 * @returns undefined
 */
function checkForUpdate(store) {
  /**
   * Check if an update has been made the last month.
   * If so, return early to avoid unneccesary http requests.
   */
  const lastCheck = store.get('lastUpdateCheck') || 0;
  const currentDate = Date.now();

  const shouldCheck = currentDate - lastCheck > 1000 * 60 * 60 * 24 * 30;
  if (!shouldCheck) return;

  try {
    const [, owner, repo] = /\/(\w+)\/((?:\d|\w|-)+)\.git$/.exec(
      pkg.repository,
    );

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
        actionButton: i18n('Download update'),
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
  } catch (err) {
    store.set('lastUpdateCheck', currentDate);
    throw new Error(errors.checkUpdate);
  }
}

export { checkForUpdate as default, versionGreaterThan };
