import { GraphQLSchema, printSchema } from 'graphql';
import createSchema, { CallBackendArguments } from 'swagger-to-graphql';
import fs from 'fs';
import path from 'path';

async function callBackend({
  context,
  requestOptions
}: CallBackendArguments<Request>) {
  return 'Not implemented';
}

export async function createSchemaFromSwagger(
  swaggerPaths: Array<string>,
  schemaOutputFiles: Array<string>
): Promise<Array<GraphQLSchema>> {
  const schemas: Array<GraphQLSchema> = [];
  for (let i = 0; i < swaggerPaths.length; i++) {
    const schema: GraphQLSchema = await createSchema({
      swaggerSchema: swaggerPaths[i],
      callBackend
    });
    await fs.writeFileSync(
      path.join(__dirname, schemaOutputFiles[i]),
      printSchema(schema)
    );
    console.log('schema outputs generated!');
    // TODO: 스키마 각 파일에 쓰기
    schemas.push(schema);
  }
  return schemas;
}
