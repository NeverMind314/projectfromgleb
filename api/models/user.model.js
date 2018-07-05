'use strict';

const userChannelModel = require('./userChannel.model');
const Sequelize = require('sequelize');
const db = require('../../config/dbConfig');

let userModel = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.CHAR,
    login: Sequelize.CHAR,
}, {
    freezeTableName: true
});

userModel.hasOne(userChannelModel, {as: 'channelBind', foreignKey: 'user_id'});

module.exports = userModel;