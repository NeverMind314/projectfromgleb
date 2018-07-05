const Auth = require('./actions/auth');
const Channel = require('./actions/channel');
const {getDriver} = require('./commons/driverAdaptor');
const fs = require('fs');
const {timeout} = require('./commons/helper');
const config = require('./config/config.json');

const schedule = [];
let runnerBusy = false;
let index = 0;
let currentChannelIndex = -1;

async function daemon() {
  if (schedule.filter(item => item.stage > 0).length < config.queue) {
    currentChannelIndex++;
  }
  const sessions = fs.readdirSync('storage').map(f => 'storage/' + f);
  if (currentChannelIndex === schedule.length) {
    currentChannelIndex = 0;
  }
  if (sessions.length === 0) {
    console.warn('Session list is empty');
    return;
  }
  if (!schedule[currentChannelIndex].stage) {
    schedule[currentChannelIndex].stage = 0;
  }
  if (schedule[currentChannelIndex].stage === 0
    && runnerBusy === false
    && schedule.filter(item => item.stage > 0).length < config.queue) {
    schedule[currentChannelIndex].startAt = Date.now();
    runnerBusy = true;
    const session = sessions[index];
    index = ((index + 1) === sessions.length) ? 0 : (index + 1);
    // console.log(currentChannelIndex, index, session, sessions.length);
    console.log('Start: ' + schedule[currentChannelIndex].addr, session);
    schedule[currentChannelIndex].driver = getDriver();
    try {
      const auth = new Auth(schedule[currentChannelIndex].driver, session);
      auth.open().then(() => {
        schedule[currentChannelIndex].stage = 1;
        runnerBusy = false;
      }).catch(async () => {
        runnerBusy = false;
        console.error('Authentication fail =(');
        await timeout(5000);
        await schedule[currentChannelIndex].driver.quit();
        schedule[currentChannelIndex].finishedAt = Date.now();
        schedule[currentChannelIndex].stage = 0;
      });
    } catch (err) {
      console.error('Auth err', err);
    }
    return;
  }
  if (schedule[currentChannelIndex].stage === 1) {
    console.log('Execute: ' + schedule[currentChannelIndex].addr);
    const channel = new Channel(schedule[currentChannelIndex].driver);
    channel.open(schedule[currentChannelIndex].addr).then(() => {
      schedule[currentChannelIndex].stage = 3;
    }).catch(async err => {
      console.error('Runtime error', err);
    });
    schedule[currentChannelIndex].stage = 2;
    return;
  }
  if (schedule[currentChannelIndex].stage === 3) {
    try {
      schedule[currentChannelIndex].stage = 4;
      await schedule[currentChannelIndex].driver.quit();
      const workTime = Date.now() - schedule[currentChannelIndex].startAt;
      schedule[currentChannelIndex].finishedAt = Date.now();
      console.log('Successfully finished: ' + schedule[currentChannelIndex].addr, workTime);
    } catch (err) {
      console.error(err);
    }
    // schedule[i].stage = 0;
  }

  if (schedule[currentChannelIndex].stage === 4 && (Date.now() - schedule[currentChannelIndex].finishedAt) > config.time_interval * 1000) {
    console.log('Restart ' + schedule[currentChannelIndex].addr);
    schedule[currentChannelIndex].stage = 0;
  }
}

setInterval(daemon, 3000);


// schedule.push({addr: 'https://t.me/joinchat/Cox1iA8fFnQ3kLhgKDtj-Q'});
schedule.push({addr: 'https://t.me/joinchat/Cox1iEuA3mnVaM_mj0_rQw'});
// schedule.push({addr: 'https://t.me/souper_group_named'});
// schedule.push({addr: 'https://t.me/channel_named'});


// schedule.push({addr: 'https://t.me/joinchat/E5jwUlL2wZVG7grfCpVaxw'});
// schedule.push({addr: 'https://t.me/joinchat/Eyrkag_6NROREVCgXfo1cA'});
// schedule.push({addr: '@meduzalive'});
// schedule.push({addr: '@ru_FTP'});
// schedule.push({addr: '@MRZLKVK'});
// schedule.push({addr: '@DavydovIn'});
// schedule.push({addr: '@oldlentach'});
// schedule.push({addr: '@varlamov'});
// schedule.push({addr: 'https://t.me/joinchat/Cox1iA8fFnQ3kLhgKDtj-Q'});
// schedule.push({addr: '@souper_group_named'});
// schedule.push({addr: '@channel_named'});
// schedule.push({addr: '@incriema'});
