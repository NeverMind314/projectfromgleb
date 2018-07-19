const Auth = require('./actions/auth');
const Channel = require('./actions/channel');
const {getDriver} = require('./commons/driverAdaptor');
const fs = require('fs');
const {timeout} = require('./commons/helper');
const config = require('./config/config.json');
const Queue = require('./api/services/channelQueue.service')


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

async function getChannels() {
  const queue = new Queue();
  const schedule = await queue.getQueue();
  return schedule;
}

async function worker() {
  const users = getUsers();
  const channels = await getChannels();
  const order = conveyor(users.slice(0, config.queue), channels);

  let tasks = 0;
  Object.keys(order).forEach(async user => {
    tasks++;
    let i = 0;
    while(true) {
      const channel = order[user][i++];
      const newChannels = await getChannels();
      if (channels.length !== newChannels.length) {
        break;
      }
      const driver = getDriver();
      try {
        const auth = new Auth(driver, user);
        await auth.open();
        const c = new Channel(driver);
        await c.invoke(channel.link.trim());
        await driver.quit();
      } catch (e) {
        await driver.quit();
        console.error('ERROR', user, 'channel #' + i);
        console.error(e);
      }
      if (i === order[user].length) {
        i = 0;
      }
      await timeout(config.time_interval * 1000);
    }
    tasks--;
  });
  await (new Promise((resolve) => {
    const id = setInterval(() => {
      if (tasks === 0) {
        resolve();
        clearInterval(id);
      }
    }, 500);
  }));
}

(async () => {
  while (true) {
    await worker();
    console.log('RESTART ALL WORKERS')
  }
})();