const session = require('../storage/session.json');
const home = require('../actions/constants').home;

class Auth {
  constructor(driver) {
    this.driver = driver;
  }

  async open() {
    await this.driver.get(home);
    await this.setAuthKeys();
  }

  async setAuthKeys() {
    session.forEach(async item =>
      await this.driver.executeScript('localStorage.setItem(\'' + item.key + '\', \'' + item.value + '\');')
    )
  }
}

module.exports = Auth;