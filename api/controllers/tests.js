'use strict';

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

        // // channelMethods.addChannel(channel);

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
        //         creator.create({
        //             user_id: 2,
        //             channel_id: 3,
        //             user_action_id: 2,
        //         }),
        //         creator.create({
        //             user_id: 1,
        //             channel_id: 1,
        //             user_action_id: 1,
        //         }),
        //         creator.create({
        //             user_id: 3,
        //             channel_id: 2,
        //             user_action_id: 2,
        //         })
        //     ];
        //   });

        res.json(sendStatus.responceObj({
            msg: 'белеберда'
        }));
    }
}