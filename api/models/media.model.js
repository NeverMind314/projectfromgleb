'use strict';

const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');
const mediaType = require('./mediaType.model')

let media = db.define('media', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    message_id: Sequelize.INTEGER,
    type_id: Sequelize.INTEGER,
    content_id: Sequelize.CHAR,
    caption: Sequelize.CHAR
}, {
    freezeTableName: true
});

media.hasOne(mediaType, {as: 'mediaType', foreignKey: 'id'})

module.exports = media;