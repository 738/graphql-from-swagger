import { createSchemaFromSwagger } from './swagger-to-graphql';
import { createTypesFromSchema } from './graphql-code-generator';

// TODO: 설정 파일에서 swagger 파일 읽기
const swaggerPaths: Array<string> = [`./test/swagger.json`];
const schemaOutputFiles: Array<string> = [`../generated/schema1.graphql`];
const typesOutputFiles: Array<string> = ['../generated/types1.ts'];

(async () => {
  const schemas = await createSchemaFromSwagger(swaggerPaths, schemaOutputFiles);
  await createTypesFromSchema(schemas, typesOutputFiles);
})();
