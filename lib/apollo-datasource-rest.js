"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils");
const node_fetch_1 = __importDefault(require("node-fetch"));
function createRESTDataSource(swaggerPaths, typesFiles, restDataSourceOutputFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        const totalLength = swaggerPaths.length;
        if (typesFiles.length !== totalLength || restDataSourceOutputFiles.length !== totalLength)
            throw new Error('The numbers of files are not matched!');
        const currentDir = process.cwd();
        for (let i = 0; i < totalLength; i++) {
            const imports = [];
            imports.push(`import { RESTDataSource } from 'apollo-datasource-rest';`);
            imports.push(`import { URLSearchParams } from 'url';`);
            let swaggerString;
            if (utils_1.checkUrlForm(swaggerPaths[i])) {
                swaggerString = yield (yield node_fetch_1.default(swaggerPaths[i])).text();
            }
            else {
                swaggerString = yield fs_1.default.readFileSync(path_1.default.join(currentDir, swaggerPaths[i]), 'utf-8');
            }
            const swaggerJSON = JSON.parse(swaggerString);
            const className = path_1.default.basename(restDataSourceOutputFiles[i], '.ts');
            const classSentences = [];
            classSentences.push(`
export class ${className} extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = '${swaggerJSON.host.startsWith('http') ? swaggerJSON.host : 'http://' + swaggerJSON.host}';
  }
    `.trim());
            const functions = [];
            const argTypes = [];
            for (let endpoint in swaggerJSON.paths) {
                for (let method in swaggerJSON.paths[endpoint]) {
                    const field = swaggerJSON.paths[endpoint][method];
                    const operationId = field.operationId;
                    const parameters = {};
                    if (field.parameters) {
                        for (let parameter of field.parameters) {
                            if (parameters[parameter.in] !== undefined) {
                                parameters[parameter.in].push(parameter.name);
                            }
                            else {
                                parameters[parameter.in] = [parameter.name];
                            }
                        }
                    }
                    const args = Object.keys(parameters).reduce((result, param) => {
                        if (parameters[param] === undefined)
                            return result;
                        return [...result, ...parameters[param]];
                    }, []);
                    const func = [];
                    func.push('');
                    const argumentsString = args.length ? `{ ${args.join(', ')} }: ${utils_1.getArgsStringFromOperationId(operationId, method)}` : '';
                    if (args.length)
                        argTypes.push(`${utils_1.getArgsStringFromOperationId(operationId, method)}`);
                    func.push(utils_1.indent(`async ${operationId}(${argumentsString}) {`));
                    if (parameters['query'])
                        func.push(utils_1.indent(`const queries: { [key: string]: any } = { ${parameters['query'].join(', ')} };`, 2));
                    const queryString = parameters['query'] ? `?\${new URLSearchParams(queries)}` : '';
                    const bodyString = parameters['body'] ? `, { ${parameters['body'].join(', ')} } as { [key: string]: any }` : '';
                    func.push(utils_1.indent(`return this.${method}(\`${endpoint.replace('{', '${')}${queryString}\`${bodyString});`, 2));
                    func.push(utils_1.indent(`}`));
                    functions.push(func.join('\n'));
                }
            }
            imports.push(`
import {
  ${argTypes.join(',\n  ')}
} from '${utils_1.getRelativePath(restDataSourceOutputFiles[i], typesFiles[i])}';
    `.trim());
            yield fs_1.default.writeFileSync(path_1.default.join(currentDir, restDataSourceOutputFiles[i]), [...imports, '', ...classSentences, ...functions, '}'].join('\n'));
            console.log(`RESTDataSource: ${className} file (${path_1.default.join(currentDir, restDataSourceOutputFiles[i])}) generated!`);
        }
    });
}
exports.createRESTDataSource = createRESTDataSource;
function createResolvers(swaggerPaths, typesFiles, restDataSourceFiles, resolversOutputFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        const totalLength = swaggerPaths.length;
        if (typesFiles.length !== totalLength || restDataSourceFiles.length !== totalLength || resolversOutputFiles.length !== totalLength)
            throw new Error('The numbers of files are not matched!');
        const currentDir = process.cwd();
        for (let i = 0; i < totalLength; i++) {
            const imports = [];
            const queries = [];
            const mutations = [];
            const resolvers = [];
            const argTypes = [];
            let swaggerString;
            if (utils_1.checkUrlForm(swaggerPaths[i])) {
                swaggerString = yield (yield node_fetch_1.default(swaggerPaths[i])).text();
            }
            else {
                swaggerString = yield fs_1.default.readFileSync(path_1.default.join(currentDir, swaggerPaths[i]), 'utf-8');
            }
            const swaggerJSON = JSON.parse(swaggerString);
            const className = path_1.default.basename(restDataSourceFiles[i], '.ts');
            for (let endpoint in swaggerJSON.paths) {
                for (let method in swaggerJSON.paths[endpoint]) {
                    const field = swaggerJSON.paths[endpoint][method];
                    const operationId = field.operationId;
                    const parameters = {};
                    if (field.parameters) {
                        for (let parameter of field.parameters) {
                            if (parameters[parameter.in] !== undefined) {
                                parameters[parameter.in].push(parameter.name);
                            }
                            else {
                                parameters[parameter.in] = [parameter.name];
                            }
                        }
                    }
                    const args = Object.keys(parameters).reduce((result, param) => {
                        if (parameters[param] === undefined)
                            return result;
                        return [...result, ...parameters[param]];
                    }, []);
                    if (args.length)
                        argTypes.push(`${utils_1.getArgsStringFromOperationId(operationId, method)}`);
                    if (method === 'get') {
                        queries.push(utils_1.indent(`
    ${operationId}: (_: any, args: ${args.length ? utils_1.getArgsStringFromOperationId(operationId, method) : 'any'}, { dataSources }: any) => {
      return dataSources.${utils_1.getInstanceNameFromClass(className)}.${operationId}(${args.length ? 'args' : ''});
    },
          `.trim(), 2));
                    }
                    else {
                        mutations.push(utils_1.indent(`
    ${operationId}: (_: any, args: ${args.length ? utils_1.getArgsStringFromOperationId(operationId, method) : 'any'}, { dataSources }: any) => {
      return dataSources.${utils_1.getInstanceNameFromClass(className)}.${operationId}(${args.length ? 'args' : ''});
    },
          `.trim(), 2));
                    }
                }
            }
            resolvers.push(`
export const resolvers = {
  Query: {
${queries.join('\n')}
  },
  Mutation: {
${mutations.join('\n')}
  }
}
    `.trim());
            imports.push(`
import {
  ${argTypes.join(',\n  ')}
} from '${utils_1.getRelativePath(resolversOutputFiles[i], typesFiles[i])}';
    `.trim());
            yield fs_1.default.writeFileSync(path_1.default.join(currentDir, resolversOutputFiles[i]), [...imports, '', resolvers].join('\n'));
            console.log(`Resolvers: ${className} file (${path_1.default.join(currentDir, resolversOutputFiles[i])}) generated!`);
        }
    });
}
exports.createResolvers = createResolvers;
