import fs from 'fs';
import path from 'path';

const CONFIG_FILE_NAME = 'graphql-from-swagger.config.json';

export async function getConfigFromFile() {
  const currentDir = process.cwd();
  const data = await fs.readFileSync(path.join(currentDir, CONFIG_FILE_NAME), 'utf-8');
  const configJSON = JSON.parse(data);
  return configJSON;
}
