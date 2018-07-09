'use strict'


const Sequelize = require('sequelize');
const db = require('./config/dbConfig');
// const newChannel = require('./api/models/channel.model');
// const newChannelLink = require('./api/models/channelLink.model');
// const newChannelQueue = require('./api/models/channelQueue.model');
// const newChannelType = require('./api/models/channelType.model');
// const newMedia = require('./api/models/media.model');
// const newMediaType = require('./api/models/mediaType.model');
// const newMessage = require('./api/models/message.model');
// const newUser = require('./api/models/user.model');
// const newUserAction = require('./api/models/userAction.model');
// const newUserChannel = require('./api/models/userChannel.model');

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
        let newUser = db.define('user', {
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
        let newMediaType = db.define('media_type', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: Sequelize.CHAR,
        }, {
            freezeTableName: true
        });
        let newUserAction = db.define('user_action', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: Sequelize.INTEGER,
            channel_id: Sequelize.INTEGER,
            action: Sequelize.CHAR,
            action_dt: Sequelize.DATE
        }, {
            freezeTableName: true
        });
        let newUserChannel = db.define('user_channel', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: Sequelize.INTEGER,
            channel_id: Sequelize.INTEGER,
        }, {
            freezeTableName: true
        });
        let newChannelLink = db.define('channel_link', {
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
        let newChannelQueue = db.define('channel_queue', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            link: Sequelize.CHAR,
        }, {
            freezeTableName: true
        });
        let newChannelType = db.define('channel_type', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: Sequelize.CHAR,
        }, {
            freezeTableName: true
        });
        await newMedia.sync({force: true});
        await newMessage.sync({force: true});
        await newChannel.sync({force: true});
        await newUser.sync({force: true});
        await newUserAction.sync({force: true});
        await newUserChannel.sync({force: true});
        await newChannelLink.sync({force: true});
        await newChannelQueue.sync({force: true});
        await newChannelType.sync({force: true})
        .then(() => {
            return [newChannelType.create({
                name: 'group'
            }),
            newChannelType.create({
                name: 'supergroup'
            }),
            newChannelType.create({
                name: 'channel'
            })];
        });
        await  newMediaType.sync({force: true})
        .then(() => {
            return [newMediaType.create({
                name: 'photo'
            }),
            newMediaType.create({
                name: 'video'
            }),
            newMediaType.create({
                name: 'audio'
            })]
        });
    }
}

let installer = new Installer;
installer.install()
.then(() => {
    console.log('successfully created');
    process.exit(0);
});