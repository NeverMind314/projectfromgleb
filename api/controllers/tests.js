'use strict';

const account = require('../models/account.model');
const message = require('../models/message.model');
const channel = require('../models/channel.model');
const channelType = require('../models/channelType.model');
const media = require('../models/media.model');
const mediaType = require('../models/mediaType.model');
const UserAction = require('../models/userAction.model');
const user = require('../models/user.model');
const userChannel = require('../models/userChannel.model');
const channelLink = require('../models/channelLink.model')
const channelQueue = require('../models/channelQueue.model');
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
        // channelService.addChannelHistory(history).then(() => {
        //     res.json(sendStatus.responseOk());
        // });
        // channelService.getLatestMessageById(1).then(message => {
        //     res.json(sendStatus.responseOk(message));
        // });;



        // let userService = new UserService();
        // userService.addNewUser(history.messageHistory[0].author);

        // account.sync({force: true})
        // channelType.sync({force: true})
        // .then(() => {
        //     return [channelType.create({
        //         name: 'group'
        //     }),
        //     channelType.create({
        //         name: 'supergroup'
        //     }),
        //     channelType.create({
        //         name: 'channel'
        //     })]
        // })
        // mediaType.sync({force: true})
        // .then(() => {
        //     return [mediaType.create({
        //         name: 'photo'
        //     }),
        //     mediaType.create({
        //         name: 'video'
        //     }),
        //     mediaType.create({
        //         name: 'audio'
        //     })] 
        // })
        // media.sync({force: true})
        // message.sync({force: true})
        // user.sync({force: true});
        // UserAction.sync({force: true});
        // userChannel.sync({force: true});
        // channel.sync({force: true});
        // channelLink.sync({force: true});
        channelQueue.sync({force: true});
        // res.json(sendStatus.responseOk());
    }
}