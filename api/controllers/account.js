'use strict';

const accountMethods = require('../services/modelsMethods/account');
const sendStatus = require('../services/sendStatus')

module.exports = {
    addAccount(req, res) {
        try {
            accountMethods.addAccount(req.body);

            res.json(sendStatus.responseObj());
        } catch (e) {
            res.json(
                sendStatus.responseObj(
                    null,
                    sendStatus.errConstructor('error occured at inserting account into DB. ' + e)
                )
            );
        }
    }
}