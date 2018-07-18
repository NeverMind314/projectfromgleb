'use strict';

const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');

let channelUsers = db.define('channel_users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    channel_id: Sequelize.INTEGER,
    user_count: Sequelize.INTEGER,
    check_dt: Sequelize.DATE
}, {
    freezeTableName: true
});

module.exports = channelUsers;