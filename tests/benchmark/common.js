/**
 * common method for benchmark test
 */

const fs = require('fs');
const path = require('path');

const { version } = require('../../package.json');
const filePath = path.join(__dirname, `../../docs/report/filter.benchmark.${version}.log`);

const println = (message) => {
  console.info(message);
  fs.appendFileSync(filePath, `${typeof message === 'string' ? message : JSON.stringify(message)}\n`);
};

module.exports = {
  filePath,
  println,
};