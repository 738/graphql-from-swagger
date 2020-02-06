import fs from 'fs';
import path from 'path';
import pkgDir from 'pkg-dir';

const CONFIG_FILE_NAME = 'graphql-from-swagger.config.json';

export async function getConfigFromFile() {
  const rootDir = await pkgDir(__dirname);
  const data = await fs.readFileSync(path.join(rootDir as string, CONFIG_FILE_NAME), 'utf-8');
  const configJSON = JSON.parse(data);
  return configJSON;
}
