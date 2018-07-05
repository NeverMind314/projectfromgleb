'use strict';

const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');
const channelLink = require('./channelLink.model');

let channel = db.define('channel', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    signature: Sequelize.CHAR,
    name: Sequelize.CHAR,
    description: Sequelize.CHAR,
    channel_type_id: Sequelize.INTEGER
}, {
    freezeTableName: true
});

channel.hasMany(channelLink, {as: 'links', foreignKey: 'channel_id'});

module.exports = channel;