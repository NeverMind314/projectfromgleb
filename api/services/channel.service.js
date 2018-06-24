'use strict';

const messageModel = require('../models/message.model');
const channelModel = require('../models/channel.model');
const UserService = require('./user.service');
const mediaModel = require('../models/media.model');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;


class ChannelService{
    async addChannelHistory(channelHistory) {
        let channel = await this.addNewChannel(channelHistory);
        let userService = new UserService;
        channelHistory.history.forEach(async message => {
            let user = await userService.addNewUser(message.author);
            await this.addNewMessage(channel[0], user[0], message);
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
                channel_type_id: channel.type_id
            }
        });
    }

    async addNewMessage (channel, user, newMessage) {
        // console.log('channel 11111', channel.id);
        // console.log('user 2222222', user.id);
        // console.log('message 333333', newMessage.views_cnt);
        let message = await messageModel.findOrCreate({
            where: {
                post_dt: newMessage.date,
                channel_id: channel.id
            },
            default: {
                channel_id: channel.id,
                user_id: user.id,
                post_dt: newMessage.date,
                views_count: newMessage.views_cnt || 0,
                message: newMessage.text
            }
        })

        if (mediaNotEmpty(newMessage.media)) {
            await mediaModel.findOrCreate({
                where: {
                    [Op.or]: [
                        {content_id: message.media.photo.content_id},
                        {content_id: message.media.video.content_id},
                        {content_id: message.media.audio.content_id}
                    ]
                },
                defaults: {
                    message_id: message.id,
                    type_id: identifyMediaTypeId(message.media),
                    content_id: message.media.content_id,
                    caption: message.media.caption
                }
            })
        }
    }
}

module.exports = ChannelService;

function identifyChannelTypeId(channelType) {
    switch (channelType) {
        case 'группа':
            return 1;
        case 'супергруппа':
            return 2;
        case 'канал':
            return 3;
        default:
            throw 'invalid channel type'
    }
}

function identifyMediaTypeId(media) {
    if (!!media.photo.content_id) {
        return 1;
    }
    if (!!media.video.content_id) {
        return 2;
    }
    if (!!media.audio.content_id) {
        return 3;
    }
}

function mediaNotEmpty(media) {
    if (!!media.photo.content_id ||
        !!media.video.content_id ||
        !!media.audio.content_id) {
        return true;
    }
    return false;
}