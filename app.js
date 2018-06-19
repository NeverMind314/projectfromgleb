const {Builder} = require('selenium-webdriver');
const auth = require('./actions/auth');
const Channel = require('./actions/channel');

(async () => {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    const authKeys = auth.getAuthKeys();
    await driver.get('https://web.telegram.org/#/im');
    authKeys.forEach(async item =>
      await driver.executeScript('localStorage.setItem(\'' + item.key + '\', \'' + item.value + '\');')
    )
    const channel = new Channel(driver);
    await channel.find('@readme');
    // await driver.sendKeys('webdriver', Key.RETURN);
    // await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  } finally {
    // await driver.quit();
  }
})();