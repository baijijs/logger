/**
 * Use benchmarks for concurrent performance tests
 */
const Benchmark = require('benchmark');

const request = require('request-promise');
const { println } = require('./common');

const suite = new Benchmark.Suite();

// test case

const data1 = { password: '123456', token: 'abcdefghijklmn' };
const data2 = { password: { original: '123456', change: '123456789' } };

// Shell: npm run dev-filter
const send1 = data =>
  (deferred) => {
    request('http://localhost:3000/users/filter', { method: 'post', data })
      .then(() => deferred.resolve());
  };

// Shell: npm run dev-filter-false
const send2 = data =>
  (deferred) => {
    request('http://localhost:3001/users/filter', { method: 'post', data })
      .then(() => deferred.resolve());
  };


println(' <--- Test benchmark of filter - begin ---> \n');
suite
  .add(`"request filter defer:true send:${JSON.stringify(data1)}"`, send1(data1), { defer: true })
  .add(`"request filter defer:true send:${JSON.stringify(data2)}"`, send1(data2), { defer: true })
  .add(`"request filter:false defer:true send:${JSON.stringify(data2)}"`, send2(data2), { defer: true })
  .add(`"request filter:false defer:true send:${JSON.stringify(data2)}"`, send2(data2), { defer: true })
  .on('cycle', event => println(String(event.target)))
  .on('complete', function completeCallback() {
    println(`Fastest is "${this.filter('fastest').map('name')}"`);
    println('\n <---  Test benchmark of filter - end ---> ');
  })
  .run({ async: true });
