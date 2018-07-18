'use strict';

const UserService = require('../services/user.service');
const sendStatus = require('../services/sendStatus')

module.exports = {
    getUserHistory(req, res) {
        let userHistory = new UserService();
        let startFrom = {
            moreThan: req.query.more_than,
            lessThan: req.query.less_than
        }
        if (startFrom.moreThan && startFrom.lessThan) {
            res.json(sendStatus.responseErr('Not allowed to request both of less_ and more_than fields'))
        }
        userHistory.getUserHistory(req.query.key, startFrom).then(result => {
            if (result instanceof Error) {
                res.json(sendStatus.responseErr(result.message));
            } else {
                res.json(sendStatus.responseOk({result}));
            }
        })
    }
}