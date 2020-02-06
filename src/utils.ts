import path from 'path';

// deleteCustomerUsingDELETE -> MutationDeleteCustomerUsingDelete
export function getArgsStringFromOperationId(operationId: string, method: string): string {
  const prefix = method === 'get' ? 'Query' : 'Mutation';
  let prevChar: string = '';
  return (
    prefix +
    operationId.split('').reduce((result: string, char, index) => {
      if (index === 0) return char.toUpperCase();
      if (/[A-Z]/.test(prevChar) && /[A-Z]/.test(char)) result += char.toLowerCase();
      else result += char;
      prevChar = char;
      return result;
    }, '') +
    'Args'
  );
}

export function indent(str: string, count = 1): string {
  return new Array(count).fill('  ').join('') + str;
}

// "../generated/HeroesApi.ts" 파일에서 "../generated/types1.ts" 파일의 상대경로는 "./types1"
export function getRelativePath(from: string, to: string, ext: string = '.ts') {
  const targetFileName = path.basename(to, ext);
  let relativePath = path.relative(path.dirname(from), path.dirname(to));
  if (relativePath === '') relativePath = './';
  return relativePath + targetFileName;
}
