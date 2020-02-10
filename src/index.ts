import { createSchemaFromSwagger } from './swagger-to-graphql';
import { createTypesFromSchema } from './graphql-code-generator';
import { createRESTDataSource, createResolvers } from './apollo-datasource-rest';
import { getConfigFromFile } from './config';
import { writeFiles } from './utils';

export async function cli() {
  const { swaggerPaths, schemaOutputFiles, typesOutputFiles, restDataSourceOutputFiles, resolversOutputFiles } = await getConfigFromFile();

  const schemas: string[] = await createSchemaFromSwagger(swaggerPaths, schemaOutputFiles);
  const types: string[] = await createTypesFromSchema(schemas, typesOutputFiles);
  const restDataSources: string[] = await createRESTDataSource(swaggerPaths, typesOutputFiles, restDataSourceOutputFiles);
  const resolvers: string[] = await createResolvers(swaggerPaths, typesOutputFiles, restDataSourceOutputFiles, resolversOutputFiles);

  writeFiles(schemaOutputFiles, schemas);
  writeFiles(typesOutputFiles, types);
  writeFiles(restDataSourceOutputFiles, restDataSources);
  writeFiles(resolversOutputFiles, resolvers);
}
