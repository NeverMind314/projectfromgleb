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
    if (!driver) {
      throw 'Driver is null';
    }
    this.driver = driver;
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
    await this.driver.executeScript('$(".im_dialogs_contacts_wrap li a span").mousedown()');
    // await this.driver.executeScript('$(".im_dialogs_contacts_wrap li a span:contains(\'' + addr + ',\')").mousedown()');
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

  async getUsers() {
    await this.driver.executeScript('$(".tg_head_btn").click(); ');
    await timeout(200);
    const users = await this.driver.executeScript(
      'var users = []; ' +
      'for(let i = 0; i < $("a.md_modal_list_peer_name").length; i++) { users.push({name:$($("a.md_modal_list_peer_name")[i]).text(), isAdmin: 0}) }' +
      'return users;'
    );
    // await this.driver.executeScript('$(".md_modal_action_close").click();');
    await timeout(200);
    await this.driver.executeScript('$(".md_modal_action_close").click();');
    return users;
  }

  async invoke(name) {
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
    await this.driver.executeScript('$("button[ng-click=\'$close(data)\']").click();');
    await this.driver.executeScript('$(".tg_head_btn").click(); ');
    await timeout(1000);
    const channelName = await this.driver.executeScript('return $(".peer_modal_profile_name").text();');
    const channelLink = await this.driver.executeScript('return window.location.href;');
    const channelID = await this.driver.executeScript('return window.location.href.split("=").pop();');
    const channelDescription = await this.driver.executeScript('return $(\'span[ng-bind-html="chatFull.rAbout"]\').text();');
    const channelTypeId = await this.driver.executeScript('return $(\'span[my-i18n="channel_modal_info"]\').text() === "" ? 1 : 2;');
    await this.driver.executeScript('$(".md_modal_action_close").last().click();');


    const channelUsers = await this.getUsers();
    let messagesInPage = 0;
    while (loadingTries < 100) {
      const cnt = await this.driver.executeScript('return $(".im_history_message_wrap").length;');
      if (messagesInPage === cnt) {
        loadingTries++;
        await timeout(100);
      }
      messagesInPage = cnt;
      this.driver.executeScript('$(".im_history_scrollable_wrap").scrollTop(100)').then();
      // console.log(messagesInPage);
    }

    let cnt = messages.length;
    loadingTries = 0;
    const latestMessage = null;//await cs.getLatestMessageBySignature(channelID);

    await this.driver.executeScript(
      '$(".im_message_author_admin").show(); ' +
      '$(".im_service_message").remove(); ' +
      'delete XMLHttpRequest;'
    );

    while (loadingTries < 50) {
      try {
        if (cnt === messages.length) {
          loadingTries++;
        } else {
          loadingTries = 0;
        }
        cnt = messages.length;
        //
        count = await this.driver.executeScript('return $(".im_history_message_wrap").length;');

        // get user info (use caching)
        let author = {};
        const userID = await this.driver.executeScript(
          'return $(".im_history_messages_peer .im_history_message_wrap .im_message_author").last().text();'
        );
        author = await this.driver.executeScript(
          '$(".im_history_messages_peer .im_history_message_wrap .im_message_author").last().click(); ' +
          'var name = $(".peer_modal_profile_name").text(); ' +
          'var login = $(".md_modal_section_param_value").first().text().trim(); ' +
          'return {name, login}'
        );
        const isAdmin = await this.driver.executeScript('return $(".im_message_author_admin").last().text() === "admin"');
        if (isAdmin) {
          for (let i = 0; i < channelUsers.length; i++) {
            if (channelUsers[i].name === author.name) {
              channelUsers[i].isAdmin = 1;
            }
          }
        }
        if (!author.login) {
          author.login = md5(author.name + channelID);
        }
        await this.driver.executeScript('$(".md_modal_action_close").last().click();');
        users[userID] = author;

        // im_message_from_photo
        let time = await this.driver.executeScript(
          'return $(".im_history_messages_peer .im_history_message_wrap .im_message_date_text").last().attr("data-content")'
        );
        let date = await this.driver.executeScript(
          'return $(".im_history_messages_peer .im_history_message_wrap .im_message_date_split_text").last().text()'
        );
        // console.log(date)
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
            continue;
          }
          if (latestMessage && moment(latestMessage.post_dt).unix() > date.unix()) {
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
      users: channelUsers,
      history: messages
    };

    fs.writeFile("data.json", JSON.stringify(channel), function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });


    // await cs.addChannelHistory(channel);
    console.log('Data was saved into db');
  }
}

module.exports = Channel;