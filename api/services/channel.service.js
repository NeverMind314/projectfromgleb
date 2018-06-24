'use strict';

const messageModel = require('../models/message.model');
const channelModel = require('../models/channel.model');
const UserService = require('./user.service');
const mediaModel = require('../models/media.model');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

class ChannelService {
    addChannelHistory(channelHistory) {
        this.addNewChannel(channelHistory)
            .then(channel => {
                let userService = new UserService;
                channelHistory.history.forEach(message => {
                    // console.log('1 2 3', message);
                    userService.addNewUser(message.author)
                        .then(user => {
                            this.addNewMessage(channel[0], user[0], message)
                            .then();
                        })
                })

                function recursion() {
                    userService.addNewUser(message.author)
                        .then(user => {
                            this.addNewMessage(channel[0], user[0], message);
                        })
                }
            })
    }

    addNewChannel(channelHistory) {
        return new Promise(res => {
            res(channelModel.findOrCreate({
                where: {
                    link: channelHistory.link
                },
                defaults: {
                    name: channelHistory.name,
                    link: channelHistory.link,
                    channel_type_id: channelHistory.type_id
                }
            }));
        })
    }

    addNewMessage(channel, user, newMessage) {
        return new Promise(res => {
            console.log('1 2 3', newMessage);
            messageModel.findOrCreate({
                where: {
                    post_dt: newMessage.date,
                    channel_id: channel.id
                },
                defaults: {
                    channel_id: channel.id,
                    user_id: user.id,
                    post_dt: newMessage.date,
                    views_count: newMessage.views_cnt || 0,
                    message: newMessage.text.trim()
                }
            }).then(message => {
                if (mediaNotEmpty(newMessage.media)) {
                    mediaModel.findOrCreate({
                        where: {
                            [Op.or]: [{
                                    content_id: message.media.photo.content_id
                                },
                                {
                                    content_id: message.media.video.content_id
                                },
                                {
                                    content_id: message.media.audio.content_id
                                }
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
                res(messageModel.findOne({
                    include: ['media'],
                    where: {
                        id: message.id
                    }
                }));
            })
        })
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