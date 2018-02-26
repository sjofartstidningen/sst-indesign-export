import { join } from 'path';
import * as json from './json';

class ConfigStore {
  constructor({ name, version, defaultConfig = {} } = {}) {
    this.name = name;
    this.version = version;
    this.config = {};
    this.configFolder = join('~', '.config');
    this.configFile = join(
      this.configFolder,
      `${this.name}${version ? `@v${version}` : ''}.json`,
    );

    this.initializeStore(defaultConfig);
  }

  initializeStore = defaultConfig => {
    const configFolder = new Folder(this.configFolder);
    if (!configFolder.exists) configFolder.create();

    const configFile = new File(this.configFile);
    if (!configFile.exists) {
      this.writeConfig(defaultConfig);
      this.config = defaultConfig;
    } else {
      const config = this.readConfig();
      this.config = config;
    }
  };

  readConfig = () => {
    const configFile = new File(this.configFile);
    configFile.open('r');
    const content = configFile.read();
    return json.parse(content);
  };

  writeConfig = config => {
    const configFile = new File(this.configFile);
    configFile.open('w');
    configFile.encoding = 'UTF-8';
    configFile.lineFeed = 'Unix';
    configFile.writeln(json.stringify(config));
    configFile.close();
  };

  get = key => {
    const config = this.readConfig();
    if (!key) return config;

    return config[key];
  };

  set = (key, value) => {
    const config = this.readConfig();
    const newConfig = {
      ...config,
      [key]: value,
    };

    this.writeConfig(newConfig);
  };
}

export default ConfigStore;
