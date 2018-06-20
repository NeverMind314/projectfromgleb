const {Builder} = require('selenium-webdriver');
const auth = require('./actions/auth');
const Channel = require('./actions/channel');
const process = require('process');
const os = require('os');

switch(os.platform()) {
  case 'darwin': process.env['PATH'] = 'drivers/macos'; break;
  case 'win32': process.env['PATH'] = 'drivers/windows'; break;
  case 'linux': process.env['PATH'] = 'drivers/linux'; break;
}

(async () => {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    const authKeys = auth.getAuthKeys();
    await driver.get('https://web.telegram.org/#/im');
    authKeys.forEach(async item =>
      await driver.executeScript('localStorage.setItem(\'' + item.key + '\', \'' + item.value + '\');')
    )
    const channel = new Channel(driver);
    await channel.find('@varlamov');
    // await driver.sendKeys('webdriver', Key.RETURN);
    // await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  } finally {
    // await driver.quit();
  }
})();

// 00-58