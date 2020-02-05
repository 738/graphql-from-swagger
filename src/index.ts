import fs from 'fs';
import path from 'path';
import { printSchema, GraphQLSchema, parse } from 'graphql';
import { createSchema, CallBackendArguments } from 'swagger-to-graphql';
import { codegen } from '@graphql-codegen/core';
import * as typescriptPlugin from '@graphql-codegen/typescript';

// TODO: 설정 파일에서 swagger 파일 읽기
const swaggerPaths: Array<string> = [`./test/swagger.json`];
const schemaOutputFiles: Array<string> = [`../generated/schema1.graphql`];
const typeOutputFiles: Array<string> = ['../generated/types1.ts'];

async function callBackend({
  context,
  requestOptions
}: CallBackendArguments<Request>) {
  return 'Not implemented';
}

async function createSchemaFromSwagger(
  swaggerPaths: Array<string>
): Promise<Array<GraphQLSchema>> {
  const schemas: Array<GraphQLSchema> = [];
  for (let i = 0; i < swaggerPaths.length; i++) {
    const schema: GraphQLSchema = await createSchema({
      swaggerSchema: swaggerPaths[i],
      callBackend
    });
    console.log(printSchema(schema));
    await fs.writeFileSync(path.join(__dirname, schemaOutputFiles[i]), printSchema(schema));
    console.log('schema outputs generated!');
    // TODO: 스키마 각 파일에 쓰기
    schemas.push(schema);
  }
  return schemas;
}

async function createTypesFromSchema(
  schemas: Array<GraphQLSchema>,
  outputFiles: Array<string>
): Promise<void> {
  for (let i = 0; i < schemas.length; i++) {
    const config = {
      filename: outputFiles[i],
      schema: parse(printSchema(schemas[i])),
      plugins: [
        {
          typescript: {}
        }
      ],
      pluginMap: {
        typescript: typescriptPlugin
      },
    };
    const output = await codegen(config as any);
    fs.writeFile(path.join(__dirname, outputFiles[i]), output, () => {
      console.log('type Outputs generated!');
    });
    // console.log(output);
  }
}

(async () => {
  const schemas = await createSchemaFromSwagger(swaggerPaths);
  await createTypesFromSchema(schemas, typeOutputFiles);
})();
