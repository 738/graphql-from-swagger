import { GraphQLSchema, printSchema } from 'graphql';
import createSchema, { CallBackendArguments } from 'swagger-to-graphql';
import fs from 'fs';
import path from 'path';
import pkgDir from 'pkg-dir';

async function callBackend({ context, requestOptions }: CallBackendArguments<Request>) {
  return 'Not implemented';
}

export async function createSchemaFromSwagger(swaggerPaths: Array<string>, schemaOutputFiles: Array<string>): Promise<Array<GraphQLSchema>> {
  if (swaggerPaths.length !== schemaOutputFiles.length) throw new Error('The numbers of swaggerPaths and schemaOutputFiles are not matched!');
  const rootDir = await pkgDir(__dirname);

  const schemas: Array<GraphQLSchema> = [];
  for (let i = 0; i < swaggerPaths.length; i++) {
    const schema: GraphQLSchema = await createSchema({
      swaggerSchema: path.join(rootDir as string, swaggerPaths[i]),
      callBackend
    });
    await fs.writeFileSync(path.join(rootDir as string, schemaOutputFiles[i]), printSchema(schema));
    console.log('schema outputs generated!');
    // TODO: 스키마 각 파일에 쓰기
    schemas.push(schema);
  }

  return schemas;
}
