const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'sqsc-demo-app'
    },
    port: process.env.PORT || 3000,
    db: {
      dialect: 'sqlite'
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'sqsc-demo-app'
    },
    port: process.env.PORT || 3000,
    db: {
      dialect: 'sqlite'
    }
  },

  production: {
    root: rootPath,
    app: {
      name: 'sqsc-demo-app'
    },
    port: process.env.PORT || 3000,
    db: {
      dialect: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.COMMON_DB_USERNAME,
      password: process.env.COMMON_DB_PASSWORD,
      database: process.env.COMMON_DB_NAME
    }
  }
};

module.exports = config[env];
