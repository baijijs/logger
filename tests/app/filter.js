/**
 * Configure filter parameters to start the server
 */
/* eslint-disable class-methods-use-this */

const baiji = require('baiji');
const path = require('path');

const baijiLogger = require('../../index');

const APP_KEY = 'filterService';
const PORT = 3000;

const { accessLogger, info, debug } = baijiLogger({
  traceKey: APP_KEY,
  baseDir: path.join(__dirname, './logs'),
  filter: {
    filterKeys: ['password', 'token'],
    replaceChat: '*',
  },
});

const infoLogger = info();
const debugLogger = debug();

const app = baiji(APP_KEY);

class UsersCtrl extends baiji.Controller {
  initConfig() {
    return {
      filter: {
        description: 'test for filter',
        route: { path: '/filter', verb: 'post' },
      },
    };
  }
  filter(ctx, next) {
    const { req: { body } } = ctx;
    debugLogger.debug(`req.body:${JSON.stringify(body)}`);
    return ctx.respond({ data: true, message: 'OK' }, next);
  }
}

app.use(accessLogger());

// Use controller
app.use(UsersCtrl);

// Start app and listen on port ${PORT}
app.listen(PORT, () => infoLogger.info(`Port : ${PORT}`));
