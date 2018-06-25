"use strict";

const userModel = require('../models/user.model');
const userChannelModel = require('../models/userChannel.model');

class UserService {
    async addNewUser(user) {
        return await userModel.findOrCreate({
            where: {
                login: user.login.trim()
            },
            defaults: {
                name: user.name.trim(),
                login: user.login.trim()
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
}

module.exports = UserService;