'use strict';

const messageModel = require('../models/message.model');
const channelModel = require('../models/channel.model');
const mediaModel = require('../models/media.model');
const ChannelHistoryService = require('./channelHistroy.service');
const UserService = require('./user.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


class ChannelService{
    async addChannelHistory(channelHistory) {
        let channel = await this.addNewChannel(channelHistory);
        let userService = new UserService;
        for (let i = 0; i < channelHistory.history.length; i++) {
            let user = await userService.addNewUser(channelHistory.history[i].author);
            await userService.addNewUserChannel(user[0], channel[0]);
            let message = await this.addNewMessage(channel[0], user[0], channelHistory.history[i]);
            if (i % 50 === 0) {
                console.log('New message saved', i);
            }
            if (mediaNotEmpty(channelHistory.history[i].media)) {
                await this.addNewMedia(channelHistory.history[i].media, message[0])
            }
        }
    }

    async addNewChannel(channel) {
        return await channelModel.findOrCreate({
            where: {
                link: channel.link
            },
            defaults: {
                channel_type_id: channel.type_id,
                link: channel.link,
                name: channel.name,
                description: channel.description
            }
        });
    }

    async addNewMessage (channel, user, message) {
        return await messageModel.findOrCreate({
            where: {
                post_dt: message.date,
                channel_id: channel.id
            },
            defaults: {
                user_id: user.id,
                views_count: +message.views_cnt || 0,
                message: message.text
            }
        })
    }

    async addNewMedia(media, message) {
        return await mediaModel.findOrCreate({
            where: {
                [Op.or]: [
                    {content_id: media.photo.content_id},
                    {content_id: media.video.content_id},
                    {content_id: media.audio.content_id}
                ]
            },
            defaults: {
                message_id: message.id,
                type_id: identifyMediaType(media).id,
                content_id: identifyMediaType(media).type.content_id,
                caption: identifyMediaType(media).type.caption || ''
            }
        })
    }

    async getLatestMessage (channelId) {
        return await messageModel.findAll({
            limit: 1,
            where: {
                channel_id: channelId
            },
            order: [['post_dt', 'DESC']]
        })
    }
}

module.exports = ChannelService;

function identifyMediaType(media) {
    if (!!media.photo.content_id) {
        return {
            id: 1,
            type: media.photo
        };
    }
    if (!!media.video.content_id) {
        return {
            id: 2,
            type: media.video
        };
    }
    if (!!media.audio.content_id) {
        return {
            id: 3,
            type: media.audio
        };
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