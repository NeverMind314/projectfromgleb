'use strict';

const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');

module.exports = db.define('account', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.CHAR,
    login: Sequelize.CHAR,
    phone: Sequelize.CHAR
}, {
    freezeTableName: true
});