'use strict';

const messageModel = require('../models/message.model');
const channelModel = require('../models/channel.model');
const mediaModel = require('../models/media.model');
const userModel = require('../models/user.model');
const userActionModel = require('../models/userAction.model');
const userChannelModel = require('../models/userChannel.model');
const channelLinkModel = require('../models/channelLink.model');
const channelUsersModel = require('../models/channelUsers.model');
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
                await this.addNewMedia(channelHistory.history[i].media, message[0]);
            }
        }
        await this.addChannelUsers(channelHistory);
        await userService.addUserActionJoinAdmin(channel[0], channelHistory.users);
        await userService.addUserActionLeftNotAdmin(channel[0], channelHistory.users);
    }

    async addNewChannel(channel) {
        let dbChannel = await channelModel.findOrCreate({
            where: {
                signature: channel.signature
            },
            defaults: {
                channel_type_id: channel.type_id,
                name: channel.name,
                description: channel.description
            }
        });
        await channelLinkModel.findOrCreate({
            where: {
                link: channel.link
            },
            defaults: {
                channel_id: dbChannel[0].id
            }
        })

        return dbChannel;
    }

    async addChannelUsers (channel) {
        let channelId = await this.getChannelBySignature(channel.signature);
        let lastUserCount = await channelUsersModel.findOne({
            where: {
                channel_id: channelId.id
            },
            order: [['check_dt', 'DESC']]
        })
        if (!channel.usersCnt) {
            let usersCnt = channel.users.length;
        }
        if (!lastUserCount || lastUserCount.user_count !== +channel.usersCnt) {
            return channelUsersModel.create({
                channel_id: channelId.id,
                user_count: +channel.usersCnt || usersCnt,
                check_dt: new Date()
            })
        }
        return null
    }

    async addNewMessage(channel, user, message) {
        if (!+message.views_cnt) {
            let num = message.views_cnt.split('к')[0];
            let views_cnt = num + '000';
        }
        return await messageModel.findOrCreate({
            where: {
                signature: message.signature
            },
            defaults: {
                post_dt: message.date,
                channel_id: channel.id,
                user_id: user.id,
                views_count: +message.views_cnt || views_cnt,
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

    async getChannels () {
        return channelModel.findAll();
    }

    async getChannelHistory(channelKey, startFrom) {
        let param = {};
        if (+channelKey) {
            param.id = channelKey;
        } else {
            let channeLink = await channelLinkModel.findOne({
                where: {
                    link: channelKey
                }
            })
            param.id = channeLink.channel_id;
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
            let channeLink = await channelLinkModel.findOne({
                where: {
                    link: channelKey
                }
            })
            param.id = channeLink.channel_id;
        }
        let channel = await channelModel.findOne({
            where: param
        });

        if (!channel) {
            return new Error('No channel with such key')
        }

        let users = await userModel.findAll({
            include: [{
                model: userChannelModel,
                as: 'channelBind',
                where: {
                    channel_id: channel.id
                }
            }]
        });

        for (let i = 0; i < users.length; i++) {
            let isAdmin = await userActionModel.findOne({
                where: {
                    channel_id: channel.id,
                    user_id: users[i].id,
                    action: {
                        [Op.or]: ['isAdmin', 'noLongerAdmin']
                    }
                },
                order: [
                    ['action_dt', 'DESC']
                ]
            });
            if (isAdmin) {
                users[i].dataValues.isAdmin = isAdmin.action.trim();
            }
        }

        return users
    }

    async getActualChannelUsers(channelKey, atDate) {
        let param = {};
        if (+channelKey) {
            param.id = channelKey;
        } else {
            let channeLink = await channelLinkModel.findOne({
                where: {
                    link: channelKey
                }
            })
            param.id = channeLink.channel_id;
        }

        let channel = await channelModel.findOne({
            where: param
        });
        if (!channel) {
            return new Error('No channel with such key')
        }



        let channelUsers = await userModel.findAll({
            include: [{
                model: userChannelModel,
                as: 'channelBind',
                where: {
                    channel_id: channel.id
                }
            }]
        });

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
                order: [['action_dt', 'DESC']]           
            }));
            let isAdmin = await userActionModel.findOne({
                where: {
                    channel_id: channel.id,
                    user_id: channelUsers[i].id,
                    action: {
                        [Op.or]: ['isAdmin', 'noLongerAdmin']
                    }
                },
                order: [
                    ['action_dt', 'DESC']
                ]
            });
            if (isAdmin) {
                channelUsers[i].dataValues.isAdmin = isAdmin.action.trim();
            }
        }

        let user_count = await channelUsersModel.findOne({
            where: {
                channel_id: channel.id,
                check_dt: {
                    [Op.lte]: atDate || new Date()
                }
            },
            order: [['check_dt', 'DESC']]
        })
        
        return {
            user_count: user_count,
            channel_users: channelUsers.filter((user, i) => {
            if (usersAction[i] && usersAction[i].action.trim() != 'left') {
                return true
            }
        })}
    }

    async getLatestMessageBySignature(signature) {
        let channel = await this.getChannelBySignature(signature);
        if (channel) {
            return await this.getLatestMessageById(channel.id);
        }
        return null
    }

    async getLatestMessageById(channelId) {
        return await messageModel.findOne({
            where: {
                channel_id: channelId
            },
            order: [['post_dt', 'DESC']]
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