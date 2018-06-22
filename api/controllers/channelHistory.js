'use strict';

const service = require('../services/channelHistroy');
const sendStatus = require('../services/sendStatus')

module.exports = {
    getChannelHistory(req, res) {
        service.channelHistory(req.body)
        .then(rslt => {
            try {
                if (trueScheme(req.body)) {
                    res.json(sendStatus.responseOk({
                        history: rslt
                    }));
                } else {
                    res.json(sendStatus.responseErr('an empy object have been sent'));
                }
            } catch (e) {
                res.json(sendStatus.responseErr('error occured at inserting account into DB. ' + e));
            }
        });
    }
}

function trueScheme(obj) {
    if(obj.hasOwnProperty('name') || obj.hasOwnProperty('link')) return true;
    return false;
}