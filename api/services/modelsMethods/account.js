'use strict';

const account = require('../../models/account');

module.exports = {
    addAccount (newAccount) {
        // account.create(newAccount);
    },

    getAccount (callback, selectParams) {
        account.findAll(selectParams).then(accounts => {
            callback(accounts);
        }); 
    }
} 