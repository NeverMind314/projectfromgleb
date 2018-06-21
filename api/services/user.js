'use strict';

const user = require('../models/user');

module.exports = {
    addUser (newUser) {
        user.create(newUser);
    },

    getUsers (callback, selectParams) {
        user.findAll(selectParams).then(users => {
            callback(users);
        }); 
    }
} 