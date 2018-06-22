const {By} = require('selenium-webdriver');
const {timeout} = require('../commons/helper');
const md5 = require('md5');
const tries = 50;
const fs = require('fs');
const moment = require('moment');
const joinlink = require('../actions/constants').joinlink;
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
    await this.driver.executeScript('$(".im_dialogs_contacts_wrap li a span:contains(\''+addr+',\')").mousedown()');
  }

  async joinByLink(link) {
    await this.driver.get(link);
    await this.auth.setAuthKeys();
    await timeout(1000);
    await this.driver.executeScript('$(".tgme_action_web_button").click()');
  }

  async open(name) {
    if (~name.indexOf(joinlink)) {
      await this.joinByLink(name);
    } else if (name[0] === '@') {
      await this.find(name);
    }
    let result = [];
    let loadingTries = 0;
    let count = 0;
    while (loadingTries < 50) {
      await timeout(400);
      let messagesCont = await this.driver.findElement(By.className('im_history_messages_peer'));
      let items = await messagesCont.findElements(By.className('im_history_message_wrap'));
      count = 0;
      items.forEach(() => count++);

      let time = await this.driver.executeScript(
        'return $(".im_history_messages_peer .im_history_message_wrap .im_message_date_text").last().attr("data-content")'
      );
      let date = await this.driver.executeScript(
        'return $(".im_history_messages_peer .im_history_message_wrap .im_message_date_split_text").last().text()'
      );
      let text = await this.driver.executeScript(
        'return $(".im_history_messages_peer .im_history_message_wrap .im_message_text").last().text()'
      );
      let author = await this.driver.executeScript(
        '$(".im_history_messages_peer .im_history_message_wrap .im_message_author").last().click(); ' +
        'var name = $(".peer_modal_profile_name").text(); ' +
        'var login = $(".md_modal_section_param_value").first().text().trim(); ' +
        '$(".md_modal_action_close").last().click(); ' +
        'return {name, login}'
      );

      // $(".im_history_messages_peer .im_history_message_wrap .im_message_author").last().text()
      await this.driver.executeScript('$(".im_history_messages_peer .im_history_message_wrap").last().remove()');
      if (date || text) {
        const unf = date.split(',').slice(1,3).join('')+' '+time;
        date = moment(unf, 'MMMM DD YYYY hh:mm:ss A').local();
        result.push({
          date,
          text,
          author
        });
      }
      if (result.length % 30 === 0) {
        console.log(name, result.length);
      }
      if(result.length > 100) break;
      if (count === 0) {
        loadingTries++;
      } else {
        loadingTries = 0;
      }
    }
    // for(let i = result.length - 1; i > 0; i++) {
    //   let date = '2000.01.0.1 00:00:00';
    // }
    console.log('FINISH');
    fs.writeFile("data.json", JSON.stringify(result), function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  }
}

module.exports = Channel;