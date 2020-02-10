import fs from 'fs';
import { createRESTDataSource, createResolvers } from '../src/apollo-datasource-rest';
import { getConfigFromFile } from '../src/config';

describe('apollo-datasource-rest.ts', () => {
  let swaggerPaths, typesOutputFiles, restDataSourceOutputFiles, resolversOutputFiles;
  beforeAll(async () => {
    const config = await getConfigFromFile('test/good-graphql-from-swagger-1.config.json');
    swaggerPaths = config.swaggerPaths;
    typesOutputFiles = config.typesOutputFiles;
    restDataSourceOutputFiles = config.restDataSourceOutputFiles;
    resolversOutputFiles = config.resolversOutputFiles;
  });

  test('createRESTDataSource', async () => {
    const restDataSources: string[] = await createRESTDataSource(swaggerPaths, typesOutputFiles, restDataSourceOutputFiles);
    const output = await fs.readFileSync('test/generated/Api.txt', 'utf-8');
    expect(restDataSources).toStrictEqual([output]);
  });

  test('createResolvers', async () => {
    const resolvers: string[] = await createResolvers(swaggerPaths, typesOutputFiles, restDataSourceOutputFiles, resolversOutputFiles);
    const output = await fs.readFileSync('test/generated/resolvers.txt', 'utf-8');
    expect(resolvers).toStrictEqual([output]);
  });
})
