import { createSchemaFromSwagger } from './swagger-to-graphql';
import { createTypesFromSchema } from './graphql-code-generator';
import { createRESTDataSource, createResolvers } from './apollo-datasource-rest';
import { getConfigFromFile } from './config';

export async function cli() {
  const { swaggerPaths, schemaOutputFiles, typesOutputFiles, restDataSourceOutputFiles, resolversOutputFiles } = await getConfigFromFile();

  const schemas = await createSchemaFromSwagger(swaggerPaths, schemaOutputFiles);
  await createTypesFromSchema(schemas, typesOutputFiles);
  await createRESTDataSource(swaggerPaths, typesOutputFiles, restDataSourceOutputFiles);
  await createResolvers(swaggerPaths, typesOutputFiles, restDataSourceOutputFiles, resolversOutputFiles);
}
