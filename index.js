/**
 * A logger compoment for baiji
 */
const _ = require('lodash');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const {
  calcResponseTime,
  datetimeFormat,
  getIP,
  generateTraceId,
} = require('./lib/common');
const { filteringSensitiveInfo } = require('./lib/filter');

const { combine, label, printf } = format;

// ================ global define =============

// environment for this process
const ENV = process.env.NODE_ENV || 'development';

// get now time format
const getNowFormat = () => datetimeFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S');

// ================ winston customer component ===================

// customer format for winston
const customerPrintf = printf((info) => {
  const { message } = info;
  const formatMessage = typeof message === 'string' ? message : JSON.stringify(message);
  return `[${getNowFormat()}] [${info.level}] ${info.label} - ${formatMessage}`;
});
const customerFormat = traceKey => combine(label({ label: traceKey }), customerPrintf);

// console transport based on winston
const consoleTransport = () => new transports.Console();

/**
 * file transport based on winston
 * @param {object} opt config option
 * @param {object} opt.filename error log filepath
 * @param {object} opt.level the level for this logger
 */
const fileTransport = opt => new transports.File(opt);

/**
 * logs to a rotating file each day.
 * @param {object} opt logs files option
 */
const dailyRotateFileTransport = opt => new DailyRotateFile(opt);

// ================ initialization customer logger ===================

/**
 * the logger of level error
 * @param {object} option config option
 */
const errorLogger = (option) => {
  const { traceKey, baseDir, errorLoggerConfig } = option;
  return (opt = {}) => {
    Object.assign(opt, errorLoggerConfig);
    const level = _.get(opt, 'level', 'error');
    const filepath = _.get(opt, 'filepath', `/${ENV}_${level}.log`);
    return createLogger({
      level,
      format: _.get(opt, 'format', customerFormat(traceKey)),
      transports: _.get(opt, 'transports', [
        consoleTransport(),
        fileTransport({
          filename: path.join(baseDir, filepath),
          level,
          maxFiles: _.get(opt, 'maxFiles', 5),
          maxSize: _.get(opt, 'maxSize', '10m'),
          zippedArchive: _.get(opt, 'zippedArchive', true),
        }),
      ]),
    });
  };
};

/**
 * the logger of level debug
 * @param {object} option config option
 */
const debugLogger = (option) => {
  const { traceKey, errorLoggerConfig } = option;
  return (opt = {}) => {
    Object.assign(opt, errorLoggerConfig);
    const level = _.get(opt, 'level', 'debug');
    return createLogger({
      level,
      format: _.get(opt, 'format', customerFormat(traceKey)),
      transports: _.get(opt, 'transports', [consoleTransport()]),
    });
  };
};

/**
 * the logger of level info
 * @param {object} option config option
 */
const infoLogger = (option) => {
  const { traceKey, baseDir, infoLoggerConfig } = option;
  return (opt = {}) => {
    Object.assign(opt, infoLoggerConfig);
    const level = _.get(opt, 'level', 'info');
    const filepath = _.get(opt, 'filepath', `/${level}/${ENV}_${level}_%DATE%.log`);
    return createLogger({
      level,
      format: _.get(opt, 'format', customerFormat(traceKey)),
      transports: _.get(opt, 'transports', [
        consoleTransport(),
        dailyRotateFileTransport({
          filename: path.join(baseDir, filepath),
          datePattern: _.get(opt, 'datePattern', 'YYYY-MM-DD'),
          zippedArchive: _.get(opt, 'zippedArchive', true),
          maxSize: _.get(opt, 'maxSize', '10m'),
          maxFiles: _.get(opt, 'maxFiles', '7d'),
        }),
      ]),
    });
  };
};

/**
 * access logger based on info logger
 * @param {object} option config option
 */
const accessLogger = (option) => {
  const { traceKey } = option;
  const infoLoggerInstance = infoLogger(option);
  return (opt) => {
    const logger = infoLoggerInstance({
      level: 'info',
      filepath: `/access/${ENV}_access_%DATE%.log`,
      maxFiles: '14d',
    });
    const aco = Object.assign({
      body: 'req.body',
      method: 'req.method',
      query: 'req.query',
      remoteIP: 'req',
      statusCode: 'res.statusCode',
      traceId: 'req.headers.traceId',
      url: 'req.originalUrl',
      user: 'req.user',
      userAgent: 'req.userAgent',
    }, opt);
    return (...args) => {
      let req;
      let res;
      let next;
      if (args.length === 3) {
        [req, res, next] = args;
      } else if (args.length === 2) {
        [{ req, res }, next] = args;
      } else {
        console.error(new Error('Access logger only support 2 or 3 arguments'));
        return;
      }
      const ctx = { req, res };
      ctx.logged = false;
      /**
       * The process.hrtime() method returns the current high-resolution real time in a [seconds, nanoseconds] tuple Array,
       * where nanoseconds is the remaining part of the real time that can't be represented in second precision.
       * @see {@link https://nodejs.org/api/process.html#process_process_hrtime_time}
       */
      const startedAt = process.hrtime(); // get hrtime
      const remoteIP = _.get(ctx, aco.remoteIP);
      const traceId = `${_.get(ctx, aco.traceId, _.get(option, 'generateTraceId', generateTraceId)())}-${traceKey}`;
      const method = _.get(ctx, aco.method, 'GET').toUpperCase();
      const remoteAddr = remoteIP ? getIP(remoteIP) : '0.0.0.0'; // get remote address
      const log = {
        'trace-key': traceKey,
        method,
        params: Object.assign({}, _.get(ctx, aco.query, {}), _.get(ctx, aco.body, {})), // assign query and body params
        'remote-addr': remoteAddr,
        'requested-at': getNowFormat(),
        'requested-timestamp': _.now(),
        'trace-id': traceId,
        url: decodeURI(_.get(ctx, aco.url, '/')),
        'remote-user': _.get(ctx, aco.user, {}),
        'user-agent': _.get(ctx, aco.userAgent, ''),
      };
      /**
       * response callback function
       */
      const responseCallback = () => {
        if(!ctx.logged){
          ctx.logged = true;
          Object.assign(log, {
            'responded-at': getNowFormat(),
            'response-time': calcResponseTime(startedAt),
            status: _.get(ctx, aco.statusCode, 200),
          });
          // call logger log record after filtering sensitive
          logger.info(filteringSensitiveInfo(log, option.filter));
        }
      };
      ctx.remoteAddr = remoteAddr; // add remote address to context
      // add once linstener for response
      ctx.res.once('finish', responseCallback);
      ctx.res.once('close', responseCallback);
      next();
    };
  };
};

/**
 * Init baijiLogger
 * @see README.md for option description
 */
const baijiLogger = option => ({
  accessLogger: accessLogger(option),
  error: errorLogger(option),
  debug: debugLogger(option),
  info: infoLogger(option),
});

module.exports = baijiLogger;
