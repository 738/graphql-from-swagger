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
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_to_graphql_1 = require("./swagger-to-graphql");
const graphql_code_generator_1 = require("./graphql-code-generator");
const apollo_datasource_rest_1 = require("./apollo-datasource-rest");
const config_1 = require("./config");
const utils_1 = require("./utils");
function cli() {
    return __awaiter(this, void 0, void 0, function* () {
        const { swaggerPaths, schemaOutputFiles, typesOutputFiles, restDataSourceOutputFiles, resolversOutputFiles } = yield config_1.getConfigFromFile();
        const schemas = yield swagger_to_graphql_1.createSchemaFromSwagger(swaggerPaths, schemaOutputFiles);
        const types = yield graphql_code_generator_1.createTypesFromSchema(schemas, typesOutputFiles);
        const restDataSources = yield apollo_datasource_rest_1.createRESTDataSource(swaggerPaths, typesOutputFiles, restDataSourceOutputFiles);
        const resolvers = yield apollo_datasource_rest_1.createResolvers(swaggerPaths, typesOutputFiles, restDataSourceOutputFiles, resolversOutputFiles);
        utils_1.writeFiles(schemaOutputFiles, schemas);
        utils_1.writeFiles(typesOutputFiles, types);
        utils_1.writeFiles(restDataSourceOutputFiles, restDataSources);
        utils_1.writeFiles(resolversOutputFiles, resolvers);
    });
}
exports.cli = cli;
