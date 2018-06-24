"use strict";

const userModel = require('../models/user.model');

class UserService{
    async addNewUser (user) {
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
}

module.exports = UserService;