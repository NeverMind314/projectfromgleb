'use strict';

const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');

let channelLinkModel = db.define('channel_link', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    channel_id: Sequelize.INTEGER,
    link: Sequelize.CHAR,
}, {
    freezeTableName: true
});

module.exports = channelLinkModel;