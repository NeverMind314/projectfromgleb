'use strict';

const account = require('../models/account.model');
const sendStatus = require('../services/sendStatus')

module.exports = {
    addAccount(req, res) {
        try {
            account.create(req.body);
            
            res.json(sendStatus.responseOk());
        } catch (e) {
            res.json(sendStatus.responseErr('error occured at inserting account into DB. ' + e));
        }
    }
}