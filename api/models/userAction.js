'use strict';

const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');

module.exports = db.define('user_action', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    action_dt: Sequelize.DATE,
    action: Sequelize.CHAR,
}, {
    freezeTableName: true
});