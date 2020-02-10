import { parse } from 'graphql';
import { codegen } from '@graphql-codegen/core';
import * as typescriptPlugin from '@graphql-codegen/typescript';

export async function createTypesFromSchema(schemas: Array<string>, typesOutputFiles: Array<string>): Promise<string[]> {
  if (schemas.length !== typesOutputFiles.length) throw new Error('The numbers of schemas and typesOutputFiles are not matched!');
  const result = [];

  for (let i = 0; i < schemas.length; i++) {
    const config = {
      filename: typesOutputFiles[i],
      schema: parse(schemas[i]),
      plugins: [
        {
          typescript: {}
        }
      ],
      pluginMap: {
        typescript: typescriptPlugin
      }
    };
    const output = await codegen(config as any);
    result.push(output);
  }
  return result;
}
