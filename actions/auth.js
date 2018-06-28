const session = require('../storage/session.json');
const home = require('../actions/constants').home;
const {timeout} = require('../commons/helper');

class Auth {
  constructor(driver) {
    this.driver = driver;
  }

  async open() {
    await this.driver.get(home);
    await this.setAuthKeys();
  }

  async setAuthKeys() {
    let isSigned = false;
    for(let t = 0; t < 10 && !isSigned; t++) {
      for (let i = 0; i < session.length; i++) {
        await this.driver.executeScript('localStorage.setItem(\'' + session[i].key + '\', \'' + session[i].value + '\');');
      }
      await timeout(1000);
      isSigned = await this.driver.executeScript('return $(".login_form_head").length === 0');
      if (!isSigned) {
        console.log('Sign in fail. Tries #' + (t+1));
        await this.driver.navigate().refresh();
      }
    }
    if (!isSigned) {
      throw 'Login fail';
    }
  }
}

module.exports = Auth;