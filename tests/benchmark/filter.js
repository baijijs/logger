/**
 * Use benchmarks for concurrent performance tests
 */
const Benchmark = require('benchmark');

const { filteringSensitiveInfo } = require('../../lib/filter');
const { println } = require('./common');

const suite = new Benchmark.Suite();

// test case

const message = {
  traceKey: 'serviceName',
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

const run = () => new Promise((resolve) => {
  println(' <--- Test benchmark of filter - begin ---> \n');
  suite
    .add('"filter password recursion:false"', () => {
      filteringSensitiveInfo(message, { recursion: false });
    })
    // .add('"filter password recursion:true"', () => {
    //   filteringSensitiveInfo(message, { recursion: true });
    // })
    .on('cycle', event => println(String(event.target)))
    .on('complete', function completeCallback() {
      println(`Fastest is ${this.filter('fastest').map('name')}`);
      println('\n <---  Test benchmark of filter - end ---> ');
      resolve();
    })
    .run({ async: true });
});

module.exports = run;
