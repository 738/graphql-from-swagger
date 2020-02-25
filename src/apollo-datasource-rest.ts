import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import YAML from 'yamljs';
import {
  getArgsStringFromOperationId,
  indent,
  getRelativePath,
  getInstanceNameFromClass,
  checkUrlForm,
  replaceOddChars,
  getGQLTypeNameFromURL,
} from './utils';

export async function createRESTDataSource(
  swaggerPaths: Array<string>,
  typesFiles: Array<string>,
  restDataSourceOutputFiles: Array<string>,
): Promise<Array<string>> {
  const totalLength = swaggerPaths.length;
  const currentDir = process.cwd();
  const result: Array<string> = [];

  for (let i = 0; i < totalLength; i++) {
    const imports = [];
    imports.push(`import { RESTDataSource } from 'apollo-datasource-rest';`);
    imports.push(`import { URLSearchParams } from 'url';`);

    let swaggerString: string;
    if (checkUrlForm(swaggerPaths[i])) {
      swaggerString = await (await fetch(swaggerPaths[i])).text();
    } else {
      swaggerString = await fs.readFileSync(path.join(currentDir, swaggerPaths[i]), 'utf-8');
    }

    let swaggerJSON: { [key: string]: any };
    if (swaggerPaths[i].endsWith('.json')) {
      swaggerJSON = JSON.parse(swaggerString);
    } else if (swaggerPaths[i].endsWith('.yaml')) {
      swaggerJSON = YAML.parse(swaggerString);
    } else {
      throw new Error('Swagger is Invalid!');
    }

    const className = path.basename(restDataSourceOutputFiles[i], '.ts');
    const classSentences = [];
    let hostUrl = '';
    if (swaggerJSON.host) {
      hostUrl = swaggerJSON.host.startsWith('http') ? swaggerJSON.host : 'http://' + swaggerJSON.host;
      if (swaggerJSON.basePath) {
        hostUrl += swaggerJSON.basePath;
      }
    } else if (swaggerJSON.servers && swaggerJSON.servers.length > 0 && swaggerJSON.servers[0].url) {
      hostUrl = swaggerJSON.servers[0].url.startsWith('http') ? swaggerJSON.servers[0].url : 'http://' + swaggerJSON.servers[0].url;
    } else {
      throw new Error('hostUrl is not exist!');
    }
    classSentences.push(
      `
export class ${className} extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = '${hostUrl}';
  }
    `.trim(),
    );

    const functions: string[] = [];
    const argTypes: string[] = [];
    for (const endpoint in swaggerJSON.paths) {
      for (const method in swaggerJSON.paths[endpoint]) {
        if (method === 'parameters') continue;
        const field = swaggerJSON.paths[endpoint][method];
        const operationId = field.operationId ? replaceOddChars(field.operationId) : getGQLTypeNameFromURL(method, endpoint);
        const parameters: { [key: string]: string[] } = {};

        if (field.parameters) {
          for (const parameter of field.parameters) {
            if (parameters[parameter.in] !== undefined) {
              parameters[parameter.in].push(parameter.name);
            } else {
              parameters[parameter.in] = [parameter.name];
            }
          }
        }
        const args = Object.keys(parameters).reduce((result: string[], param) => {
          if (parameters[param] === undefined) return result;
          return [...result, ...parameters[param]];
        }, []);

        const func: string[] = [];
        func.push('');
        func.push(...getCommentBlocks(field));

        const argumentsString = args.length ? `{ ${args.join(', ')} }: ${getArgsStringFromOperationId(operationId, method)}` : '';
        if (args.length) argTypes.push(`${getArgsStringFromOperationId(operationId, method)}`);
        func.push(indent(`async ${operationId}(${argumentsString}) {`));

        if (parameters['query']) func.push(indent(`const queries = { ${parameters['query'].join(', ')} };`, 2));

        const queryString = parameters['query'] ? `?\${new URLSearchParams(queries as { [key: string]: any })}` : '';
        let bodyString = parameters['body'] && method !== 'get' ? `, { ${parameters['body'].join(', ')} }` : '';
        let requestInitString = '';
        let headerStrings = [];
        const isXWwwFormUrlEncoded = field.consumes && field.consumes.includes('application/x-www-form-urlencoded');

        if (isXWwwFormUrlEncoded) {
          headerStrings.push(`'Content-Type': 'application/x-www-form-urlencoded'`);
          bodyString = parameters['formData'] && method !== 'get' ? `, { ${parameters['formData'].join(', ')} }` : '';
        }

        if (parameters['header']) {
          headerStrings.push(...parameters['header']);
        }

        if (headerStrings && headerStrings.length > 0) {
          requestInitString = `, {
      headers: {
        ${headerStrings.join(',\n') + ','}
      },
    }`;
        }

        func.push(indent(`return this.${method}(\`${endpoint.replace('{', '${')}${queryString}\`${bodyString}${requestInitString});`, 2));
        func.push(indent(`}`));

        functions.push(func.join('\n'));
      }
    }

    imports.push(
      `
import {
  ${argTypes.join(',\n  ')}
} from '${getRelativePath(restDataSourceOutputFiles[i], typesFiles[i])}';
    `.trim(),
    );

    result.push([...imports, '', ...classSentences, ...functions, '}'].join('\n'));
  }
  return result;
}

function getCommentBlocks(field: { [key: string]: any }): string[] {
  const blocks: string[] = [];
  blocks.push(indent(`/**`));
  if (field.deprecated) blocks.push(indent(` * @deprecated`));
  if (field.tags && field.tags.length > 0) blocks.push(indent(` * @tags ${field.tags.join(', ')}`));
  if (field.summary) blocks.push(indent(` * @summary ${field.summary}`));
  if (field.description) blocks.push(indent(` * @description ${field.description}`));
  if (field.parameters) {
    for (const parameter of field.parameters) {
      let type;
      if (parameter.type) {
        if (parameter.type !== 'array') {
          type = parameter.type;
        } else {
          type = parameter.items.type + '[]';
        }
      } else if (parameter.schema) {
        if (parameter.schema.$ref) {
          type = parameter.schema.$ref.split('#/definitions/').pop();
        } else if (parameter.schema.items && parameter.schema.type === 'array') {
          if (parameter.schema.items.type) {
            type = parameter.schema.items.type + '[]';
          } else if (parameter.schema.items.$ref) {
            type = parameter.schema.items.$ref.split('#/definitions/').pop() + '[]';
          }
        }
      }
      blocks.push(
        indent(
          ` * @param${type ? ` {${type}}` : ''} ${parameter.name} ${parameter.description ? '- ' + parameter.description : ''} @${
            parameter.in
          } ${parameter.required ? '@required' : ''}`,
        ),
      );
    }
  }
  blocks.push(indent(` */`));
  return blocks;
}

export async function createResolvers(
  swaggerPaths: Array<string>,
  typesFiles: Array<string>,
  restDataSourceFiles: Array<string>,
  resolversOutputFiles: Array<string>,
): Promise<Array<string>> {
  const totalLength = swaggerPaths.length;

  const currentDir = process.cwd();
  const result: Array<string> = [];

  for (let i = 0; i < totalLength; i++) {
    const imports = [];
    const queries = [];
    const mutations = [];
    const resolvers = [];
    const argTypes = [];
    const typeDefs = [];

    let swaggerString: string;
    if (checkUrlForm(swaggerPaths[i])) {
      swaggerString = await (await fetch(swaggerPaths[i])).text();
    } else {
      swaggerString = await fs.readFileSync(path.join(currentDir, swaggerPaths[i]), 'utf-8');
    }

    let swaggerJSON: { [key: string]: any };
    if (swaggerPaths[i].endsWith('.json')) {
      swaggerJSON = JSON.parse(swaggerString);
    } else if (swaggerPaths[i].endsWith('.yaml')) {
      swaggerJSON = YAML.parse(swaggerString);
    } else {
      throw new Error('Swagger is Invalid!');
    }

    const className = path.basename(restDataSourceFiles[i], '.ts');

    for (const endpoint in swaggerJSON.paths) {
      for (const method in swaggerJSON.paths[endpoint]) {
        if (method === 'parameters') continue;
        const field = swaggerJSON.paths[endpoint][method];
        const operationId = field.operationId ? replaceOddChars(field.operationId) : getGQLTypeNameFromURL(method, endpoint);
        const parameters: { [key: string]: string[] } = {};

        if (field.parameters) {
          for (const parameter of field.parameters) {
            if (parameters[parameter.in] !== undefined) {
              parameters[parameter.in].push(parameter.name);
            } else {
              parameters[parameter.in] = [parameter.name];
            }
          }
        }
        const args = Object.keys(parameters).reduce((result: string[], param) => {
          if (parameters[param] === undefined) return result;
          return [...result, ...parameters[param]];
        }, []);

        if (args.length) argTypes.push(`${getArgsStringFromOperationId(operationId, method)}`);

        if (method === 'get') {
          queries.push(
            indent(
              `
    ${operationId}: (parent: Query, args: ${
                args.length ? getArgsStringFromOperationId(operationId, method) : 'null'
              }, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.${getInstanceNameFromClass(className)}.${operationId}(${args.length ? 'args' : ''});
    },
          `.trim(),
              2,
            ),
          );
        } else {
          mutations.push(
            indent(
              `
    ${operationId}: (parent: Mutation, args: ${
                args.length ? getArgsStringFromOperationId(operationId, method) : 'null'
              }, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.${getInstanceNameFromClass(className)}.${operationId}(${args.length ? 'args' : ''});
    },
          `.trim(),
              2,
            ),
          );
        }
      }
    }
    resolvers.push(
      `
export const resolvers = {
  Query: {
${queries.join('\n')}
  },
  Mutation: {
${mutations.join('\n')}
  }
}
    `.trim(),
    );

    imports.push(`import { GraphQLResolveInfo } from 'graphql';`);

    imports.push(
      `
import {
  ${['Query', 'Mutation', ...argTypes].join(',\n  ')}
} from '${getRelativePath(resolversOutputFiles[i], typesFiles[i])}';
    `.trim(),
    );

    imports.push(
      `
import { ${className} } from '${getRelativePath(resolversOutputFiles[i], restDataSourceFiles[i])}';
    `.trim(),
    );

    typeDefs.push(
      `
type DataSources = {
  ${getInstanceNameFromClass(className)}: ${className};
};
      `.trim(),
    );

    typeDefs.push(
      `
type Context = {
  dataSources: DataSources;
};
      `.trim(),
    );

    result.push([...imports, '', ...typeDefs, '', resolvers].join('\n'));
  }
  return result;
}
