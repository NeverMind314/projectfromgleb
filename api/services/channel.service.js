'use strict';

const messageModel = require('../models/message.model');
const channelModel = require('../models/channel.model');
const UserService = require('./user.service');
const mediaModel = require('../models/media.model');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

class ChannelService{
    async addChannelHistory(channelHistory) {
        let channel = this.addNewChannel(channel);
        let userService = new UserService;
        channel.history.forEach(async message => {
            let user = userService.addNewUser(channelHistory.message.author);
            this.addNewMessage(channel, user, message);
        })
    }

    async addNewChannel(channel) {
        return await channelModel.findOrCreate({
            where: {
                link: channel.link
            },
            defaults: {
                name: channel.name,
                link: channel.link,
                channel_type_id: 'group' || 'supergroup' || 'channel'
            }
        });
    }

    async addNewMessage (channel, user, newMessage) {
        let message = await messageModel.findOrCreate({
            where: {
                post_dt: newMessage.date,
                message: newMessage.text,
                user_id: user.id
            },
            default: {
                channel_id: channel.id,
                user_id: user.id,
                post_dt: newMessage.date,
                message: newMessage.text
            }
        })

        if (newMessage.media.some(item => !!item.content_id)) {
            let media = await mediaModel.findOrCreate({
                where: {
                    [Op.or]: [
                        {content_id: message.media.photo.content_id},
                        {content_id: message.media.video.content_id},
                        {content_id: message.media.audio.content_id}
                    ]
                },
                defaults: {
                    message_id: message.id,
                    type_id: 777,
                    content_id: message.media.content_id,
                    caption: message.media.caption
                }
            })
        }
    }
}

module.exports = ChannelService;

