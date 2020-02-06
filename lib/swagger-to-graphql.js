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
const graphql_1 = require("graphql");
const swagger_to_graphql_1 = __importDefault(require("swagger-to-graphql"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
function callBackend({ context, requestOptions }) {
    return __awaiter(this, void 0, void 0, function* () {
        return 'Not implemented';
    });
}
function createSchemaFromSwagger(swaggerPaths, schemaOutputFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        if (swaggerPaths.length !== schemaOutputFiles.length)
            throw new Error('The numbers of swaggerPaths and schemaOutputFiles are not matched!');
        const currentDir = process.cwd();
        const schemas = [];
        for (let i = 0; i < swaggerPaths.length; i++) {
            const schema = yield swagger_to_graphql_1.default({
                swaggerSchema: utils_1.checkUrlForm(swaggerPaths[i]) ? swaggerPaths[i] : path_1.default.join(currentDir, swaggerPaths[i]),
                callBackend
            });
            yield fs_1.default.writeFileSync(path_1.default.join(currentDir, schemaOutputFiles[i]), graphql_1.printSchema(schema));
            console.log(`GraphQL Schema file (${path_1.default.join(currentDir, schemaOutputFiles[i])}) was generated!`);
            schemas.push(schema);
        }
        return schemas;
    });
}
exports.createSchemaFromSwagger = createSchemaFromSwagger;
