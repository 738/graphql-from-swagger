import { parse } from 'graphql';
import { codegen } from '@graphql-codegen/core';
import { Types } from '@graphql-codegen/plugin-helpers';
import * as typescriptPlugin from '@graphql-codegen/typescript';

export async function createTypesFromSchema(schemas: Array<string>, typesOutputFiles: Array<string>): Promise<string[]> {
  if (schemas.length !== typesOutputFiles.length) throw new Error('The numbers of schemas and typesOutputFiles are not matched!');
  const result = [];

  for (let i = 0; i < schemas.length; i++) {
    const generateOptions: Types.GenerateOptions = {
      filename: typesOutputFiles[i],
      schema: parse(schemas[i]),
      documents: [],
      plugins: [
        {
          typescript: {}
        },
      ],
      pluginMap: {
        typescript: typescriptPlugin,
      },
      config: {}
    };
    const output = await codegen(generateOptions);
    result.push(output);
  }
  return result;
}
