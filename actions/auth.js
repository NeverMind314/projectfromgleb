const home = require('../actions/constants').home;
const login = require('../actions/constants').login;
const {timeout} = require('../commons/helper');
const fs = require('fs');

class Auth {
  constructor(driver, session) {
    this.driver = driver;
    if (session) {
      try {
        this.session = JSON.parse(fs.readFileSync(session));
      } catch (e) {
        console.error('Read session error', session);
        throw e;
      }
    } else {
      console.warn('Session is empty');
    }
  }

  async open() {
    await this.driver.get(home);
    await this.setAuthKeys();
  }

  async signIn(phone, codeCallBack) {
    if(!phone || !/^((\+7)+([0-9]){10})$/.test(phone)) {
      throw 'Unsupported phone format. Need +00000000000';
    }
    if(typeof codeCallBack !== 'function') {
      throw 'Callback for code entering is not exist';
    }
    try {
      await this.driver.get(login);
      await timeout(3000);
      await this.driver.executeScript(
        '$("input[name=\'phone_country\']").val("' + phone.slice(0, 2) + '"); ' +
        '$("input[name=\'phone_country\']").change();');
      await timeout(3000);
      await this.driver.executeScript(
        '$("input[name=\'phone_number\']").val("' + phone.slice(2, 12) + '"); ' +
        '$("input[name=\'phone_number\']").change();');
      await timeout(3000);
      await this.driver.executeScript(
        '$("input[name=\'phone_country\']").val("' + phone.slice(0, 2) + '"); ' +
        '$("input[name=\'phone_country\']").change();');
      await timeout(1000);
      await this.driver.executeScript('$(".login_head_submit_btn").click();');
      await timeout(1000);
      await this.driver.executeScript('$("button.btn-md-primary").click();');
      const code = codeCallBack();
      await this.driver.executeScript('$("input[name=\'phone_code\']").val("' + code + '");');
      await this.driver.executeScript('$("input[name=\'phone_code\']").change();');
      await timeout(1000);
      await this.saveAuthSession(phone);
    } catch (e) {
      throw 'Auth is failed =(';
    }
  }

  async saveAuthSession(name) {
    const session = await this.driver.executeScript(
      'var arr = []; ' +
      'for ( var i = 0, len = localStorage.length; i < len; ++i ) ' +
      '  arr.push({ key: localStorage.key( i ), value: localStorage.getItem( localStorage.key( i ) ) }); ' +
      'return arr;'
    );
    fs.writeFile('storage/' + name, JSON.stringify(session), err => {
      if (err) throw err;
      console.log('Session saved!');
    });
  }

  async setAuthKeys() {
    let isSigned = false;
    for(let t = 0; t < 10 && !isSigned; t++) {
      for (let i = 0; i < this.session.length; i++) {
        // console.log(this.session[i].key)
        await this.driver.executeScript('localStorage.setItem(\'' + this.session[i].key + '\', \'' + this.session[i].value + '\');');
      }
      await timeout(1000);
      isSigned = await this.driver.executeScript('return $(".login_form_head").length === 0');
      if (!isSigned) {
        console.log('Sign in fail. Tries #' + (t+1));
        await this.driver.navigate().refresh();
      }
    }
    console.log('Signed', isSigned);
    if (!isSigned) {
      throw 'Login fail';
    }
  }
}

module.exports = Auth;