'use strict';

const sendStatus = require('../services/sendStatus')

module.exports = {
    getChannels(req, res) {
        res.json(sendStatus.responceObj({
            msg: 'белеберда'
        }));
    }
}