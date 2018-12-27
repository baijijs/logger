# baiji-logger

A logger compoment for Baiji

Menu

<!-- TOC -->

- [1. Installation](#1-installation)
- [2. Use Case](#2-use-case)
- [3. Description](#3-description)
    - [3.1. classify & rotate](#31-classify--rotate)
- [4. Options](#4-options)
    - [4.1. `opton.filter`](#41-optonfilter)
- [5. TODO list](#5-todo-list)

<!-- /TOC -->

## 1. Installation

```shell
yarn add baiji-logger
# OR
npm install baiji-logger -S
```

## 2. Use Case

> See [./test/app/index.js](./test/app/index.js)

```JavaScript
// require
const baiji = require('baiji');
const path = require('path');
const baijiLogger = require('baiji-logger');
// define
const { accessLogger, error, info, debug } = baijiLogger({
  appkey: 'serviceName',
  baseDir: path.join(__dirname, './logs'),
});
const infoLogger = info();
const errorLogger = error();
const debugLogger = debug();
// use case
const app = baiji('serviceName');

class UsersCtrl extends baiji.Controller {
  constructor() {
    super();
    // Use before actions
    this.beforeAction('signInRequired');
  }
  initConfig() {
    return {
      search: {
        description: 'Search users...',
        route: { path: '/', verb: 'get' },
      },
    };
  }
  signInRequired(ctx, next) {
    const token = ctx.req.get('authorization');
    debugLogger.info(token);
    debugLogger.error(token);
    if (token) {
      return next();
    }
    const err = new Error('Unauthorized');
    ctx.status(401);
    errorLogger.error(err);
    return ctx.respond({ err });
  }
  search(ctx, next) {
    return ctx.respond([{ username: 'serviceName', gender: 1 }], next);
  }
}
app.use(accessLogger());
app.use(UsersCtrl); // Use controller
// Start app and listen on port 3000
app.listen(3000, () => infoLogger.info('Port : 3000'));
```

## 3. Description

Based on [winstonjs/winston][]

### 3.1. classify & rotate

| classify | instance     | env      | transport          | rotate          |
| -------- | ------------ | -------- | ------------------ | --------------- |
| error    | errorLogger  | *        | error.log          | File            |
| *warning |              | *        | warning.log        | File            |
| info     | infoLogger   | *        | app.log            | File            |
|          | accessLogger | *        | access.log+Console | DailyRotateFile |
| *verbose |              | dev/test | debug.log+Console  | File            |
| debug    | debugLogger  | dev      | Console            |                 |
| *silly   |              | dev      |                    |                 |

- verbose and silly is not yet developed

## 4. Options

| param                              | type     | default                       | desc                                                                |
| ---------------------------------- | -------- | ----------------------------- | ------------------------------------------------------------------- |
| `option`                           | object   | -                             | the option for baijiLogger                                          |
| `option.appkey`                    | string   | -                             | the unique key for this app , be used for traceId                   |
| `option.baseDir`                   | string   | -                             | the base direction path for logs                                    |
| `option.filter`                    | *        | -                             | sensitive information filtering , examples : password/authorization |
| `option.generateTraceId`           | function |                               | the function for generate trace id                                  |
| `option.errorLoggerConfig`         | object   |                               | the config for error logger                                         |
| `option.infoLoggerConfig`          | object   |                               | the config for info logger                                          |
| `infoLoggerConfig.level`           | string   |                               |                                                                     |
| `infoLoggerConfig.format`          | function |                               |                                                                     |
| `infoLoggerConfig.transports`      |          |                               |                                                                     |
| `infoLoggerConfig.filepath`        |          |                               | used by path.join(baseDir,filepath)                                 |
| `infoLoggerConfig.datePattern`     |          |                               |                                                                     |
| `infoLoggerConfig.zippedArchive`   |          |                               |                                                                     |
| `infoLoggerConfig.maxSize`         |          |                               |                                                                     |
| `infoLoggerConfig.maxFiles`        |          |                               |                                                                     |
| `option.accessLogger`              | object   |                               |                                                                     |
| `accessLogger.body`                | string   | ctx.req.body                  | post method params                                                  |
| `accessLogger.method`              | string   | ctx.req.method                | http request method name                                            |
| `accessLogger.query`               | string   | ctx.req.query                 | get method params                                                   |
| `accessLogger.remoteIP`            | string   |                               | remote ip address , @see common >> getIp function                   |
| `accessLogger.statusCode`          | string   | ctx.res.statusCode            | http response statusCode                                            |
| `accessLogger.traceId`             | string   | `${timestamp}-${shortid}`     | trace id of full process log                                        |
| `accessLogger.url`                 | string   | ctx.req.originalUrl           | http request url                                                    |
| `accessLogger.user`                | string   | ctx.req.user                  | remote user info                                                    |
| `option.debugLoggerConfig`         | object   |                               | the config for debug logger                                         |
| `debugLoggerConfig.filepath`       | string   | `${baseDir}/${env}_error.log` | logger log filepath , the filepath must be exists                   |
| `debugLoggerConfig.level`          | string   |                               |                                                                     |
| `debugLoggerConfig.maxFiles`       | number   | 5                             |                                                                     |
| `debugLoggerConfig.maxSize`        | string   | 10m                           |                                                                     |
| `debugLoggerConfig.zippedArchive ` | boolean  | true                          |                                                                     |

### 4.1. `opton.filter`

```JavaScript
```

## 5. TODO list

- [ ] Ensure number of file handles < 5
- [ ] Filtering sensitive information
- [ ] developing silly & verbose classify

---

[winstonjs/winston]: https://github.com/winstonjs/winston