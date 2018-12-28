/**
 * test for replace
 */

/* eslint-disable no-undef,max-len */

const resource = {
  url: '/a/b?c=1',
  password: 2,
  token: 'abcd1234-232dfdsa3',
  method: 'get',
};
const expectResult = {
  url: '/a/b?c=1',
  password: '*',
  token: '*',
  method: 'get',
};
const keys = ['password', 'token'];

const equal = (source, result) => {
  test(JSON.stringify(source), () => {
    expect(result).toEqual(expectResult);
  });
};

// const str = JSON.stringify(json);
// const reg = new RegExp(`"(${keys.join('|')})":(.*)`, 'ig');

// console.info(str, reg);
// console.info(str.match(reg));

const json = JSON.parse(JSON.stringify(resource));

// eslint-disable-next-line no-param-reassign
equal(resource, Object.assign(json, Object.keys(json).filter(key => keys.indexOf(key) !== -1).reduce((obj, key) => { obj[key] = '*'; return obj; }, {})));


const result = JSON.parse(JSON.stringify(resource));

// eslint-disable-next-line no-return-assign
Object.keys(result).forEach(key => (keys.indexOf(key) !== -1 ? result[key] = '*' : ''));
equal(resource, result);
