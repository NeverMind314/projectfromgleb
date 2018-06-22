'use strict';

const creator = require('../models/userAction');
const creatorMethods = require('../services/modelsMethods/userAction');
const channelModel = require('../models/channel');
const channelMethods = require('../services/modelsMethods/channel');
const sendStatus = require('../services/sendStatus')

module.exports = {
    devTests(req, res) {

        // !!!!!!!!!!!!!! chanel methods work example !!!!!!!!!!!!!!!!!!

        let channel = {
            name: 'methodTest1',
            link: 'http://test4',
            channel_type_id: '2'
        };

        // channelMethods.addChannel(channel);

        channelMethods.getChannels(function (channels) {
            console.log(channels);
        }, {
            where: {
                link: 'http://test4'
            }
        });

        // creator.sync({force: true}).then(() => {
        //     // Table created
        //     return [
        //         creatorMethods.addAction({
        //             action_dt: new Date(),
        //             action: 'join',
        //         }),
        //         creatorMethods.addAction({
        //             action_dt: new Date(),
        //             action: 'out',
        //         }),
        //         creatorMethods.addAction({
        //             action_dt: new Date(),
        //             action: 'join',
        //         })
        //     ];
        //   });

        // res.json(sendStatus.responseObj({
        //     msg: 'белеберда'
        // }));
    }
}