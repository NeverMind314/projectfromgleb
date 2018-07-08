'use strict';

const Sequelize = require('sequelize');
const crendetails = require('./dbCrendetails');

const db = new Sequelize(crendetails.database, crendetails.username, crendetails.password, {
    host: crendetails.host,
    port: crendetails.port,
    dialect: 'postgres',
    operatorsAliases: false,

    logging: false,

    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = db;