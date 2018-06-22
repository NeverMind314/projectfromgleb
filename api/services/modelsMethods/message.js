'use strict';

const message = require('../../models/message');

module.exports = {
    addMessage (newMessage) {
        message.create(newMessage);
    },

    getMessages (callback, selectParams) {
        message.findAll(selectParams).then(messages => {
            callback(messages);
        }); 
    }
} 