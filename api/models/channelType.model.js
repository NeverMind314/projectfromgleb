'use strict';

const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');

let channelType = db.define('channel_type', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.CHAR,
}, {
    freezeTableName: true
});

module.exports = channelType;