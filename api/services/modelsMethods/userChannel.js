'use strict';

const userChannel = require('../../models/userChannel');

module.exports = {
    addBind (newBind) {
        userChannel.create(newBind);
    },

    getBind (callback, selectParams) {
        userChannel.findAll({where: selectParams}).then(binds => {
            callback(binds);
        }); 
    }
} 