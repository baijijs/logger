/**
 * Filtering sensitive information
 */

const _ = require('lodash');

/**
 * reset option
 * @param {string|object|array} opt filter option
 * @param {array} filterKeys  filter keys
 * @param {string|function} replaceChat replace chat or function
 * @param {boolean} recursion whether recursive , true of false
 */
const setOption = (option) => {
  let filterKeys = ['password', 'token', 'authorization'];
  let replaceChat = '*';
  let recursion = false;
  if (option !== undefined) {
    if (typeof option === 'string') {
      filterKeys = [option];
    } else if (option instanceof Array && option.length > 0) {
      filterKeys = option.filter(item => typeof item === 'string');
    } else if (_.isPlainObject(option)) {
      const { filterKeys: fks, recursion: rcs, replaceChat: rpc } = option;
      recursion = !!rcs;
      if (fks instanceof Array && fks.length > 0) {
        filterKeys = fks.filter(item => typeof item === 'string');
      }
      if (typeof rpc === 'string' || typeof rpc === 'function') {
        replaceChat = rpc;
      }
    } else {
      console.error(new Error(`option.filter do not support ${typeof option} type !`));
    }
  }
  return { filterKeys, recursion, replaceChat };
};

/**
 * replace by replaceChat
 * @param {string} param content to replace
 * @param {string|function} replaceChat replace chat or function
 */
const replace = (param, replaceChat) => {
  if (typeof replaceChat === 'function') {
    return replaceChat(param);
  }
  return param.replace(/\S/g, '*');
};

/**
 * filter log message by option
 * @param {*} message logger message
 * @param {object} opt filter option
 * @param {boolean} hit hit the fileterkeys , default false
 */
const filter = (message, opt, hit = false) => {
  const result = message;
  const { filterKeys, recursion, replaceChat } = opt;
  if (recursion) {
    if (_.isPlainObject(result)) {
      Object.keys(result).forEach((key) => {
        if (hit || filterKeys.indexOf(key) > -1) {
          const param = result[key];
          result[key] = filter(param, opt, true);
        }
      });
      return result;
    } else if (typeof result === 'number') {
      return replace(result.toString(), replaceChat);
    } else if (result instanceof Array && result.length > 0) {
      return result.map(param => filter(param, opt, hit));
    }
    return replace(result, replaceChat);
  }
  // replace the value of hit key
  // eslint-disable-next-line no-return-assign
  Object.keys(result).forEach(key => (filterKeys.indexOf(key) !== -1 ? result[key] = replaceChat : ''));
  return result;
};

/**
 * filter sensitive information
 * @param {object} message log message
 * @param {*} option filter option
 */
const filteringSensitiveInfo = (message, option) => {
  if (typeof option === 'function') {
    return option(message);
  }
  return filter(message, setOption(option));
};

module.exports = {
  filteringSensitiveInfo,
  setOption,
};
