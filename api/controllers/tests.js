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
          "id": "s1391903125_12730356512979826587",
          "type_id": 1,
          "link": "https://web.telegram.org/#/im?p=@breakingmash",
          "name": "Telegram content test",
          "description": "Test content",
          "history": [{
            "date": "2018-06-24T09:54:55.000Z",
            "views_cnt": "",
            "author": {
              "login": "+7 (978) 870-94-73",
              "name": "Pavel Tuhar"
            },
            "text": "",
            "media": {
              "photo": {
                "caption": null,
                "content_id": null
              },
              "video": {
                "caption": null,
                "content_id": null
              },
              "audio": {
                "caption": null,
                "content_id": null
              }
            }
          },
          {
            "date": "2018-06-24T09:54:55.000Z",
            "views_cnt": "",
            "author": {
              "login": "+7 (978) 870-94-73",
              "name": "Pavel Tuhar"
            },
            "text": "",
            "media": {
              "photo": {
                "caption": null,
                "content_id": null
              },
              "video": {
                "caption": null,
                "content_id": null
              },
              "audio": {
                "caption": null,
                "content_id": null
              }
            }
          },
          {
            "date": "2018-06-24T09:44:08.000Z",
            "views_cnt": "",
              "author": {
                "login": "+7 (978) 870-94-73",
                "name": "Pavel Tuhar"
              },
            "text": "Нужна одна простая группа и супергруппа",
            "media": {
              "photo": {
                "caption": null,
                "content_id": null
              },
              "video": {
                "caption": null,
                "content_id": null
              },
              "audio": {
                "caption": null,
                "content_id": null
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