/**
 *  common method
 */

const shortid = require('shortid');

/**
 * calculate response time
 * @param {Array} startedAt
 * @return {string}
 */
const calcResponseTime = (startedAt) => {
  const diff = process.hrtime(startedAt);
  // conversion of seconds and nanoseconds to milliseconds , preservation of 3 decimal places
  return `${((diff[0] * 1e3) + (diff[1] * 1e-6)).toFixed(3)}ms`;
};

/**
 * date time format function
 * @param {Date}        defaultDate        date time
 * @param {string}      defaultFormat      format string
 * @return {*}
 */
const datetimeFormat = (defaultDate, defaultFormat = 'yyyy-MM-dd hh:mm:ss.S') => {
  let date = defaultDate;
  let format = defaultFormat;
  if (!(date instanceof Date)) {
    date = new Date();
  }
  const o = {
    'M+': date.getMonth() + 1, // month
    'd+': date.getDate(), // day
    'h+': date.getHours(), // hour
    'm+': date.getMinutes(), // minute
    's+': date.getSeconds(), // second
    'w+': date.getDay(), // week
    'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
    S: date.getMilliseconds(), // millisecond
  };
  if (/(y+)/.test(format)) { // year
    format = format.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  const keys = Object.keys(o);
  for (let i = 0, len = keys.length; i < len; i += 1) {
    const k = keys[i];
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr((`${o[k]}`).length));
    }
  }
  return format;
};


// set shortid characters
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$&');
/**
 * generate trace id
 */
const generateTraceId = () => `${new Date().getTime()}-${shortid.generate()}`;

/**
 * get remote ip even though proxy by nginx
 * @param {object} req request object
 * @return {string}
 */
const getIP = (req) => {
  let ip = req.get('x-forwarded-for'); // get ip befor proxy
  if (ip && ip.split(',').length > 0) {
    const ipArr = ip.split(',');
    if (ipArr.length > 0) {
      [ip] = ipArr;
    } else {
      ip = '0.0.0.0';
    }
  } else {
    ip = req.connection.remoteAddress;
  }
  if (!ip) { // unable to get ip address
    return '0.0.0.0';
  }
  const ipArr = ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g);
  return ipArr && ipArr.length > 0 ? ipArr[0] : '127.0.0.1';
};

module.exports = {
  calcResponseTime,
  datetimeFormat,
  getIP,
  generateTraceId,
};
