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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const core_1 = require("@graphql-codegen/core");
const typescriptPlugin = __importStar(require("@graphql-codegen/typescript"));
function createTypesFromSchema(schemas, typesOutputFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        if (schemas.length !== typesOutputFiles.length)
            throw new Error('The numbers of schemas and typesOutputFiles are not matched!');
        const result = [];
        for (let i = 0; i < schemas.length; i++) {
            const config = {
                filename: typesOutputFiles[i],
                schema: graphql_1.parse(schemas[i]),
                plugins: [
                    {
                        typescript: {}
                    }
                ],
                pluginMap: {
                    typescript: typescriptPlugin
                }
            };
            const output = yield core_1.codegen(config);
            result.push(output);
        }
        return result;
    });
}
exports.createTypesFromSchema = createTypesFromSchema;
