'use strict';

const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');

module.exports = db.define('channel_type', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.CHAR,
}, {
    freezeTableName: true
});