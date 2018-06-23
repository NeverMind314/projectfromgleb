'use strict';

const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');
const channelType = require('./channelType.model');

let channel = db.define('channel', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.CHAR,
    link: Sequelize.CHAR,
    channel_type_id: Sequelize.INTEGER
}, {
    freezeTableName: true
});

channel.hasOne(channelType, {as: 'channelType', foreignKey: 'id'})

module.exports = channel;