import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import { getArgsStringFromOperationId, indent, getRelativePath, getInstanceNameFromClass, checkUrlForm } from './utils';

export async function createRESTDataSource(
  swaggerPaths: Array<string>,
  typesFiles: Array<string>,
  restDataSourceOutputFiles: Array<string>
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
    const swaggerJSON = JSON.parse(swaggerString);

    const className = path.basename(restDataSourceOutputFiles[i], '.ts');
    const classSentences = [];
    classSentences.push(
      `
export class ${className} extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = '${swaggerJSON.host.startsWith('http') ? swaggerJSON.host : 'http://' + swaggerJSON.host}';
  }
    `.trim()
    );

    const functions: string[] = [];
    const argTypes: string[] = [];
    for (let endpoint in swaggerJSON.paths) {
      for (let method in swaggerJSON.paths[endpoint]) {
        const field = swaggerJSON.paths[endpoint][method];
        const operationId = field.operationId;
        const parameters: { [key: string]: string[] } = {};

        if (field.parameters) {
          for (let parameter of field.parameters) {
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

        func.push(indent(`/**`));
        if (field.deprecated) func.push(indent(` * @deprecated`));
        if (field.tags && field.tags.length > 0) func.push(indent(` * @tags ${field.tags.join(', ')}`));
        if (field.summary) func.push(indent(` * @summary ${field.summary}`));
        if (field.description) func.push(indent(` * @description ${field.description}`));
        func.push(indent(` */`));

        const argumentsString = args.length ? `{ ${args.join(', ')} }: ${getArgsStringFromOperationId(operationId, method)}` : '';
        if (args.length) argTypes.push(`${getArgsStringFromOperationId(operationId, method)}`);
        func.push(indent(`async ${operationId}(${argumentsString}) {`));

        if (parameters['query']) func.push(indent(`const queries = { ${parameters['query'].join(', ')} };`, 2));

        const queryString = parameters['query'] ? `?\${new URLSearchParams(queries as { [key: string]: any })}` : '';
        const bodyString = parameters['body'] && method !== 'get' ? `, { ${parameters['body'].join(', ')} }` : '';
        let requestInitString = '';
        let formDataString = '';
        const isXWwwFormUrlEncoded = field.consumes && field.consumes.includes('application/x-www-form-urlencoded');

        if (isXWwwFormUrlEncoded) {
          requestInitString = `, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }`;
          formDataString = parameters['formData'] && method !== 'get' ? `, { ${parameters['formData'].join(', ')} }` : '';
        }

        func.push(indent(`return this.${method}(\`${endpoint.replace('{', '${')}${queryString}\`${bodyString || formDataString}${requestInitString});`, 2));
        func.push(indent(`}`));

        functions.push(func.join('\n'));
      }
    }

    imports.push(
      `
import {
  ${argTypes.join(',\n  ')}
} from '${getRelativePath(restDataSourceOutputFiles[i], typesFiles[i])}';
    `.trim()
    );

    result.push([...imports, '', ...classSentences, ...functions, '}'].join('\n'));
  }
  return result;
}

export async function createResolvers(
  swaggerPaths: Array<string>,
  typesFiles: Array<string>,
  restDataSourceFiles: Array<string>,
  resolversOutputFiles: Array<string>
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
    const swaggerJSON = JSON.parse(swaggerString);

    const className = path.basename(restDataSourceFiles[i], '.ts');

    for (let endpoint in swaggerJSON.paths) {
      for (let method in swaggerJSON.paths[endpoint]) {
        const field = swaggerJSON.paths[endpoint][method];
        const operationId = field.operationId;
        const parameters: { [key: string]: string[] } = {};

        if (field.parameters) {
          for (let parameter of field.parameters) {
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
          queries.push(indent(`
    ${operationId}: (parent: Query, args: ${args.length ? getArgsStringFromOperationId(operationId, method) : 'null'}, { dataSources }: Context) => {
      return dataSources.${getInstanceNameFromClass(className)}.${operationId}(${args.length ? 'args' : ''});
    },
          `.trim(), 2));
        } else {
          mutations.push(indent(`
    ${operationId}: (parent: Mutation, args: ${args.length ? getArgsStringFromOperationId(operationId, method) : 'null'}, { dataSources }: Context) => {
      return dataSources.${getInstanceNameFromClass(className)}.${operationId}(${args.length ? 'args' : ''});
    },
          `.trim(), 2));
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
    `.trim()
    );

    imports.push(
      `
import {
  ${['Query', 'Mutation', ...argTypes].join(',\n  ')}
} from '${getRelativePath(resolversOutputFiles[i], typesFiles[i])}';
    `.trim()
    );

    imports.push(
      `
import { ${className} } from '${getRelativePath(resolversOutputFiles[i], restDataSourceFiles[i])}';
    `.trim()
    );

    typeDefs.push(
      `
type DataSources = {
  ${getInstanceNameFromClass(className)}: ${className};
};
      `.trim()
    );

    typeDefs.push(
      `
type Context = {
  dataSources: DataSources;
};
      `.trim()
    );

    result.push([...imports, '', ...typeDefs, '', resolvers].join('\n'));
  }
  return result;
}
