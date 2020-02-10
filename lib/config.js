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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DEFAULT_CONFIG_FILE_NAME = 'graphql-from-swagger.config.json';
function getConfigFromFile(configName = DEFAULT_CONFIG_FILE_NAME) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentDir = process.cwd();
        const data = yield fs_1.default.readFileSync(path_1.default.join(currentDir, configName), 'utf-8');
        const configJSON = JSON.parse(data);
        validateConfig(configJSON);
        return configJSON;
    });
}
exports.getConfigFromFile = getConfigFromFile;
function validateConfig(config) {
    if (config.swaggerPaths === undefined)
        throw new Error('swaggerPaths does not exist in config!');
    const totalLength = config.swaggerPaths.length;
    if (Object.keys(config).some((key) => config[key].length !== totalLength))
        throw new Error('The numbers of files are not matched!');
    if (!instanceOfConfig(config)) {
        throw new Error('Invalid Config!');
    }
    return;
}
exports.validateConfig = validateConfig;
function instanceOfConfig(config) {
    return config.swaggerPaths !== undefined
        && config.schemaOutputFiles !== undefined
        && config.typesOutputFiles !== undefined
        && config.restDataSourceOutputFiles !== undefined
        && config.resolversOutputFiles !== undefined;
}
exports.instanceOfConfig = instanceOfConfig;
