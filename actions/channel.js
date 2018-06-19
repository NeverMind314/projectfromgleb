const {By} = require('selenium-webdriver');
const {timeout} = require('../commons/helper');
const tries = 50;
const fs = require('fs');

class Channel {
  constructor(driver) {
    this.driver = driver;
  }

  async find(name) {
    let result = [];
    let items = null;
    for (let t = 0; t < tries; t++) {
      items = await this.driver.findElements(By.className('im_dialog_wrap'));
      await timeout(500);
      items.forEach(item => t = 9999); // exit
    }
    await this.driver.executeScript('$(".im_dialogs_search input").val("' + name + '");');
    await this.driver.executeScript('$(".im_dialogs_search input").change();');
    await timeout(500);
    for (let t = 0; t < tries; t++) {
      items = await this.driver.findElements(By.className('im_dialog_wrap'));
      await timeout(500);
      items.forEach(item => t = 9999); // exit
    }
    await this.driver.executeScript('$(".im_dialogs_contacts_wrap li a").mousedown();');
    let loadingTries = 0;
    while (loadingTries < 100) {
      await this.driver.executeScript('$(".im_history_scrollable_wrap").scrollTop(200)');
      let messagesCont = await this.driver.findElement(By.className('im_history_messages_peer'));
      let items = await messagesCont.findElements(By.className('im_history_message_wrap'));
      let count = 0;
      items.forEach(() => count++);
      const tmpArr = [];
      for (let i = 0; i < count; i++) {
        let time = null;
        let date = null;
        let text = null;
        try {
          const el = await items[i].findElement(By.className('im_message_date_text'));
          time = await el.getAttribute('data-content');
        } catch (e) {
          // console.log(e);
        }
        try {
          const el = await items[i].findElement(By.className('im_message_text'));
          text = await el.getText();
        } catch (e) {
          // console.log(e);
        }
        try {
          const el = await items[i].findElement(By.className('im_message_date_split_text'));
          date = await el.getText();
        } catch (e) {
          // console.log(e);
        }
        // console.log(time, date);
        if (date) {
          tmpArr.push({
            date
          });
        } else {
          tmpArr.push({
            time,
            text
          });
        }
      }
      result = result.concat(tmpArr.reverse());
      const loading = await this.driver.executeScript('return $(".im_history_loading_more_active").length;');
      if (loading === 0) {
        loadingTries++;
      } else {
        loadingTries = 0;
      }
      await timeout(100);
      // await this.driver.executeScript('$(".im_history_messages_peer .im_history_message_wrap").remove()');
    }
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