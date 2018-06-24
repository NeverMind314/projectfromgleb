const {By} = require('selenium-webdriver');
const {timeout} = require('../commons/helper');
const md5 = require('md5');
const tries = 50;
const fs = require('fs');
const moment = require('moment');
const joinlink = require('../actions/constants').joinlink;
const joinMask = require('../actions/constants').joinMask;
const Auth = require('./auth');

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
    if (~name.indexOf(joinlink)) {
      await this.joinByLink(name);
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
    const channelID = await this.driver.executeScript('return window.location.hash.split("=").pop();');
    const channelDescription = await this.driver.executeScript('return $(\'span[ng-bind-html="chatFull.rAbout"]\').text();');
    const channelTypeId = await this.driver.executeScript('return $(\'span[my-i18n="channel_modal_info"]\').text() === "" ? 1 : 2;');
    await this.driver.executeScript('$(".md_modal_action_close").last().click();');

    while (loadingTries < 50) {
      await timeout(100);
      let messagesCont = await this.driver.findElement(By.className('im_history_messages_peer'));
      let items = await messagesCont.findElements(By.className('im_history_message_wrap'));
      count = 0;
      items.forEach(() => count++);

      // get user info (use caching)
      let author = {};
      const userID = await this.driver.executeScript(
        'return $(".im_history_messages_peer .im_history_message_wrap .im_message_author").last().text();'
      );

      for (let t = 0; t < 5 && !author.login; t++) {
        author = await this.driver.executeScript(
          '$(".im_history_messages_peer .im_history_message_wrap .im_message_author").last().click(); ' +
          'var name = $(".peer_modal_profile_name").text(); ' +
          'var login = $(".md_modal_section_param_value").first().text().trim(); ' +
          'return {name, login}'
        );
        // await timeout(50);
        await this.driver.executeScript('$(".md_modal_action_close").last().click();');
        if (t > 0) {
          // console.log('author', t, users[userID], result.length)
        }
      }
      if (!author.login && users[userID]) {
        author = users[userID];
      } else if(author.login) {
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
        'return $(".im_history_messages_peer .im_history_message_wrap .im_message_views_cnt").last().text()'
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
        messages.push({
          date,
          views_cnt,
          author,
          text,
          media
        });
      }
      if (messages.length % 30 === 0) {
        console.log(name, messages.length);
      }
      if (messages.length > 100) break;
      if (count === 0) {
        loadingTries++;
      } else {
        loadingTries = 0;
      }
    }
    fs.writeFile("data.json", JSON.stringify({
      id: channelID,
      type_id: channelTypeId,
      name: channelName,
      description: channelDescription,
      history: messages
    }), function (err) {
      if (err) {
        return console.log(err);
      }
    });
  }
}

module.exports = Channel;