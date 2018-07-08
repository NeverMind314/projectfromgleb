'use strict';

const sendStatus = require('../services/sendStatus');
const ChannelService = require('../services/channel.service');
const history = require('../../data.json');



module.exports = {
    devTests(req, res) {

        let channelService = new ChannelService();
        // channelService.getLatestMessage(1)
        //     .then(message => {
        //         res.json(sendStatus.responseOk(message[0]));
        //     });
        channelService.addChannelHistory(history).then(() => {
            res.json(sendStatus.responseOk());
        });
        // channelService.getLatestMessageById(1).then(message => {
        //     res.json(sendStatus.responseOk(message));
        // });;

        // let installer = new Installer();
        // installer.install();

        // let userService = new UserService();
        // userService.addNewUser(history.messageHistory[0].author);



        // res.json(sendStatus.responseOk());
    }
}