const Auth = require('./actions/auth');
const readlineSync = require('readline-sync');
const {getDriver} = require('./commons/driverAdaptor');


const phone = readlineSync.question('Enter phone: ');
const driver = getDriver();
const auth = new Auth(driver);
auth.signIn(phone, () => {
  const code = readlineSync.question('Enter code: ');
  return code;
})
  .then(() => {
    console.log('Login success!');
    driver.quit();
  })
  .catch(e => {
    console.error(e);
    driver.quit();
  });
