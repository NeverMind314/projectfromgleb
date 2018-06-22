'use strict';

const accountMethods = require('../services/modelsMethods/account');
const sendStatus = require('../services/sendStatus')

module.exports = {
    addAccount(req, res) {
        try {
            accountMethods.addAcount(req.body);

            res.json(sendStatus.responseOk());
        } catch (e) {
            res.json(sendStatus.responseErr('error occured at inserting account into DB. ' + e));
        }
    }
}