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
            },{
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

    async addUserActionJoin(channel, userNames) {
        let users = [];
        for (let i = 0; i < userNames.length; i++) {
            let user = await userModel.findOrCreate({
                where: {
                    name: userNames[i]
                }
            });
            if (user[1]) {
                await this.addNewUserChannel(user[0], channel);
            }
            users.push(user[0]);
        }
        let userIds = users.map(user => {
            return user.id
        })
        for (let i = 0; i < userIds.length; i++) {
            let userAction = await userActionModel.findOne({
                where: {
                    channel_id: channel.id,
                    user_id: userIds[i],
                    action: {
                        [Op.or]: ['join', 'left']
                    }
                },
                Option: ['action_dt', 'DESC']
            });
            if (!userAction || userAction.action === 'left') {
                await userActionModel.create({
                    user_id: userIds[i],
                    channel_id: channel.id,
                    action: 'join',
                    action_dt: new Date()
                })
            }
        }
    }

    async addUserActionLeft(channel, userNames) {
        let users = await userModel.findAll({
            include: ['channelBind']
        });

        let leftUsers = users.filter(user => {
            if (user.channelBind.channel_id === channel.id) {
                if (!~userNames.indexOf(user.name.trim())) {
                console.log(user.name.trim())
                    return true
                }
            }
        })
        for (let i = 0; i < leftUsers.length; i++) {
            await userActionModel.create({
                user_id: leftUsers[i].id,
                channel_id: channel.id,
                action: 'left',
                action_dt: new Date()
            })
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