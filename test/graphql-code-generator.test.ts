import fs from 'fs';
import { createTypesFromSchema } from '../src/graphql-code-generator';
import { getConfigFromFile } from '../src/config';
import { createSchemaFromSwagger } from '../src/swagger-to-graphql';

describe('graphql-code-generator.ts', () => {
  let swaggerPaths, schemaOutputFiles, typesOutputFiles;
  beforeAll(async () => {
    const config = await getConfigFromFile('test/good-graphql-from-swagger-1.config.json');
    swaggerPaths = config.swaggerPaths;
    schemaOutputFiles = config.schemaOutputFiles;
    typesOutputFiles = config.typesOutputFiles;
  });

  test('createTypesFromSchema', async () => {
    const schemas: string[] = await createSchemaFromSwagger(swaggerPaths, schemaOutputFiles);
    const types: string[] = await createTypesFromSchema(schemas, typesOutputFiles);
    const output = await fs.readFileSync('test/generated/types.txt', 'utf-8');
    expect(types).toStrictEqual([output]);
  });
})
