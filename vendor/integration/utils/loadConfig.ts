import files from 'node:fs';
import yaml from 'js-yaml';

const loadConfig = async (configPathOrData: string | object) => {
  if (typeof configPathOrData === 'string') {
    const content = files.readFileSync(configPathOrData, 'utf8');
    if (configPathOrData.endsWith('.yaml') || configPathOrData.endsWith('.yml')) {
      return yaml.load(content);
    }
    return content;
  }

  return configPathOrData;
};

export default loadConfig;
