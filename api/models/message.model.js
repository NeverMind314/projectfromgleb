'use strict';

const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');
const media = require('./media.model')

let message = db.define('message', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    channel_id: Sequelize.INTEGER,
    user_id: Sequelize.INTEGER,
    signature: Sequelize.CHAR,
    post_dt: Sequelize.DATE,
    views_count: Sequelize.INTEGER,
    message: Sequelize.TEXT
}, {
    freezeTableName: true
});

message.hasOne(media, {as: 'media', foreignKey: 'message_id'});

module.exports = message;