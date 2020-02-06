import { GraphQLSchema, printSchema } from 'graphql';
import createSchema, { CallBackendArguments } from 'swagger-to-graphql';
import fs from 'fs';
import path from 'path';
import { checkUrlForm } from './utils';

async function callBackend({ context, requestOptions }: CallBackendArguments<Request>) {
  return 'Not implemented';
}

export async function createSchemaFromSwagger(swaggerPaths: Array<string>, schemaOutputFiles: Array<string>): Promise<Array<GraphQLSchema>> {
  if (swaggerPaths.length !== schemaOutputFiles.length) throw new Error('The numbers of swaggerPaths and schemaOutputFiles are not matched!');
  const currentDir = process.cwd();

  const schemas: Array<GraphQLSchema> = [];
  for (let i = 0; i < swaggerPaths.length; i++) {
    const schema: GraphQLSchema = await createSchema({
      swaggerSchema: checkUrlForm(swaggerPaths[i]) ? swaggerPaths[i] : path.join(currentDir, swaggerPaths[i]),
      callBackend
    });
    await fs.writeFileSync(path.join(currentDir, schemaOutputFiles[i]), printSchema(schema));
    console.log(`GraphQL Schema file (${path.join(currentDir, schemaOutputFiles[i])}) was generated!`);
    schemas.push(schema);
  }

  return schemas;
}
