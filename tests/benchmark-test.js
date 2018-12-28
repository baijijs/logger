/**
 * Use benchmarks for concurrent performance tests
 */
const Benchmark = require('benchmark');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { filteringSensitiveInfo } = require('../lib/filter');

const suite = new Benchmark.Suite();

const filePath = path.join(__dirname, '../docs/benchmark.report.log');

const println = (message) => {
  console.info(message);
  fs.appendFileSync(filePath, `${typeof message === 'string' ? message : JSON.stringify(message)}\n`);
};

fs.unlinkSync(filePath);
println(' --- CPUs ---');
println(os.cpus());

// test case

const message = {
  appkey: 'serviceName',
  body: { password: '123456', token: 'abcdefghijklmn' },
  body1: { password: { original: '123456', change: '123456789' } },
  method: 'GET',
  query: {},
  'remote-addr': '127.0.0.1',
  'requested-at': '2018-12-28 11:11:01.678',
  'requested-timestamp': 1545966661679,
  'trace-id': '1545966661677-EZLX3aLHF-serviceName',
  url: '/',
  'remote-user': {},
  'user-agent': '',
  'responded-at': '2018-12-28 11:11:01.685',
  'response-time': '8.043ms',
  status: 404,
};

suite
  .add('[filter password recursion:false]', () => {
    filteringSensitiveInfo(message, { recursion: false });
  })
  // .add('[filter password recursion:true]', () => {
  //   filteringSensitiveInfo(message, { recursion: true });
  // })
  .on('cycle', event => println(String(event.target)))
  .on('complete', function completeCallback() {
    println(`Fastest is [${this.filter('fastest').map('name')}]`);
  })
  .run({ async: true });
