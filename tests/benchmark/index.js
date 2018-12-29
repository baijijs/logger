/**
 * run benchmark test
 */

const fs = require('fs');
const os = require('os');

const { filePath, println } = require('./common');

const exists = fs.existsSync(filePath);

if (exists) {
  fs.unlinkSync(filePath);
}

println(' <---  CPUs Info - begin  --->\n');
println(os.cpus());
println('\n <---  CPUs Info - end --->');

const filter = require('./filter');
const requestFilter = require('./request-filter');

async function run() {
  await filter();
  await requestFilter();
}

run()
  .then(() => console.info('--- √ Benchmark Completed √ ---'))
  .catch(console.error)
  .then(() => process.exit(0));
