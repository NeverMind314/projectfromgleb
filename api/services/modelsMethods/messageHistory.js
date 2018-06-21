'use strict';

const messageHistory = require('../../models/messageHistory');

module.exports = {
    addMessage (newMessage) {
        messageHistory.create(newMessage);
    },

    getMessages (callback, selectParams) {
        messageHistory.findAll(selectParams).then(messages => {
            callback(messages);
        }); 
    }
} 