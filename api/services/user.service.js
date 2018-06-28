"use strict";

const userModel = require('../models/user.model');
const messageModel = require('../models/message.model')
const userChannelModel = require('../models/userChannel.model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


class UserService {
    async addNewUser(user) {
        return await userModel.findOrCreate({
            where: {
                login: user.login
            },
            defaults: {
                name: user.name,
                login: user.login
            }
        });
    }

    async addNewUserChannel (user, channel) {
        return await userChannelModel.findOrCreate({
            where: {
                user_id: user.id,
                channel_id: channel.id
            }
        })
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