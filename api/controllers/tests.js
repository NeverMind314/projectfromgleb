'use strict';

const account = require('../models/account.model');
const message = require('../models/message.model');
const channel = require('../models/channel.model');
const channelType = require('../models/channelType.model');
const media = require('../models/media.model');
const mediaType = require('../models/mediaType.model');
const user = require('../models/user.model');
const userChannel = require('../models/userChannel.model');
const sendStatus = require('../services/sendStatus');
const ChannelService = require('../services/channel.service');
const history = require('../../data.json');



module.exports = {
    devTests(req, res) {

        // let history = {
        //     "id": "s1391903125_12730356512979826587",
        //     "type_id": 1,
        //     "link": "https://web.telegram.org/#/im?p=@breakingmash",
        //     "name": "Telegram content test",
        //     "description": "Test content",
        //     "history": [
        //         {
        //             "date": "2018-06-23T22:27:56.000Z",
        //             "views_cnt": "91",
        //             "author": {
        //                 "login": "https://t.me/breakingmash",
        //                 "name": "Mash"
        //             },
        //             "text": "",
        //             "media": {
        //                 "photo": {
        //                     "caption": null,
        //                     "content_id": "img/placeholders/PhotoThumbConversation.gif"
        //                 },
        //                 "video": {
        //                     "caption": null,
        //                     "content_id": null
        //                 },
        //                 "audio": {
        //                     "caption": null,
        //                     "content_id": null
        //                 }
        //             }
        //         },
        //         {
        //             "date": "2018-06-23T22:27:56.000Z",
        //             "views_cnt": "90",
        //             "author": {
        //                 "login": "https://t.me/breakingmash",
        //                 "name": "Mash"
        //             },
        //             "text": "",
        //             "media": {
        //                 "photo": {
        //                     "caption": null,
        //                     "content_id": "blob:https://web.telegram.org/be1edc34-96d4-4270-a10f-9844649cd86e"
        //                 },
        //                 "video": {
        //                     "caption": null,
        //                     "content_id": null
        //                 },
        //                 "audio": {
        //                     "caption": null,
        //                     "content_id": null
        //                 }
        //             }
        //         },
        //         {
        //             "date": "2018-06-23T22:27:56.000Z",
        //             "views_cnt": "90",
        //             "author": {
        //                 "login": "https://t.me/breakingmash",
        //                 "name": "Mash"
        //             },
        //             "text": "",
        //             "media": {
        //                 "photo": {
        //                     "caption": null,
        //                     "content_id": "blob:https://web.telegram.org/557645d7-d80b-4115-98f3-5410d9f14457"
        //                 },
        //                 "video": {
        //                     "caption": null,
        //                     "content_id": null
        //                 },
        //                 "audio": {
        //                     "caption": null,
        //                     "content_id": null
        //                 }
        //             }
        //         }
        //     ]
        // };

        let channelService = new ChannelService();
        channelService.getLatestMessage(1)
            .then(message => {
                res.json(sendStatus.responseOk(message[0]));
            });
        // channelService.addChannelHistory(history);


        // let userService = new UserService();
        // userService.addNewUser(history.messageHistory[0].author);

        // account.sync({force: true})
        // channel.sync({force: true})
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
        // media.sync({force: true})
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
        // message.sync({force: true})
        // user.sync({force: true})
        // userAction.sync({force: true})
        // userChannel.sync({force: true})
    }
}