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

// addTestCase({ password: 1 }, { filterKeys: ['password'], recursion: true }, { password: '*' });
// addTestCase({ password: 12 }, { filterKeys: ['password'], recursion: true }, { password: '**' });
// addTestCase({ password: '1' }, { filterKeys: ['password'], recursion: true }, { password: '*' });
// addTestCase({ password: '12' }, { filterKeys: ['password'], recursion: true }, { password: '**' });
// addTestCase({ password: [1, 2, 3] }, { filterKeys: ['password'], recursion: true }, { password: ['*', '*', '*'] });
// addTestCase({ password: { a: 1 } }, { filterKeys: ['password'], recursion: true }, { password: { a: '*' } });
// addTestCase({ password: { a: 12 } }, { filterKeys: ['password'], recursion: true }, { password: { a: '**' } });
// addTestCase({ password: { a: '1' } }, { filterKeys: ['password'], recursion: true }, { password: { a: '*' } });
// addTestCase({ password: { a: 'abc' } }, { filterKeys: ['password'], recursion: true }, { password: { a: '***' } });
// addTestCase({ password: { a: { b: 1 } } }, { filterKeys: ['password'], recursion: true }, { password: { a: { b: '*' } } });

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
