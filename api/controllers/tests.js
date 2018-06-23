'use strict';

const creator = require('../models/message.model');
const mediaType = require('../models/mediaType.model');
const channelModel = require('../models/channel.model');
const sendStatus = require('../services/sendStatus')
const ChannelHistory = require('../services/channel.service');



module.exports = {
    devTests(req, res) {

        // creator.findOne({
        //     include: ['mediaType']
        // }).then(res => {
        //     console.log(res.mediaType)
        // })

        // let a = new ChannelHistory();

        // a.addChannelHistory();

        // let result;
        // test.channelHistory()
        // .then(rslt => {
        //     result = rslt;
        //     // console.log(result);
        //    res.json(sendStatus.responseOk({
        //        history: rslt
        //     }));
        // });

        // console.log(channelHistory)

        // creator.sync({force: true}).then(() => {
        //     // Table created
        //     return [
        //         creator.create({
        //             channel_id: 2,
        //             user_id: 3,
        //             post_dt: new Date(),
        //             message: 'msg1',
        //         }),
        //         creator.create({
        //             channel_id: 3,
        //             user_id: 2,
        //             post_dt: new Date(),
        //             message: 'msg2',
        //         }),
        //         creator.create({
        //             channel_id: 1,
        //             user_id: 1,
        //             post_dt: new Date(),
        //             message: 'msg3',
        //         })
        //     ];
        //   });

        // res.json(sendStatus.responseOk({
        //     msg: 'белеберда'
        // }));
    }
}