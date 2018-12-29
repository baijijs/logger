/* eslint-disable class-methods-use-this */

const baiji = require('baiji');
const path = require('path');

const baijiLogger = require('../../index');

const {
  accessLogger,
  error,
  info,
  debug,
} = baijiLogger({
  appkey: 'serviceName',
  baseDir: path.join(__dirname, './logs'),
});

const infoLogger = info();
const errorLogger = error();
const debugLogger = debug();

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
        route: {
          path: '/',
          verb: 'get',
        },
      },
    };
  }
  signInRequired(ctx, next) {
    const token = ctx
      .req
      .get('authorization');
    debugLogger.info(token);
    debugLogger.error(token);
    if (token) {
      return next();
    }
    const err = new Error('Unauthorized');
    errorLogger.error(err);
    ctx.status(401);
    return ctx.respond({ err });
  }
  search(ctx, next) {
    return ctx.respond([{
      username: 'serviceName',
      gender: 1,
    }], next);
  }
}

app.use(accessLogger());

// Use controller
app.use(UsersCtrl);

// Start app and listen on port 3000
app.listen(3000, () => infoLogger.info('Port : 3000'));
