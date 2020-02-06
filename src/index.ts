import { createSchemaFromSwagger } from './swagger-to-graphql';
import { createTypesFromSchema } from './graphql-code-generator';
import { createRESTDataSource, createResolvers } from './apollo-datasource-rest';

// TODO: 설정 파일에서 설정한 파일 경로들 읽기
const swaggerPaths: Array<string> = ['../test/swagger.json'];
const schemaOutputFiles: Array<string> = ['../generated/schema1.graphql'];
const typesOutputFiles: Array<string> = ['../generated/types1.ts'];

const restDataSourceOutputFiles: Array<string> = ['../generated/HeroesApi.ts'];
const resolversOutputFiles: Array<string> = ['../generated/heroesResolvers.ts'];

(async () => {
  const schemas = await createSchemaFromSwagger(swaggerPaths, schemaOutputFiles);
  await createTypesFromSchema(schemas, typesOutputFiles);
  await createRESTDataSource(swaggerPaths, typesOutputFiles, restDataSourceOutputFiles);
  await createResolvers(swaggerPaths, typesOutputFiles, restDataSourceOutputFiles, resolversOutputFiles);
})();
