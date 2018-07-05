"use strict";

const userModel = require('../models/user.model');
const messageModel = require('../models/message.model')
const userChannelModel = require('../models/userChannel.model');
const userActionModel = require('../models/userAction.model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


class UserService {
    async addNewUser(newUser) {
        let user = await userModel.findOrCreate({
            where: {
                name: newUser.name
            },
            defaults: {
                login: newUser.login
            }
        });
        if (!user[1] && !user[0].login) {
            await userModel.update({
                login: newUser.login
            }, {
                where: {
                    name: newUser.name
                }
            })
        }
        return user
    }

    async addNewUserChannel(user, channel) {
        return await userChannelModel.findOrCreate({
            where: {
                user_id: user.id,
                channel_id: channel.id
            }
        });
    }

    async addUserActionWrite(channel, user, message) {
        await userActionModel.findOrCreate({
            where: {
                user_id: user.id,
                channel_id: channel.id,
                action: 'write',
                action_dt: message.date
            }
        });
    }

    async addUserActionJoinAdmin(channel, channelUsers) {
        for (let i = 0; i < channelUsers.length; i++) {
            let user = await userModel.findOrCreate({
                where: {
                    name: channelUsers[i].name
                }
            });
            if (+channelUsers[i].isAdmin) {
                let isAdmin = await userActionModel.findOne({
                    where: {
                        channel_id: channel.id,
                        user_id: user[0].id,
                        action: {
                            [Op.or]: ['isAdmin', 'isNotAdmin']
                        }
                    },
                    order: [
                        ['action_dt', 'DESC']
                    ]
                })
                if (!isAdmin || isAdmin.action.trim() === 'isNotAdmin') {
                    await userActionModel.create({
                        user_id: user[0].id,
                        channel_id: channel.id,
                        action: 'isAdmin',
                        action_dt: new Date()
                    })
                }
            }
            if (user[1]) {
                await this.addNewUserChannel(user[0], channel);
            }
            let userAction = await userActionModel.findOne({
                where: {
                    channel_id: channel.id,
                    user_id: user[0].id,
                    action: {
                        [Op.or]: ['join', 'left']
                    }
                },
                order: [
                    ['action_dt', 'DESC']
                ]
            });
            if (!userAction || userAction.action.trim() === 'left') {
                await userActionModel.create({
                    user_id: user[0].id,
                    channel_id: channel.id,
                    action: 'join',
                    action_dt: new Date()
                })
            }
        }
    }

    async addUserActionLeftNotAdmin(channel, channelUsers) {
        let users = await userModel.findAll({
            include: [{
                model: userChannelModel,
                as: 'channelBind',
                where: {
                    channel_id: channel.id
                }
            }]
        });

        let userNames = channelUsers.map(user => {
            return user.name
        });

        let leftUsers = users.filter(user => {
            if (!~userNames.indexOf(user.name.trim())) {
                return true
            }
        });
        for (let i = 0; i < leftUsers.length; i++) {
            let lastUserAction = await userActionModel.findOne({
                where: {
                    channel_id: channel.id,
                    user_id: leftUsers[i].id,
                    action: {
                        [Op.or]: ['join', 'left']
                    }
                },
                order: [
                    ['action_dt', 'DESC']
                ]
            });
            if (lastUserAction && lastUserAction.action.trim() === 'join') {
                await userActionModel.create({
                    user_id: leftUsers[i].id,
                    channel_id: channel.id,
                    action: 'left',
                    action_dt: new Date()
                });
            }
        }
        for (let i = 0; i < users.length; i++) {
            let isAdmin = await userActionModel.findOne({
                where: {
                    channel_id: channel.id,
                    user_id: users[i].id,
                    action: {
                        [Op.or]: ['isAdmin', 'isNotAdmin']
                    }
                },
                order: [
                    ['action_dt', 'DESC']
                ]
            });
            if (isAdmin && isAdmin.action.trim() === 'isAdmin') {
                let dbNotAdmin = await userModel.findOne({
                    where: {
                        id: isAdmin.user_id
                    }
                });
                let notAdmin = channelUsers.filter(user => {
                    if (user.name === dbNotAdmin.name.trim()) {
                        return true
                    }
                })
                if (notAdmin.length == 0 || !+notAdmin[0].isAdmin) {
                    await userActionModel.create({
                        user_id: users[i].id,
                        channel_id: channel.id,
                        action: 'isNotAdmin',
                        action_dt: new Date()
                    });
                }
            }
        }
    }

    async getUserHistory(userKey, startFrom) {
        let param = {};
        if (+userKey) {
            param.id = userKey;
        } else {
            param.login = userKey;
        }
        let user = await userModel.findOne({
            where: param
        });

        if (!user) {
            return new Error('No user with such key')
        }

        let begin = startFrom.moreThan || startFrom.lessThan;

        if (+begin && begin > 0) {
            let message = await messageModel.findOne({
                where: {
                    user_id: user.id,
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
                    user_id: user.id,
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
                    user_id: user.id,
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
                user_id: user.id
            }
        });

        return messages;
    }
}

module.exports = UserService;