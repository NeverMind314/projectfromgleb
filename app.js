const {Builder} = require('selenium-webdriver');
const Auth = require('./actions/auth');
const Channel = require('./actions/channel');
const process = require('process');
const os = require('os');

switch (os.platform()) {
  case 'darwin':
    process.env['PATH'] = 'drivers/macos';
    break;
  case 'win32':
    process.env['PATH'] = 'drivers/windows';
    break;
  case 'linux':
    process.env['PATH'] = 'drivers/linux';
    break;
}

const schedule = [];
let runnerBusy = false;
async function demon() {
  for (let i = 0; i < schedule.length; i++) {
    if (!schedule[i].stage) {
      schedule[i].stage = 0;
    }
    if (schedule[i].stage === 0 && runnerBusy === false) {
      runnerBusy = true;
      console.log('Start: ' + schedule[i].addr);
      schedule[i].driver = await new Builder().forBrowser('firefox').build();
      const auth = new Auth(schedule[i].driver);
      auth.open().then(() => {
        schedule[i].stage = 1;
        runnerBusy = false;
      }).catch(err => {
        console.log(err)
      });
      continue;
    }

    if (schedule[i].stage === 1) {
      console.log('Execute: ' + schedule[i].addr);
      const channel = new Channel(schedule[i].driver);
      channel.open(schedule[i].addr).then(() => {
        schedule[i].stage = 3;
      }).catch(err => {
        console.log(err)
      });
      schedule[i].stage = 2;
      continue;
    }

    if (schedule[i].stage === 3) {
      schedule[i].stage = 4;
      await schedule[i].driver.quit();
      console.log('Successfully finished: ' + schedule[i].addr);
    }
  }
}
setInterval(demon, 3000); // 00-53

async function start(addr) {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    const auth = new Auth(driver);
    await auth.open();
    const channel = new Channel(driver);
    await channel.open(addr);
    // channel.open('@varlamov').then();
    // await driver.sendKeys('webdriver', Key.RETURN);
    // await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  } finally {
    await driver.quit();
  }
}

schedule.push({addr: '@habra'});
schedule.push({addr: '@breakingmash'});
schedule.push({addr: '@lentachold'});
schedule.push({addr: '@meduzalive'});
schedule.push({addr: '@ru_FTP'});
schedule.push({addr: '@MRZLKVK'});
schedule.push({addr: '@DavydovIn'});
schedule.push({addr: '@oldlentach'});
schedule.push({addr: '@varlamov'});



// 23-38 / 23-46