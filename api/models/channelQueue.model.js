'use strict';

const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');

let channelQueue = db.define('channel_queue', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    link: Sequelize.CHAR,
}, {
    freezeTableName: true
});

module.exports = channelQueue;