/**
 * test for filter
 */

/* eslint-disable no-undef */

const { filteringSensitiveInfo } = require('../lib/filter');

const addTestCase = (message, option, expectResult) => {
  test(JSON.stringify(message), () => {
    const result = filteringSensitiveInfo(message, option);
    expect(result).toEqual(expectResult);
  });
};

// usage case
const messageOriginal = {
  body: { password: '123456', token: 'abcdefghijklmn' },
  body1: { password: { original: '123456', change: '123456789' } },
};

const messageResult = {
  body: { password: '*', token: '*' },
  body1: { password: '*' },
};

// addTestCase({ password: 1 }, { filterKeys: ['password'], recursion: false }, { password: '*' });
// addTestCase({ password: 12 }, { filterKeys: ['password'], recursion: false }, { password: '**' });
// addTestCase({ password: '1' }, { filterKeys: ['password'], recursion: false }, { password: '*' });
// addTestCase({ password: '12' }, { filterKeys: ['password'], recursion: false }, { password: '**' });
// addTestCase({ password: [1, 2, 3] }, { filterKeys: ['password'], recursion: false }, { password: ['*', '*', '*'] });
// addTestCase({ password: { a: 1 } }, { filterKeys: ['password'], recursion: false }, { password: { a: '*' } });
// addTestCase({ password: { a: 12 } }, { filterKeys: ['password'], recursion: false }, { password: { a: '**' } });
// addTestCase({ password: { a: '1' } }, { filterKeys: ['password'], recursion: false }, { password: { a: '*' } });
// addTestCase({ password: { a: 'abc' } }, { filterKeys: ['password'], recursion: false }, { password: { a: '***' } });
// addTestCase({ password: { a: { b: 1 } } }, { filterKeys: ['password'], recursion: false }, { password: { a: { b: '*' } } });
// addTestCase(messageOriginal, { filterKeys: ['password', 'token'], recursion: false }, messageResult);

addTestCase({ password: 1 }, { filterKeys: ['password'], recursion: false }, { password: '*' });
addTestCase({ password: 12 }, { filterKeys: ['password'], recursion: false }, { password: '*' });
addTestCase({ password: '1' }, { filterKeys: ['password'], recursion: false }, { password: '*' });
addTestCase({ password: '12' }, { filterKeys: ['password'], recursion: false }, { password: '*' });
addTestCase({ password: [1, 2, 3] }, { filterKeys: ['password'], recursion: false }, { password: '*' });
addTestCase({ password: { a: 1 } }, { filterKeys: ['password'], recursion: false }, { password: '*' });
addTestCase({ password: { a: 12 } }, { filterKeys: ['password'], recursion: false }, { password: '*' });
addTestCase({ password: { a: '1' } }, { filterKeys: ['password'], recursion: false }, { password: '*' });
addTestCase({ password: { a: 'abc' } }, { filterKeys: ['password'], recursion: false }, { password: '*' });
addTestCase({ password: { a: { b: 1 } } }, { filterKeys: ['password'], recursion: false }, { password: '*' });
addTestCase(messageOriginal, { filterKeys: ['password', 'token'], recursion: false }, messageResult);
