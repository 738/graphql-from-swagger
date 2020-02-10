import { getArgsStringFromOperationId, indent, getRelativePath, getInstanceNameFromClass, checkUrlForm } from '../src/utils';

describe('utils.ts', () => {
    test('getArgsStringFromOperationId', () => {
      expect(getArgsStringFromOperationId('copyAdgroupUsingPOST', 'POST')).toBe('MutationCopyAdgroupUsingPostArgs');
      expect(getArgsStringFromOperationId('downloadCampaignUsingPOST', 'POST')).toBe('MutationDownloadCampaignUsingPostArgs');
      expect(getArgsStringFromOperationId('migrateAdImagePathUsingGET', 'GET')).toBe('QueryMigrateAdImagePathUsingGetArgs');
      expect(getArgsStringFromOperationId('migrateAdImagePathUsingGET', 'get')).toBe('QueryMigrateAdImagePathUsingGetArgs');
      expect(getArgsStringFromOperationId('deleteCustomerUsingDELETE', 'DELETE')).toBe('MutationDeleteCustomerUsingDeleteArgs');
    });

    test('indent', () => {
      expect(indent('a')).toBe('  a');
      expect(indent('a', 1)).toBe('  a');
      expect(indent('a', 2)).toBe('    a');
      expect(indent('a', 3)).toBe('      a');
      expect(indent(`
  function test() {
    const t = 3;
  }
      `.trim()))
      .toBe(`  function test() {
    const t = 3;
  }
      `.trimRight());
    });

    test('getRelativePath', () => {
      expect(getRelativePath('../api/Api.ts', '../api/types1.ts')).toBe('./types1');
      expect(getRelativePath('../api/Api.ts', '../types/types.ts')).toBe('../types/types');
      expect(getRelativePath('../api/Api.ts', '../types/index.ts')).toBe('../types');
      expect(getRelativePath('../api/Api.ts', '../types/index.ts')).toBe('../types');
      expect(getRelativePath('./api/Api.ts', './types/types.ts')).toBe('../types/types');
      expect(getRelativePath('./api/Api.ts', './a/types/types.ts')).toBe('../a/types/types');
      expect(getRelativePath('./a/api/Api.ts', './a/types/types.ts')).toBe('../types/types');
      expect(getRelativePath('./b/api/Api.ts', './a/types/types.ts')).toBe('../../a/types/types');
      expect(getRelativePath('../api/Api.ts', '../api/index.ts')).toBe('.');
      expect(getRelativePath('a/api/Api.ts', 'a/types/types.ts')).toBe('../types/types');
      expect(getRelativePath('b/c/api/Api.ts', 'a/types/types.ts')).toBe('../../../a/types/types');
    });

    test('getInstanceNameFromClass', () => {
      expect(getInstanceNameFromClass('AbcApi')).toBe('abcApi');
      expect(getInstanceNameFromClass('Car')).toBe('car');
      expect(getInstanceNameFromClass('Asdf')).toBe('asdf');
      try {
        getInstanceNameFromClass('');
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    test('checkUrlForm', () => {
      expect(checkUrlForm('http://naver.com')).toBeTruthy();
      expect(checkUrlForm('https://naver.com')).toBeTruthy();
      expect(checkUrlForm('http://localhost:3000')).toBeTruthy();
      expect(checkUrlForm('http://127.0.0.1')).toBeTruthy();
      expect(checkUrlForm('naver.com')).toBeFalsy();
      expect(checkUrlForm('localhost:3000')).toBeFalsy();
      expect(checkUrlForm('127.0.0.1')).toBeFalsy();
    });
});
