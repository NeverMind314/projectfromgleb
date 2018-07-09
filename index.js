const Auth = require('./actions/auth');
const Channel = require('./actions/channel');
const {getDriver} = require('./commons/driverAdaptor');
const fs = require('fs');
const {timeout} = require('./commons/helper');
const config = require('./config/config.json');


function conveyor(users, channels) {
  let j = 0;
  let result = {};
  for (let i = 0; i < users.length && j < channels.length; i++) {
    if (result[users[i]] === undefined) {
      result[users[i]] = [];
    }
    result[users[i]].push(channels[j++]);
    if (i === users.length - 1) {
      i = -1;
    }
  }
  return result;
}

function getUsers() {
  return fs.readdirSync('storage')
    .filter(f => f[0] !== '.')
    .map(f => 'storage/' + f);
}

function getChannels() {
  const schedule = require('./config/channels.json');
  return schedule;
}

const users = getUsers();
const channels = getChannels();
const order = conveyor(users.slice(0, config.queue), channels);

Object.keys(order).forEach(async user => {
  let i = 0;
  while(true) {
    const channel = order[user][i++];
    try {
      const driver = getDriver();
      const auth = new Auth(driver, user);
      await auth.open();
      const c = new Channel(driver);
      await c.invoke(channel.link);
      await driver.quit();
    } catch (e) {
      console.error('ERROR', user, 'channel #' + i);
      console.error(e);
    }
    if (i === order[user].length) {
      i = 0;
    }
    await timeout(config.time_interval * 1000);
  }
});