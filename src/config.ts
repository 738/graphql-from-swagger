import fs from 'fs';
import path from 'path';

const DEFAULT_CONFIG_FILE_NAME = 'graphql-from-swagger.config.json';

export interface Config {
  swaggerPaths: Array<string>;
  schemaOutputFiles: Array<string>;
  typesOutputFiles: Array<string>;
  restDataSourceOutputFiles: Array<string>;
  resolversOutputFiles: Array<string>;
  [key: string]: string | Array<string>;
}

export async function getConfigFromFile(configName = DEFAULT_CONFIG_FILE_NAME): Promise<Config> {
  const currentDir = process.cwd();
  const data = await fs.readFileSync(path.join(currentDir, configName), 'utf-8');
  const configJSON: Config = JSON.parse(data);
  validateConfig(configJSON);
  return configJSON;
}

export function validateConfig(config: Config) {
  if (config.swaggerPaths === undefined) throw new Error('swaggerPaths does not exist in config!');
  const totalLength = config.swaggerPaths.length;

  if (Object.keys(config).some((key: string) => config[key].length !== totalLength))
    throw new Error('The numbers of files are not matched!');

  if (!instanceOfConfig(config)) {
    throw new Error('Invalid Config!');
  }
  
  return;
}

export function instanceOfConfig(config: any): config is Config {
  return config.swaggerPaths !== undefined
      && config.schemaOutputFiles !== undefined
      && config.typesOutputFiles !== undefined
      && config.restDataSourceOutputFiles !== undefined
      && config.resolversOutputFiles !== undefined;
}
