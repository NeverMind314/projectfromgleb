'use strict';

const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');

module.exports = db.define('message', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    channel_id: Sequelize.INTEGER,
    user_id: Sequelize.INTEGER,
    post_dt: Sequelize.DATE,
    message: Sequelize.TEXT
}, {
    freezeTableName: true
});