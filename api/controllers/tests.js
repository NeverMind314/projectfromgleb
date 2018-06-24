'use strict';

const creator = require('../models/message.model');
const mediaType = require('../models/mediaType.model');
const channelModel = require('../models/channel.model');
const sendStatus = require('../services/sendStatus')
const UserService = require('../services/user.service');
const ChannelService = require('../services/channel.service');



module.exports = {
    devTests(req, res) {

        let history = {
            name: 'channelTest',
            link: 'linkTest',
            channel_type: 'супергруппа',
            messageHistory: [{
              "date": "2018-06-23T15:33:31.000Z",
              "views_cnt": "",
              "author": {
                "login": "+7 (978) 948-61-27",
                "name": "Глеб Синани"
              },
              "text": "плохо",
              "media": {
                "photo": {
                  "caption": "",
                  "content_id": null
                },
                "video": {
                  "caption": "",
                  "content_id": null
                },
                "audio": {
                  "caption": "",
                  "content_id": ""
                }
              }
            },
            {
              "date": "2018-06-23T15:33:21.000Z",
              "views_cnt": "",
              "author": {
                "login": "+7 (978) 870-94-73",
                "name": "Pavel Tuhar"
              },
              "text": "Хм, парсер нашел песню и видео, а картинку не видит",
              "media": {
                "photo": {
                  "caption": "",
                  "content_id": null
                },
                "video": {
                  "caption": "",
                  "content_id": null
                },
                "audio": {
                  "caption": "",
                  "content_id": ""
                }
              }
            },
            {
              "date": "2018-06-23T15:30:19.000Z",
              "views_cnt": "",
              "author": {
                "login": "+7 (978) 948-61-27",
                "name": "Глеб Синани"
              },
              "text": "картинка",
              "media": {
                "photo": {
                  "caption": "",
                  "content_id": null
                },
                "video": {
                  "caption": "",
                  "content_id": null
                },
                "audio": {
                  "caption": "",
                  "content_id": ""
                }
              }
            }]
        };

        let channelService = new ChannelService();
        channelService.addChannelHistory(history);

        // let userService = new UserService();
        // userService.addNewUser(history.messageHistory[0].author);

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
        //             channel_id: 3,
        //             user_id: 3,
        //             post_dt: new Date(),
        //             views_count: 15,
        //             message: 'msg1'
        //         }),
        //         creator.create({
        //             channel_id: 2,
        //             user_id: 2,
        //             post_dt: new Date(),
        //             views_count: 156,
        //             message: 'msg2'
        //         }),
        //         creator.create({
        //             channel_id: 2,
        //             user_id: 2,
        //             post_dt: new Date(),
        //             views_count: 156,
        //             message: 'msg2'
        //         })
        //     ];
        //   });

        res.json(sendStatus.responseOk({
            msg: 'белеберда'
        }));
    }
}