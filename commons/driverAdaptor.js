const chrome = require('selenium-webdriver/chrome');
const process = require('process');
const {join} = require('path');
const os = require('os');

let pathToDriver;
switch (os.platform()) {
  case 'darwin':
    pathToDriver = 'drivers/macos/chromedriver';
    break;
  case 'win32':
    pathToDriver = 'drivers/windows/chromedriver.exe';
    break;
  case 'linux':
    pathToDriver = 'drivers/linux/chromedriver';
    break;
  default:
    throw 'Unsupported platform: ' + os.platform()
}
const webdriver = require('selenium-webdriver');
const options = new chrome.Options();
// options.addArguments('headless');
// options.addArguments('disable-gpu');
options.addArguments("--no-sandbox");
options.addArguments("--blink-settings=imagesEnabled=false");
chrome.setDefaultService(
  new chrome.ServiceBuilder(join('./', pathToDriver)).build()
);

module.exports.getDriver = () => {
  return new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(webdriver.Capabilities.chrome())
    .setChromeOptions(options)
    .build()
};