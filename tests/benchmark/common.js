/**
 * common method for benchmark test
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../docs/report/filter.benchmark.log');

const println = (message) => {
  console.info(message);
  fs.appendFileSync(filePath, `${typeof message === 'string' ? message : JSON.stringify(message)}\n`);
};

module.exports = {
  filePath,
  println,
};
