"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// deleteCustomerUsingDELETE -> MutationDeleteCustomerUsingDeleteArgs
function getArgsStringFromOperationId(operationId, method) {
    const prefix = method.toLowerCase() === 'get' ? 'Query' : 'Mutation';
    let prevChar = '';
    return (prefix +
        operationId.split('').reduce((result, char, index) => {
            if (index === 0)
                return char.toUpperCase();
            if (/[A-Z]/.test(prevChar) && /[A-Z]/.test(char))
                result += char.toLowerCase();
            else
                result += char;
            prevChar = char;
            return result;
        }, '') +
        'Args');
}
exports.getArgsStringFromOperationId = getArgsStringFromOperationId;
function indent(str, count = 1) {
    return new Array(count).fill('  ').join('') + str;
}
exports.indent = indent;
// "../generated/HeroesApi.ts" 파일에서 "../generated/types1.ts" 파일의 상대경로는 "./types1"
function getRelativePath(from, to, ext = '.ts') {
    const targetFileName = path_1.default.basename(to, ext);
    let relativePath = path_1.default.relative(path_1.default.dirname(from), path_1.default.dirname(to));
    if (relativePath === '')
        relativePath = '.';
    if (targetFileName === 'index')
        return relativePath;
    return `${relativePath}/${targetFileName}`;
}
exports.getRelativePath = getRelativePath;
function getInstanceNameFromClass(className) {
    if (!className)
        throw new Error('[getInstanceNameFromClass] className can not be empty string or undefined!');
    return className[0].toLowerCase() + className.substring(1);
}
exports.getInstanceNameFromClass = getInstanceNameFromClass;
function checkUrlForm(strUrl) {
    var expUrl = /^http[s]?\:\/\//i;
    return expUrl.test(strUrl);
}
exports.checkUrlForm = checkUrlForm;
function writeFiles(paths, strs) {
    const currentDir = process.cwd();
    for (let i = 0; i < paths.length; i++) {
        fs_1.default.writeFile(path_1.default.join(currentDir, paths[i]), strs[i], () => {
            console.info(`[${path_1.default.join(currentDir, paths[i])}] was generated!`);
        });
    }
}
exports.writeFiles = writeFiles;
exports.replaceOddChars = (str) => str.replace(/[^_a-zA-Z0-9]/g, '_');
exports.getGQLTypeNameFromURL = (method, url) => {
    const fromUrl = exports.replaceOddChars(url.replace(/[{}]+/g, ''));
    return `${method}${fromUrl}`;
};
