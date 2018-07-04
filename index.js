const Auth = require('./actions/auth');
const Channel = require('./actions/channel');
const {getDriver} = require('./commons/driverAdaptor');
const fs = require('fs');

const schedule = [];
let runnerBusy = false;
let index = 0;
async function daemon() {
  const sessions = fs.readdirSync('storage').map(f => 'storage/' + f);
  if (sessions.length === 0) {
    console.warn('Sessions list is empty');
    return;
  }
  for (let i = 0; i < schedule.length; i++) {
    if (!schedule[i].stage) {
      schedule[i].stage = 0;
    }
    if (schedule[i].stage === 0 && runnerBusy === false) {
      schedule[i].startAt = Date.now();
      runnerBusy = true;
      const session = sessions[index];
      index = ((index+1) === sessions.length) ? 0 : (index+1);
      // console.log(i, index, session, sessions.length);
      console.log('Start: ' + schedule[i].addr, session);
      schedule[i].driver = getDriver();
      const auth = new Auth(schedule[i].driver, session);
      auth.open().then(() => {
        schedule[i].stage = 1;
        runnerBusy = false;
      }).catch(async err => {
        runnerBusy = false;
        console.error('Authentication fail =(', err);
        await schedule[i].driver.quit();
        schedule[i].finishedAt = Date.now();
        schedule[i].stage = 0;
      });
      continue;
    }

    if (schedule[i].stage === 1) {
      console.log('Execute: ' + schedule[i].addr);
      const channel = new Channel(schedule[i].driver);
      channel.open(schedule[i].addr).then(() => {
        schedule[i].stage = 3;
      }).catch(async err => {
        console.error('Runtime error', err);
      });
      schedule[i].stage = 2;
      continue;
    }

    if (schedule[i].stage === 3) {
      schedule[i].stage = 4;
      await schedule[i].driver.quit();
      const workTime = Date.now() - schedule[i].startAt;
      schedule[i].finishedAt = Date.now();
      console.log('Successfully finished: ' + schedule[i].addr, workTime);
      schedule[i].stage = 0;
    }

    // if (schedule[i].stage === 4 && (Date.now() - schedule[i].finishedAt) > 10 * 1000 ) {
    //   console.log('Restart ' + schedule[i].addr);
    //   schedule[i].stage = 0;
    // }
  }
}
setInterval(daemon, 3000);



schedule.push({addr: 'https://t.me/joinchat/Cox1iA8fFnQ3kLhgKDtj-Q'});
schedule.push({addr: 'https://t.me/joinchat/Cox1iEuA3mnVaM_mj0_rQw'});
schedule.push({addr: 'https://t.me/souper_group_named'});
schedule.push({addr: 'https://t.me/channel_named'});
schedule.push({addr: 'https://web.telegram.org/#/im?p=s1100817720_12837046066004865967'});


// schedule.push({addr: 'https://t.me/joinchat/E5jwUlL2wZVG7grfCpVaxw'});
// schedule.push({addr: 'https://t.me/joinchat/Eyrkag_6NROREVCgXfo1cA'});
// schedule.push({addr: '@meduzalive'});
// schedule.push({addr: '@ru_FTP'});
// schedule.push({addr: '@MRZLKVK'});
// schedule.push({addr: '@DavydovIn'});
// schedule.push({addr: '@oldlentach'});
// schedule.push({addr: '@varlamov'});
// schedule.push({addr: 'https://t.me/joinchat/Cox1iA8fFnQ3kLhgKDtj-Q'});
// schedule.push({addr: 'https://web.telegram.org/#/im?tgaddr=tg:%2F%2Fjoin%3Finvite%3DCox1iEuA3mnVaM_mj0_rQw'});
// schedule.push({addr: '@souper_group_named'});
// schedule.push({addr: '@channel_named'});
// schedule.push({addr: '@incriema'});
