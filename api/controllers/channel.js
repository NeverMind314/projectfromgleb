'use strict';

const db = require('../../config/dbConfig');
const creator = require('../models/userChannel');

module.exports = {
    getChannels(req, res) {

        creator.sync({force: true}).then(() => {
            // Table created
            return [
                creator.create({
                    user_id: 2,
                    channel_id: 3,
                    user_action_id: 2,
                }),
                creator.create({
                    user_id: 1,
                    channel_id: 1,
                    user_action_id: 1,
                }),
                creator.create({
                    user_id: 3,
                    channel_id: 2,
                    user_action_id: 2,
                })
            ];
          });

        // messageHistory.sync({force: true}).then(() => {
        //     // Table created
        //     return [
        //         messageHistory.create({
        //             channel_id: 1,
        //             user_id: 2,
        //             post_dt: new Date(),
        //             message: "msg1"
        //         }),
        //         messageHistory.create({
        //             channel_id: 2,
        //             user_id: 1,
        //             post_dt: new Date(),
        //             message: "msg2"
        //         }),
        //         messageHistory.create({
        //             channel_id: 3,
        //             user_id: 3,
        //             post_dt: new Date(),
        //             message: "msg3"
        //         })
        //     ];
        //   });

        res.json(sendOk({
            msg: 'белеберда'
        }));
    }
}

function sendOk(data) {
    return {
        current_timestamp: new Date(),
        error: null,
        data: data
    }
}