# baiji-logger

A logger compoment for Baiji

# Menu

<!-- TOC depthFrom:2 -->

- [1. Installation](#1-installation)
- [2. Usage](#2-usage)
- [3. Description](#3-description)
    - [3.1. classify & rotate](#31-classify--rotate)
- [4. Options](#4-options)
    - [4.1. Detail Case](#41-detail-case)
- [5. TODO list](#5-todo-list)
- [6. Contribution Step](#6-contribution-step)
- [7. Run Tests](#7-run-tests)
    - [7.1. Unit Test](#71-unit-test)
    - [7.2. Benchmark Test](#72-benchmark-test)

<!-- /TOC -->

## 1. Installation

`NodeJS version >= 8.12.0`

```shell
yarn add baiji-logger
# OR
npm install baiji-logger -S
```

## 2. Usage

> See details from [./test/app/index.js](./test/app/index.js)

```JavaScript
// require
const baiji = require('baiji');
const path = require('path');
const baijiLogger = require('baiji-logger');
// define
const { accessLogger, error, info, debug } = baijiLogger({
  traceKey: 'serviceName',
  baseDir: path.join(__dirname, './logs'),
});
const infoLogger = info();
const errorLogger = error();
const debugLogger = debug();
// use case
const app = baiji('serviceName');
app.use(accessLogger()); // Add accessLogger for routes
// app.use(UsersCtrl); // Use controller
// Start app and listen on port 3000
app.listen(3000, () => infoLogger.info('Port : 3000'));
```

## 3. Description

> Based on [winstonjs/winston][]

### 3.1. classify & rotate

| classify | instance     | env      | transport          | rotate          |
| -------- | ------------ | -------- | ------------------ | --------------- |
| error    | errorLogger  | *        | error.log          | File            |
| *warning |              | *        | warning.log        | File            |
| info     | infoLogger   | *        | app.log            | File            |
|          | accessLogger | *        | access.log+Console | DailyRotateFile |
| *verbose |              | dev/test | debug.log+Console  | File            |
| debug    | debugLogger  | dev      | Console            |                 |
| *silly   |              | dev      | Console            |                 |

- warning/verbose/silly , not yet developed

## 4. Options

**Description**

- | `option`          |
- | `.filter`       | means `option.filter`
- | `-filterKeys` | means `options.filter.filterKeys`

---

| param                | type            | default                                         | desc                                                                          |
| -------------------- | --------------- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| `option`             | object          | -                                               | The option for baijiLogger                                                    |
| `.traceKey`          | string          | -                                               | The unique key for this app , be used for traceId                             |
| `.baseDir`           | string          | -                                               | The base direction path for logs                                              |
| `.filter`            | *               | `false`                                         | Sensitive information filtering and replace                                   |
| `-filterKeys`        | array           | `['password', 'token', 'authorization']`        | Filter keys array list                                                        |
| `-recursion`         | boolean         | `false`                                         | Is recursion                                                                  |
| `-replaceChat`       | string/function | `'*'`                                           | Replace chat or function                                                      |
| `.generateTraceId`   | function        | `${timestamp}-${shortid}-${traceKey}`           | The function for generate trace id                                            |
| `.errorLoggerConfig` | object          | -                                               | The configuration for error logger                                            |
| `-filepath`          | string          | `/${ENV}_${level}.log`                          | Used by path.join(baseDir,filepath)                                           |
| `-format`            | function        | `[${timeFormat}] [${level}] ${label} - ${json}` | A string representing the [moment.js date format][] to be used for rotating.  |
| `-level`             | string          | `error`                                         | Log only if info.level less than or equal to this level                       |
| `-maxFiles`          | number          | `5`                                             | Maximum number of logs to keep.                                               |
| `-maxSize`           | string          | `10m`                                           | Maximum size of the file after which it will rotate.                          |
| `-transports`        | array           | `[ transports.Console , DailyRotateFile ]`      | [Winston Transports][]                                                        |
| `-zippedArchive`     | boolean         | `true`                                          | A boolean to define whether or not to gzip archived log files.                |
| `.infoLoggerConfig`  | object          | -                                               | The configuration for info logger                                             |
| `-datePattern`       | string          | `YYYY-MM-DD`                                    | ↑                                                                             |
| `-filepath`          | string          | `/${level}/${ENV}_${level}_%DATE%.log`          | ↑                                                                             |
| `-format`            | function        | `[${timeFormat}] [${level}] ${label} - ${json}` | ↑                                                                             |
| `-level`             | string          | `info`                                          | ↑                                                                             |
| `-maxFiles`          | string          | `7d`                                            | ↑                                                                             |
| `-maxSize`           | string          | `10m`                                           | ↑                                                                             |
| `-transports`        | array           | `[ transports.Console , DailyRotateFile ]`      | ↑                                                                             |
| `-zippedArchive`     | boolean         | `true`                                          | ↑                                                                             |
| `.accessLogger`      | object          | -                                               | The configuration for access logger , when requested to get the corresponding |
| `-body`              | string          | `ctx.req.body`                                  | Post method params                                                            |
| `-method`            | string          | `ctx.req.method`                                | Http request method name                                                      |
| `-query`             | string          | `ctx.req.query`                                 | Get method params                                                             |
| `-remoteIP`          | string          | -                                               | Get remote ip even though proxy by nginx , see [common >> getIP function][]   |
| `-statusCode`        | string          | `ctx.res.statusCode`                            | Http response statusCode                                                      |
| `-traceId`           | string          | `${timestamp}-${shortid}`                       | Trace id of full process log                                                  |
| `-url`               | string          | `ctx.req.originalUrl`                           | Http request url                                                              |
| `-user`              | string          | `ctx.req.user`                                  | Remote user info                                                              |
| `.debugLoggerConfig` | object          | -                                               | The configuration for debug logger                                            |
| `-format`            | function        | `[${timeFormat}] [${level}] ${label} - ${json}` | ↑                                                                             |
| `-level`             | string          | `debug`                                         | ↑                                                                             |
| `-transports`        | array           | `[ transports.Console ]`                        | ↑                                                                             |

### 4.1. Detail Case

- `option.filter.recursion`
  **not yet developed**.
  Is recursion. In case `{"body":{"password":{"a":1}}}` , if `true` will be `{"body":{"password":{"a":"*"}}}` ; else , will be `{"body":{"password":"*"}}` .
- `option.filter.replaceChat`
  **not yet developed**.
  only support String type.
  
## 5. TODO list

- [ ] Ensure number of log file handles < 5
- [ ] Developing `warning/silly/verbose` classify
- [x] Concurrency test
- [ ] Improve the efficiency and concurrency of the `filter` function
- [ ] Refactor the `filter` function

## 6. Contribution Step

```shell
fork https://github.com/baijijs/logger.git
git clone <your own repository>
git branches <your own branch>
git checkout <your own branch>
yarn install -D
... something change
git cz
... step by step add commit with message
git push
pull request
```

## 7. Run Tests

Install development environment module .

```shell
yarn install -D
```

### 7.1. Unit Test

All of the logger test cases are written with `Jest`. They can be run with `npm` or `yarn`.

```shell
npm test
# OR
yarn test
```

### 7.2. Benchmark Test

Benchmark report log out to `./docs/benchmark.report.log` .

> Based on [bestiejs/benchmark.js][]

```shell
npm run dev-filter
npm run dev-filter-false
npm run benchmark
```

---

[winstonjs/winston]: https://github.com/winstonjs/winston
[Winston Transports]: https://github.com/winstonjs/winston/blob/master/docs/transports.md#winston-core
[bestiejs/benchmark.js]: https://github.com/bestiejs/benchmark.js
[moment.js date format]: http://momentjs.com/docs/#/displaying/format/
[common >> getIP function]: ./lib/common.js