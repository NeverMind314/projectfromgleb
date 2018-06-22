'use strict';

const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');

module.exports = db.define('channel', {
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