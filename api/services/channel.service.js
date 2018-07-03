'use strict';

const messageModel = require('../models/message.model');
const channelModel = require('../models/channel.model');
const mediaModel = require('../models/media.model');
const userModel = require('../models/user.model');
const userActionModel = require('../models/userAction.model');
const UserService = require('./user.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


class ChannelService {
    async addChannelHistory(channelHistory) {
        let channel = await this.addNewChannel(channelHistory);
        let userService = new UserService;
        for (let i = 0; i < channelHistory.history.length; i++) {
            let user = await userService.addNewUser(channelHistory.history[i].author);
            await userService.addNewUserChannel(user[0], channel[0]);
            let message = await this.addNewMessage(channel[0], user[0], channelHistory.history[i]);
            await userService.addUserActionWrite(channel[0], user[0], channelHistory.history[i]);
            if (i % 50 == 0) {
                console.log('New message saved', i);
            }
            if (mediaNotEmpty(channelHistory.history[i].media)) {
                await this.addNewMedia(channelHistory.history[i].media, message[0])
            }
        }
        await userService.addUserActionJoin(channel[0], channelHistory.users)
        await userService.addUserActionLeft(channel[0], channelHistory.users)

    }

    async addNewChannel(channel) {
        return await channelModel.findOrCreate({
            where: {
                signature: channel.signature
            },
            defaults: {
                channel_type_id: channel.type_id,
                link: channel.link,
                name: channel.name,
                description: channel.description
            }
        });
    }

    async addNewMessage(channel, user, message) {
        return await messageModel.findOrCreate({
            where: {
                signature: message.signature
            },
            defaults: {
                post_dt: message.date,
                channel_id: channel.id,
                user_id: user.id,
                views_count: +message.views_cnt || 0,
                message: message.text
            }
        })
    }

    async addNewMedia(mediaBlock, message) {
        let media = identifyMediaType(mediaBlock);
        return await mediaModel.findOrCreate({
            where: {
                content_id: media.type.content_id
            },
            defaults: {
                message_id: message.id,
                type_id: media.id,
                content_id: media.type.content_id,
                caption: media.type.caption || ''
            }
        })
    }

    async getChannelHistory(channelKey, startFrom) {
        let param = {};
        if (+channelKey) {
            param.id = channelKey;
        } else {
            param.link = channelKey;
        }
        let channel = await channelModel.findOne({
            where: param
        });

        if (!channel) {
            return new Error('No channel with such key')
        }

        let begin = startFrom.moreThan || startFrom.lessThan;

        if (+begin && begin > 0) {
            let message = await messageModel.findOne({
                where: {
                    channel_id: channel.id,
                    id: begin
                }
            });
            if (!message) {
                return new Error('No messages later than ' + begin);
            }
            begin = message.post_dt;
        }

        if (startFrom.moreThan) {
            let messages = await messageModel.findAll({
                include: ['media'],
                where: {
                    channel_id: channel.id,
                    post_dt: {
                        [Op.gte]: begin
                    }
                }
            });
            if (messages.length == 0) {
                return new Error('No messages later than ' + startFrom.moreThan)
            }
            return messages;
        }

        if (startFrom.lessThan) {
            let messages = await messageModel.findAll({
                include: ['media'],
                where: {
                    channel_id: channel.id,
                    post_dt: {
                        [Op.lte]: begin
                    }
                }
            });
            if (messages.length == 0) {
                return new Error('No messages earlier than ' + startFrom.lessThan)
            }
            return messages;
        }

        let messages = await messageModel.findAll({
            include: ['media'],
            where: {
                channel_id: channel.id
            }
        });

        return messages;
    }

    async getAllChannelUsers(channelKey) {
        let param = {};
        if (+channelKey) {
            param.id = channelKey;
        } else {
            param.link = channelKey;
        }
        let channel = await channelModel.findOne({
            where: param
        });

        if (!channel) {
            return new Error('No channel with such key')
        }

        let users = await userModel.findAll({
            include: ['channelBind']
        });

        let channelUsers = [];
        for (let i = 0; i < users.length; i++) {
            if (users[i].channelBind.channel_id === channel.id) {
                delete users[i].channelBind;
                channelUsers.push(users[i]);
            }
        }

        return channelUsers
    }

    async getActualChannelUsers(channelKey, atDate) {
        let param = {};
        if (+channelKey) {
            param.id = channelKey;
        } else {
            param.link = channelKey;
        }
        let channel = await channelModel.findOne({
            where: param
        });

        if (!channel) {
            return new Error('No channel with such key')
        }



        let users = await userModel.findAll({
            include: ['channelBind']
        });

        let channelUsers = [];
        for (let i = 0; i < users.length; i++) {
            if (users[i].channelBind.channel_id === channel.id) {
                delete users[i].channelBind;
                channelUsers.push(users[i]);
            }
        }

        let usersAction = [];
        for (let i = 0; i < channelUsers.length; i++) {
            usersAction.push(await userActionModel.findOne({
                where: {
                    channel_id: channel.id,
                    user_id: channelUsers[i].id,
                    action: {
                        [Op.or]: ['join', 'left']
                    },
                    action_dt: {
                        [Op.lte]: atDate || new Date()
                    }
                },
                Option: ['action_dt', 'DESC']            
            }));
        }


        return channelUsers.filter((user, i) => {
            if (usersAction[i].action.trim() != 'left') {
                return true
            }
        })
    }

    async getLatestMessageBySignature(signature) {
        let channel = await this.getChannelBySignature(signature);
        return await this.getLatestMessageById(channel.id);
    }

    async getLatestMessageById(channelId) {
        return await messageModel.findOne({
            where: {
                channel_id: channelId
            },
            order: [
                ['post_dt', 'DESC']
            ]
        })
    }

    async getChannelBySignature(signature) {
        return await channelModel.findOne({
            where: {
                signature: signature
            }
        })
    }
}

module.exports = ChannelService;

function identifyMediaType(media) {
    if (!!media.photo.content_id) {
        return {
            id: 1,
            type: media.photo
        };
    }
    if (!!media.video.content_id) {
        return {
            id: 2,
            type: media.video
        };
    }
    if (!!media.audio.content_id) {
        return {
            id: 3,
            type: media.audio
        };
    }
}

function mediaNotEmpty(media) {
    if (!!media.photo.content_id ||
        !!media.video.content_id ||
        !!media.audio.content_id) {
        return true;
    }
    return false;
}