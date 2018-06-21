'use strict';

const userChannel = require('../../models/userChannel');

module.exports = {
    addBind (newBind) {
        userChannel.create(newBind);
    },

    getBind (callback, selectParams) {
        userChannel.findAll(selectParams).then(binds => {
            callback(binds);
        }); 
    }
} 