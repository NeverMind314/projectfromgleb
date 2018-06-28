'use strict';

const Sequelize = require('sequelize');
// const db = new Sequelize('prisyazhnuk-andr_tgcrawler', 'prisyazhnuk-andr_tgcrawler', 'sTa7hJDRctm*', {
//   host: 'postgresql.prisyazhnuk-andr.myjino.ru',
//   dialect: 'postgres',
//   operatorsAliases: false,

//   logging: false,

//   pool: {
//     max: 7,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// });

const db = new Sequelize('postgres', 'postgres', 'root', {
    host: 'localhost',
    port: '5432',
    dialect: 'postgres',
    operatorsAliases: false,

    logging: false,

    pool: {
        max: 7,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});


// const db = new Sequelize('postgres', 'postgres', 'root', {
//   host: '0.tcp.ngrok.io',
//   port: 15311,
//   dialect: 'postgres',
//   operatorsAliases: false,

//   logging: false,

//   pool: {
//     max: 7,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// });

module.exports = db;

// {
//   "dbConfig": {
//     "database": "prisyazhnuk-andr_tgcrawler",
//     "username": "prisyazhnuk-andr_tgcrawler",
//     "password": "sTa7hJDRctm*",
//     "host": "postgresql.prisyazhnuk-andr.myjino.ru",
//     "dialect": "postgres",
//     "port": 5432,
//     "define": {
//       "timestamps": true
//     },
//     "operatorsAliases": false,
//     "pool": {
//       "max": 5,
//       "min": 0,
//       "acquire": 40000,
//       "idle": 40000,
//       "evict": 40000
//     }
//   }
// }