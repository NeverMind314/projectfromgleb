'use strict'


const Sequelize = require('sequelize');
const db = require('./config/dbConfig');
const channelLink = require('./api/models/channelLink.model');
const channelQueue = require('./api/models/channelQueue.model');
const channelType = require('./api/models/channelType.model');
const mediaType = require('./api/models/mediaType.model');
const UserAction = require('./api/models/userAction.model');
const userChannel = require('./api/models/userChannel.model');

class Installer {
    async install () {
        let newChannel = db.define('channel', {
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
        let newMedia = db.define('media', {
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
        let newMessage = db.define('message', {
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
        let newUserModel = db.define('user', {
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

        await  channelType.sync({force: true})
        .then(() => {
            return [channelType.create({
                name: 'group'
            }),
            channelType.create({
                name: 'supergroup'
            }),
            channelType.create({
                name: 'channel'
            })];
        });
        await  mediaType.sync({force: true})
        .then(() => {
            return [mediaType.create({
                name: 'photo'
            }),
            mediaType.create({
                name: 'video'
            }),
            mediaType.create({
                name: 'audio'
            })] 
        })
        await newMedia.sync({force: true});
        await newMessage.sync({force: true});
        await newUserModel.sync({force: true});
        await UserAction.sync({force: true});
        await userChannel.sync({force: true});
        await newChannel.sync({force: true});
        await channelLink.sync({force: true});
        await channelQueue.sync({force: true});
    }
}

let installer = new Installer;
installer.install();
console.log('successfully created');
process.exit(0);