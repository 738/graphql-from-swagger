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
const node_fetch_1 = __importDefault(require("node-fetch"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils");
function createRESTDataSource(swaggerPaths, typesFiles, restDataSourceOutputFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        const totalLength = swaggerPaths.length;
        const currentDir = process.cwd();
        const result = [];
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
            for (const endpoint in swaggerJSON.paths) {
                for (const method in swaggerJSON.paths[endpoint]) {
                    const field = swaggerJSON.paths[endpoint][method];
                    const operationId = field.operationId;
                    const parameters = {};
                    if (field.parameters) {
                        for (const parameter of field.parameters) {
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
                    func.push(...getCommentBlocks(field));
                    const argumentsString = args.length ? `{ ${args.join(', ')} }: ${utils_1.getArgsStringFromOperationId(operationId, method)}` : '';
                    if (args.length)
                        argTypes.push(`${utils_1.getArgsStringFromOperationId(operationId, method)}`);
                    func.push(utils_1.indent(`async ${operationId}(${argumentsString}) {`));
                    if (parameters['query'])
                        func.push(utils_1.indent(`const queries = { ${parameters['query'].join(', ')} };`, 2));
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
                    func.push(utils_1.indent(`return this.${method}(\`${endpoint.replace('{', '${')}${queryString}\`${bodyString}${requestInitString});`, 2));
                    func.push(utils_1.indent(`}`));
                    functions.push(func.join('\n'));
                }
            }
            imports.push(`
import {
  ${argTypes.join(',\n  ')}
} from '${utils_1.getRelativePath(restDataSourceOutputFiles[i], typesFiles[i])}';
    `.trim());
            result.push([...imports, '', ...classSentences, ...functions, '}'].join('\n'));
        }
        return result;
    });
}
exports.createRESTDataSource = createRESTDataSource;
function getCommentBlocks(field) {
    const blocks = [];
    blocks.push(utils_1.indent(`/**`));
    if (field.deprecated)
        blocks.push(utils_1.indent(` * @deprecated`));
    if (field.tags && field.tags.length > 0)
        blocks.push(utils_1.indent(` * @tags ${field.tags.join(', ')}`));
    if (field.summary)
        blocks.push(utils_1.indent(` * @summary ${field.summary}`));
    if (field.description)
        blocks.push(utils_1.indent(` * @description ${field.description}`));
    if (field.parameters) {
        for (const parameter of field.parameters) {
            let type;
            if (parameter.type) {
                if (parameter.type !== 'array') {
                    type = parameter.type;
                }
                else {
                    type = parameter.items.type + '[]';
                }
            }
            else if (parameter.schema) {
                if (parameter.schema.$ref) {
                    type = parameter.schema.$ref.split('#/definitions/').pop();
                }
                else if (parameter.schema.items && parameter.schema.type === 'array') {
                    if (parameter.schema.items.type) {
                        type = parameter.schema.items.type + '[]';
                    }
                    else if (parameter.schema.items.$ref) {
                        type = parameter.schema.items.$ref.split('#/definitions/').pop() + '[]';
                    }
                }
            }
            blocks.push(utils_1.indent(` * @param${type ? ` {${type}}` : ''} ${parameter.name} ${parameter.description ? '- ' + parameter.description : ''} @${parameter.in} ${parameter.required ? '@required' : ''}`));
        }
    }
    blocks.push(utils_1.indent(` */`));
    return blocks;
}
function createResolvers(swaggerPaths, typesFiles, restDataSourceFiles, resolversOutputFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        const totalLength = swaggerPaths.length;
        const currentDir = process.cwd();
        const result = [];
        for (let i = 0; i < totalLength; i++) {
            const imports = [];
            const queries = [];
            const mutations = [];
            const resolvers = [];
            const argTypes = [];
            const typeDefs = [];
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
    ${operationId}: (parent: Query, args: ${args.length ? utils_1.getArgsStringFromOperationId(operationId, method) : 'null'}, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.${utils_1.getInstanceNameFromClass(className)}.${operationId}(${args.length ? 'args' : ''});
    },
          `.trim(), 2));
                    }
                    else {
                        mutations.push(utils_1.indent(`
    ${operationId}: (parent: Mutation, args: ${args.length ? utils_1.getArgsStringFromOperationId(operationId, method) : 'null'}, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.${utils_1.getInstanceNameFromClass(className)}.${operationId}(${args.length ? 'args' : ''});
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
            imports.push(`import { GraphQLResolveInfo } from 'graphql';`);
            imports.push(`
import {
  ${['Query', 'Mutation', ...argTypes].join(',\n  ')}
} from '${utils_1.getRelativePath(resolversOutputFiles[i], typesFiles[i])}';
    `.trim());
            imports.push(`
import { ${className} } from '${utils_1.getRelativePath(resolversOutputFiles[i], restDataSourceFiles[i])}';
    `.trim());
            typeDefs.push(`
type DataSources = {
  ${utils_1.getInstanceNameFromClass(className)}: ${className};
};
      `.trim());
            typeDefs.push(`
type Context = {
  dataSources: DataSources;
};
      `.trim());
            result.push([...imports, '', ...typeDefs, '', resolvers].join('\n'));
        }
        return result;
    });
}
exports.createResolvers = createResolvers;
