import path from 'path';
import fs from 'fs';
import { getArgsStringFromOperationId, indent, getRelativePath, getInstanceNameFromClass, checkUrlForm } from './utils';
import pkgDir from 'pkg-dir';
import fetch from 'node-fetch';

export async function createRESTDataSource(
  swaggerPaths: Array<string>,
  typesFiles: Array<string>,
  restDataSourceOutputFiles: Array<string>
): Promise<void> {
  const totalLength = swaggerPaths.length;
  if (typesFiles.length !== totalLength || restDataSourceOutputFiles.length !== totalLength) throw new Error('The numbers of files are not matched!');
  const rootDir = await pkgDir(__dirname);

  for (let i = 0; i < totalLength; i++) {
    const imports = [];
    imports.push(`import { RESTDataSource } from 'apollo-datasource-rest';`);
    imports.push(`import { URLSearchParams } from 'url';`);

    let swaggerString: string;
    if (checkUrlForm(swaggerPaths[i])) {
      swaggerString = await (await fetch(swaggerPaths[i])).text();
    } else {
      swaggerString = await fs.readFileSync(path.join(rootDir as string, swaggerPaths[i]), 'utf-8');
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

        const argumentsString = args.length ? `{ ${args.join(', ')} }: ${getArgsStringFromOperationId(operationId, method)}` : '';
        if (args.length) argTypes.push(`${getArgsStringFromOperationId(operationId, method)}`);
        func.push(indent(`async ${operationId}(${argumentsString}) {`));

        if (parameters['query']) func.push(indent(`const queries = { ${parameters['query'].join(', ')} };`, 2));

        const queryString = parameters['query'] ? `?\${new URLSearchParams(queries)}` : '';
        const bodyString = parameters['body'] ? `, { ${parameters['body'].join(', ')} }` : '';

        func.push(indent(`return this.${method}(\`${endpoint.replace('{', '${')}${queryString}\`${bodyString});`, 2));
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

    await fs.writeFileSync(path.join(rootDir as string, restDataSourceOutputFiles[i]), [...imports, '', ...classSentences, ...functions, '}'].join('\n'));
    console.log(`RESTDataSource: ${className} file (${path.join(rootDir as string, restDataSourceOutputFiles[i])}) generated!`);
  }
}

export async function createResolvers(
  swaggerPaths: Array<string>,
  typesFiles: Array<string>,
  restDataSourceFiles: Array<string>,
  resolversOutputFiles: Array<string>
): Promise<void> {
  const totalLength = swaggerPaths.length;
  if (typesFiles.length !== totalLength || restDataSourceFiles.length !== totalLength || resolversOutputFiles.length !== totalLength)
    throw new Error('The numbers of files are not matched!');
    const rootDir = await pkgDir(__dirname);

  for (let i = 0; i < totalLength; i++) {
    const imports = [];
    const queries = [];
    const mutations = [];
    const resolvers = [];
    const argTypes = [];

    let swaggerString: string;
    if (checkUrlForm(swaggerPaths[i])) {
      swaggerString = await (await fetch(swaggerPaths[i])).text();
    } else {
      swaggerString = await fs.readFileSync(path.join(rootDir as string, swaggerPaths[i]), 'utf-8');
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
    ${operationId}: (_: any, args: ${args.length ? getArgsStringFromOperationId(operationId, method) : 'any'}, { dataSources }: any) => {
      return dataSources.${getInstanceNameFromClass(className)}.${operationId}(${args.length ? 'args' : ''});
    },
          `.trim(), 2));
        } else {
          mutations.push(indent(`
    ${operationId}: (_: any, args: ${args.length ? getArgsStringFromOperationId(operationId, method) : 'any'}, { dataSources }: any) => {
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
  ${argTypes.join(',\n  ')}
} from '${getRelativePath(resolversOutputFiles[i], typesFiles[i])}';
    `.trim()
    );
    await fs.writeFileSync(path.join(rootDir as string, resolversOutputFiles[i]), [...imports, '', resolvers].join('\n'));
    console.log(`Resolvers: ${className} file (${path.join(rootDir as string, resolversOutputFiles[i])}) generated!`);
  }
}
