'use strict';

const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');

module.exports = db.define('user_channel', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: Sequelize.INTEGER,
    channel_id: Sequelize.INTEGER,
    user_action_id: Sequelize.INTEGER
}, {
    freezeTableName: true
});