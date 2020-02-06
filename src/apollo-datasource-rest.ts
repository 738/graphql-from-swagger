import path from 'path';
import fs from 'fs';
import { getArgsStringFromOperationId, indent } from './utils';

export async function createRESTDataSource(
  swaggerPaths: Array<string>,
  typesFiles: Array<string>,
  restDataSourceOutputFiles: Array<string>
): Promise<void> {
  const totalLength = swaggerPaths.length;
  if (typesFiles.length !== totalLength || restDataSourceOutputFiles.length !== totalLength) throw new Error('The numbers of files are not matched!');

  for (let i = 0; i < totalLength; i++) {
    const imports = [];
    imports.push(`import { RESTDataSource } from 'apollo-datasource-rest';`);
    imports.push(`import { URLSearchParams } from 'url';`);

    const swaggerString = await fs.readFileSync(path.join(__dirname, swaggerPaths[i]), 'utf-8');
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
    `.trimRight()
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

        const argumentsString = args.length ? `{ ${args.join(', ')} }: ${getArgsStringFromOperationId(operationId, method)}Args` : '';
        if (args.length) argTypes.push(`${getArgsStringFromOperationId(operationId, method)}Args`);
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
} from '${typesFiles[i]}';
    `.trim()
    );

    await fs.writeFileSync(path.join(__dirname, restDataSourceOutputFiles[i]), [...imports, ...classSentences, ...functions, '}'].join('\n'));
    console.log(`${className} file generated!`);
  }
}
