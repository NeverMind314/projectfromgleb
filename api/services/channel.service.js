'use strict';

const messageModel = require('../models/message.model');
const channelModel = require('../models/channel.model');
const UserService = require('./user.service');
const mediaModel = require('../models/media.model');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

class ChannelService{
    async addChannelHistory(channelHistory) {
        let channel = this.addNewChannel(channelHistory);
        let userService = new UserService;
        channelHistory.history.forEach(async message => {
            let user = userService.addNewUser(message.author);
            this.addNewMessage(channel, user, message);
        })
    }

    async addNewChannel(channelHistory) {
        return await channelModel.findOrCreate({
            where: {
                link: channelHistory.link.trim()
            },
            defaults: {
                name: channelHistory.name.trim(),
                link: channelHistory.link.trim(),
                channel_type_id: identifyChannelTypeId(channelHistory.channel_type.trim())
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
            defaults: {
                channel_id: channel.id,
                user_id: user.id,
                post_dt: newMessage.date,
                views_count: newMessage.views_cnt,
                message: newMessage.text.trim()
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
                    type_id: identifyMediaTypeId(newMessage.media),
                    content_id: message.media.content_id,
                    caption: message.media.caption
                }
            })
        }
        return messageModel.findOne({
            include: ['media'],
            where: {
                id: message.id
            }
        })
    }
}

module.exports = ChannelService;

function identifyChannelTypeId (channelType) {
    switch(channelType) {
        case 'группа': return 1;
        case 'супергруппа': return 2;
        case 'канал': return 3;
        default: throw 'invalid channel type'
    }
}

function identifyMediaTypeId (media) {
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

function mediaNotEmpty (media) {
    if (!!media.photo.content_id || 
        !!media.video.content_id ||
        !!media.audio.content_id) {
            return true;
    }
    return false;
}