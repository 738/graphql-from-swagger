import { GraphQLSchema, parse, printSchema } from "graphql";
import { codegen } from '@graphql-codegen/core';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import fs from 'fs';
import path from 'path';

export async function createTypesFromSchema(
  schemas: Array<GraphQLSchema>,
  typesOutputFiles: Array<string>
): Promise<void> {
  for (let i = 0; i < schemas.length; i++) {
    const config = {
      filename: typesOutputFiles[i],
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
    await fs.writeFileSync(path.join(__dirname, typesOutputFiles[i]), output);
    console.log('type Outputs generated!');
  }
}
