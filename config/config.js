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

    db: 'sqlite://user:localhost/app'
  },

  test: {
    root: rootPath,
    app: {
      name: 'sqsc-demo-app'
    },
    port: process.env.PORT || 3000,
    db: 'sqlite://user:localhost/app-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'sqsc-demo-app'
    },
    port: process.env.PORT || 3000,
    db: 'postgres://localhost/sqsc-demo-app-production'
  }
};

module.exports = config[env];
