import { instanceOfConfig, validateConfig, getConfigFromFile } from '../src/config';

describe('config.ts', () => {
  const GOOD_CONFIG_1 = JSON.parse(`{
    "swaggerPaths": ["example/swagger.json"],
    "schemaOutputFiles": ["example/schema.graphql"],
    "typesOutputFiles": ["example/types.ts"],
    "restDataSourceOutputFiles": ["example/Api.ts"],
    "resolversOutputFiles": ["example/resolvers.ts"]
  }`);

  const GOOD_CONFIG_2 = JSON.parse(`{
    "swaggerPaths": ["example/swagger.json", "a.json"],
    "schemaOutputFiles": ["example/schema.graphql", "b.graphql"],
    "typesOutputFiles": ["example/types.ts", "c.ts"],
    "restDataSourceOutputFiles": ["example/Api.ts", "d.ts"],
    "resolversOutputFiles": ["example/resolvers.ts", "e.ts"]
  }`);

  const BAD_CONFIG_1 = JSON.parse(`{
    "swaggerPath": ["example/swagger.json"],
    "schemaOutputFiles": ["example/schema.graphql"],
    "typesOutputFiles": ["example/types.ts"],
    "restDataSourceOutputFiles": ["example/Api.ts"],
    "resolversOutputFiles": ["example/resolvers.ts"]
  }`);

  const BAD_CONFIG_2 = JSON.parse(`{
    "swaggerPaths": ["example/swagger.json"],
    "schemaOutputFil": ["example/schema.graphql"],
    "typesOutputFil": ["example/types.ts"],
    "restDataSourceOutputFiles": ["example/Api.ts"],
    "resolversOutputFiles": ["example/resolvers.ts"]
  }`);

  const BAD_CONFIG_3 = JSON.parse(`{
    "swaggerPaths": ["example/swagger.json", "a.json"],
    "schemaOutputFiles": ["example/schema.graphql", "a.graphql"],
    "typesOutputFiles": ["example/types.ts"],
    "restDataSourceOutputFiles": ["example/Api.ts"],
    "resolversOutputFiles": ["example/resolvers.ts"]
  }`);

  test('instanceOfConfig', () => {
    expect(instanceOfConfig(GOOD_CONFIG_1)).toBe(true);
    expect(instanceOfConfig(BAD_CONFIG_1)).toBe(false);
    expect(instanceOfConfig(BAD_CONFIG_2)).toBe(false);
  });

  test('validateConfig', () => {
    expect(validateConfig(GOOD_CONFIG_1)).toBeUndefined();
    try {
      validateConfig(BAD_CONFIG_1);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
    try {
      validateConfig(BAD_CONFIG_2);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
    try {
      validateConfig(BAD_CONFIG_3);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  test('getConfigFromFile', async () => {
    expect(await getConfigFromFile('test/good-graphql-from-swagger-1.config.json')).toStrictEqual(GOOD_CONFIG_1);
    expect(await getConfigFromFile('test/good-graphql-from-swagger-2.config.json')).toStrictEqual(GOOD_CONFIG_2);
    try {
      expect(await getConfigFromFile('test/bad-graphql-from-swagger-1.config.json')).toStrictEqual(BAD_CONFIG_1);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
    try {
      expect(await getConfigFromFile('test/bad-graphql-from-swagger-2.config.json')).toStrictEqual(BAD_CONFIG_2);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
    try {
      expect(await getConfigFromFile('test/bad-graphql-from-swagger-3.config.json')).toStrictEqual(BAD_CONFIG_3);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});
