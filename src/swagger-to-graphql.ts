import { GraphQLSchema, printSchema } from 'graphql';
import createSchema, { CallBackendArguments } from 'swagger-to-graphql';
import path from 'path';
import { checkUrlForm } from './utils';

async function callBackend({ context, requestOptions }: CallBackendArguments<Request>) {
  return 'Not implemented';
}

export async function createSchemaFromSwagger(swaggerPaths: Array<string>, schemaOutputFiles: Array<string>): Promise<Array<string>> {
  if (swaggerPaths.length !== schemaOutputFiles.length) throw new Error('The numbers of swaggerPaths and schemaOutputFiles are not matched!');
  const currentDir = process.cwd();

  const schemas: Array<string> = [];
  for (let i = 0; i < swaggerPaths.length; i++) {
    const schema: GraphQLSchema = await createSchema({
      swaggerSchema: checkUrlForm(swaggerPaths[i]) ? swaggerPaths[i] : path.join(currentDir, swaggerPaths[i]),
      callBackend
    });
    schemas.push(printSchema(schema));
  }

  return schemas;
}
