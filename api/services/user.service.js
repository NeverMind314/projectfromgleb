"use strict";

const userModel = require('../models/user.model');

class UserService {
    addNewUser(user) {
        return new Promise(res => {
            res(userModel.findOrCreate({
                where: {
                    login: user.login.trim()
                },
                defaults: {
                    name: user.name.trim(),
                    login: user.login.trim()
                }
            }));
        })
    }
}

module.exports = UserService;