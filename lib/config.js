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
const CONFIG_FILE_NAME = 'graphql-from-swagger.config.json';
function getConfigFromFile() {
    return __awaiter(this, void 0, void 0, function* () {
        const currentDir = process.cwd();
        const data = yield fs_1.default.readFileSync(path_1.default.join(currentDir, CONFIG_FILE_NAME), 'utf-8');
        const configJSON = JSON.parse(data);
        return configJSON;
    });
}
exports.getConfigFromFile = getConfigFromFile;
