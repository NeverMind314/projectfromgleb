const {By} = require('selenium-webdriver');
const {timeout} = require('../commons/helper');
const md5 = require('md5');
const tries = 50;
const fs = require('fs');
const moment = require('moment');
const joinchat = require('../actions/constants').joinchat;
const joinlink = require('../actions/constants').joinlink;
const joinMask = require('../actions/constants').joinMask;
const Auth = require('./auth');
const channelService = require('../api/services/channel.service');
const cs = new channelService();

class Channel {
  constructor(driver) {
    this.driver = driver;
    this.auth = new Auth(driver);
  }

  async find(addr) {
    let items = null;
    for (let t = 0; t < tries; t++) {
      items = await this.driver.findElements(By.className('im_dialog_wrap'));
      await timeout(500);
      items.forEach(item => t = 9999); // exit
    }
    await this.driver.executeScript('$(".im_dialogs_search input").val("' + addr + '");');
    await this.driver.executeScript('$(".im_dialogs_search input").change();');
    await timeout(500);
    for (let t = 0; t < tries; t++) {
      items = await this.driver.findElements(By.className('im_dialog_wrap'));
      await timeout(500);
      items.forEach(item => t = 9999); // exit
    }
    await this.driver.executeScript('$(".im_dialogs_contacts_wrap li a span:contains(\'' + addr + ',\')").mousedown()');
  }

  async joinByLink(link) {
    await timeout(500);
    await this.driver.executeScript('window.location.hash = "' + joinMask + '=' + link.split('/')[4] + '"');
    await timeout(500);
    let items = null;
    for (let t = 0; t < tries; t++) {
      items = await this.driver.findElements(By.className('im_dialog_wrap'));
      await timeout(500);
      items.forEach(item => t = 9999); // exit
    }
  }

  async open(name) {
    if (~name.indexOf(joinchat)) {
      await this.joinByLink(name);
    } else if (~name.indexOf(joinlink)) {
      await this.find(name.split('/').pop());
    } else if (name[0] === '@') {
      await this.find(name);
    }
    let messages = [];
    let loadingTries = 0;
    let count = 0;
    const users = {};
    await timeout(600);
    await this.driver.executeScript('$(".tg_head_btn").click(); ');
    await timeout(1000);
    const channelName = await this.driver.executeScript('return $(".peer_modal_profile_name").text();');
    const channelLink = await this.driver.executeScript('return window.location.href;');
    const channelID = await this.driver.executeScript('return window.location.href.split("=").pop();');
    const channelDescription = await this.driver.executeScript('return $(\'span[ng-bind-html="chatFull.rAbout"]\').text();');
    const channelTypeId = await this.driver.executeScript('return $(\'span[my-i18n="channel_modal_info"]\').text() === "" ? 1 : 2;');
    await this.driver.executeScript('$(".md_modal_action_close").last().click();');

    let messagesInPage = 0;
    while(loadingTries < 100) {
      const cnt = await this.driver.executeScript('return $(".im_history_message_wrap").length;');
      if (messagesInPage === cnt) {
        loadingTries++;
        await timeout(300);
      }
      messagesInPage = cnt;
      this.driver.executeScript('$(".im_history_scrollable_wrap").scrollTop(100)').then();
      // console.log(messagesInPage);
    }

    let cnt = messages.length;
    loadingTries = 0;
    const latestMessage = await cs.getLatestMessageBySignature(channelID);
    while (loadingTries < 50) {
      try {
        if (cnt === messages.length) {
          loadingTries++;
          await timeout(100);
        }
        cnt = messages.length;
        // await timeout(50);
        let messagesCont = await this.driver.findElement(By.className('im_history_messages_peer'));
        let items = await messagesCont.findElements(By.className('im_history_message_wrap'));
        count = 0;
        items.forEach(() => count++);

        // get user info (use caching)
        let author = {};
        const userID = await this.driver.executeScript(
          'return $(".im_history_messages_peer .im_history_message_wrap .im_message_author").last().text();'
        );

        if (users[userID]) {
          author = users[userID];
        } else {
          author = await this.driver.executeScript(
            '$(".im_history_messages_peer .im_history_message_wrap .im_message_author").last().click(); ' +
            'var name = $(".peer_modal_profile_name").text(); ' +
            'var login = $(".md_modal_section_param_value").first().text().trim(); ' +
            'return {name, login}'
          );
          await this.driver.executeScript('$(".md_modal_action_close").last().click();');
          users[userID] = author;
        }


        // im_message_from_photo
        let time = await this.driver.executeScript(
          'return $(".im_history_messages_peer .im_history_message_wrap .im_message_date_text").last().attr("data-content")'
        );
        let date = await this.driver.executeScript(
          'return $(".im_history_messages_peer .im_history_message_wrap .im_message_date_split_text").last().text()'
        );
        let text = await this.driver.executeScript(
          'return $(".im_history_messages_peer .im_history_message_wrap .im_message_text").last().text()'
        );
        let views_cnt = await this.driver.executeScript(
          'return parseInt($(".im_history_messages_peer .im_history_message_wrap .im_message_views_cnt").last().text()) || 0;'
        );

        let media = {}
        media.photo = await this.driver.executeScript(
          'var message = $(".im_history_messages_peer .im_history_message_wrap").last(); ' +
          'var src = message.find("img.im_message_photo_thumb").attr("src"); ' +
          'var caption = message.find(".im_message_photo_caption").text(); ' +
          'return {content_id: src || null, caption: caption || null}'
        );
        media.video = await this.driver.executeScript(
          'var message = $(".im_history_messages_peer .im_history_message_wrap").last();' +
          'var src = message.find("img.im_message_video_thumb").attr("src"); ' +
          'var caption = message.find(".im_message_document_caption").text(); ' +
          'return {content_id:src || null, caption: caption || null}'
        );
        media.audio = await this.driver.executeScript(
          'var message = $(".im_history_messages_peer .im_history_message_wrap").last();' +
          'var name = message.find("span[ng-bind=\'::audio.file_name\']").text();' +
          'var caption = message.find(".im_message_document_caption").text(); ' +
          'return {content_id:name || null, caption: caption || null}'
        );

        await this.driver.executeScript('$(".im_history_messages_peer .im_history_message_wrap").last().remove()');

        if (date || text) {
          const unf = date.split(',').slice(1, 3).join('') + ' ' + time;
          date = moment(unf, 'MMMM DD YYYY hh:mm:ss A').local();
          const signature = md5(date.unix() + text);
          const duplicates = messages.filter(message => {
            return message.signature === signature
          });
          if (duplicates.length > 0) {
            // console.log(text);
            continue;
          }
          if (moment(latestMessage.post_dt).unix() > date.unix()) {
            console.log('>>>>>>', latestMessage.post_dt, date);
            break;
          }

          messages.push({
            signature,
            date,
            views_cnt,
            author,
            text,
            media
          });
        }
        if (date) {
          console.log(date, messages.length, messagesInPage);
        }
        if (messages.length % 100 === 0) {
          console.log(name, messages.length);
        }
        // if (messages.length > 500) break;
        // if (count === 0) {
        //   await timeout(500);
        //   console.log('Loader is not found', loadingTries)
        //   loadingTries++;
        // } else {
        //   loadingTries = 0;
        // }
      } catch (err) {
        console.log('ERROR', err);
      }
    }


    console.log('saving to db', messages.length);
    // await timeout(10000);

    const channel = {
      signature: channelID,
      type_id: channelTypeId,
      link: channelLink,
      name: channelName,
      description: channelDescription,
      history: messages
    };

    fs.writeFile("data.json", JSON.stringify(channel), function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });


    await cs.addChannelHistory(channel);
    console.log('Data was saved into db');
  }
}

module.exports = Channel;