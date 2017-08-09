var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'sqsc-demo-app'
    },
    port: process.env.PORT || 3000,

    db: 'sqlite://localhost/sqsc-demo-app'
  },

  test: {
    root: rootPath,
    app: {
      name: 'sqsc-demo-app'
    },
    port: process.env.PORT || 3000,
    db: 'sqlite://localhost/sqsc-demo-app-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'sqsc-demo-app'
    },
    port: process.env.PORT || 3000,
    db: 'postgres://' +
      process.env.DB_USER + ':' + process.env.DB_PASSWORD +
      '@' + process.env.DB_HOST + ':5432' +
      '/' + process.env.DB_DATABASE
  }
};

module.exports = config[env];
