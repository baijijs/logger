# baiji-logger

A logger compoment for Baiji

Menu

<!-- TOC -->

- [1. Installation](#1-installation)
- [2. Description](#2-description)
    - [2.1. 日志分级与回收](#21-日志分级与回收)
- [3. Options](#3-options)
- [4. TODO list](#4-todo-list)

<!-- /TOC -->

## 1. Installation

```shell
yarn add baiji-logger
# OR
npm install baiji-logger -S

# Use
const baijiLogger = require('baiji-logger');

const logger = baijiLogger();
```

## 2. Description

Based on [winstonjs/winston][]

### 2.1. classify & rotate

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

## 3. Options

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

### `opton.filter`

```JavaScript
```

## 4. TODO list

- [] Ensure number of file handles < 5
- [] Filtering sensitive information
- [] developing silly & verbose classify

---

[winstonjs/winston]: https://github.com/winstonjs/winston