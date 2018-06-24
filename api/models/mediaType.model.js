'use strict';

const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');
const media = require('./media.model')

let mediaType = db.define('media_type', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.CHAR,
}, {
    freezeTableName: true
});

module.exports = mediaType;