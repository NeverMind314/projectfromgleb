'use strict';

const userAction = require('../../models/userAction');

module.exports = {
    addAction (newAction) {
        userAction.create(newAction);
    },

    getActions (callback, selectParams) {
        userAction.findAll({where: selectParams}).then(actions => {
            callback(actions);
        }); 
    }
} 