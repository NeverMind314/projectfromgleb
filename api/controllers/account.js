'use strict';

const accountMethods = require('../services/modelsMethods/account');
const sendStatus = require('../services/sendStatus')

module.exports = {
    addAccount(req, res) {
        
        accountMethods.addAccount(req.body);

        res.json(sendStatus.responceObj({
            msg: 'белеберда'
        }));
    }
}