const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: { name: 'sqsc-demo-app' },
    port: process.env.PORT || 3000,
    db: { dialect: 'sqlite'}
  },

  test: {
    root: rootPath,
    app: { name: 'sqsc-demo-app' },
    port: process.env.PORT || 3000,
    db: { dialect: 'sqlite' }
  },

  production: {
    root: rootPath,
    app: { name: 'sqsc-demo-app' },
    port: process.env.PORT || 3000,
    db: 'postgres://' +
      process.env.COMMON_DB_USER + ':' + process.env.COMMON_DB_PASSWORD +
      '@' + process.env.COMMON_DB_HOST + ':5432' +
      '/' + process.env.COMMON_DB_DATABASE
  }
};

module.exports = config[env];
