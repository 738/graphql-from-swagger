import fs from 'fs';
import { createSchemaFromSwagger } from '../src/swagger-to-graphql';
import { getConfigFromFile } from '../src/config';

describe('swagger-to-graphql.ts', () => {
  let swaggerPaths, schemaOutputFiles;
  beforeAll(async () => {
    const config = await getConfigFromFile('test/good-graphql-from-swagger-1.config.json');
    swaggerPaths = config.swaggerPaths;
    schemaOutputFiles = config.schemaOutputFiles;
  });

  test('createSchemaFromSwagger', async () => {
    const schemas: string[] = await createSchemaFromSwagger(swaggerPaths, schemaOutputFiles);
    const output = await fs.readFileSync('test/generated/schema.txt', 'utf-8');
    expect(schemas).toStrictEqual([output]);
  });
})
