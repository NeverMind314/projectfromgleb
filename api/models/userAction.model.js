'use strict';

const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');

let userAction = db.define('user_action', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: Sequelize.INTEGER,
    channel_id: Sequelize.INTEGER,
    action: Sequelize.CHAR,
    action_dt: Sequelize.DATE
}, {
    freezeTableName: true
});

module.exports = userAction;