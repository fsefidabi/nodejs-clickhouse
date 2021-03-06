const Chance = require('chance')
const chance = new Chance()

const randomDataGenerator = () => {
  return {
    "launchCount": chance.integer({ min: 1, max: 350 }),
    "launchTime": `'${chance.date({ year: 2019, month: 4 }).toISOString().slice(0, 10)}'`,
    "installDate": chance.date({ year: 2019, month: 2 }).toISOString().slice(0, 10),
    "osVersion": chance.pickone([
      "'1.1.1'",
      "'1.1.1-staging'",
      "'1.3.0'",
      "'1.1.2'",
      "'1.1.3'"
    ]),
    "deviceModel": chance.pickone([
      "'Mi A2'",
      "'M8'",
      "'S7'",
      "'S6'",
      "'Note 2'",
      "'Note'",
      "'N78'"
    ]),
    "deviceToken": `'${chance.android_id()}'`,
    "deviceType": "'android'",
    "userId": chance.phone({ formatted: false }),
    "tokenStatus": chance.pickone(["'ALLOWED'", "'DENIED'", "'TOKEN:ERR'"]),
    "appId": "'appId'",
    ip: `'${chance.ip()}'`,
    connection: chance.pickone(["'WiFi'", "'3G'", "'4G'", "'LAN'", "'UNKNOWN'"]),
    "appVersion": chance.pickone([
      "'1.1.0'",
      "'0.8.9'",
      "'0.9.0'",
      "'0.9.1'",
      "'0.9.2'",
      "'0.9.4'"
    ]),
    created: `'${chance.date({ year: 2019, month: 2 }).toISOString().slice(0, 10)}'`,
    modified: `'${chance.date({ year: 2019, month: 4 }).toISOString().slice(0, 10)}'`,
    status: "'Active'",
    subscriptions: "'default'",
    "timeZone": "'Asia/Tehran'",
    "adId": "'461CD5D8-3CCF-457A-96F6-8C8023A56A84'",
    tags: chance.pickone([
      "['male']",
      "['female', 'vip']",
      "['L1']",
      "['male', 'vip', 'L1']"
    ]),
    "event_purchase_firstOccurrence": `'${chance.date({
      year: 2019,
      month: 2
    }).toISOString().slice(0, 10)}'`,
    "event_purchase_lastOccurrence": `'${chance.date({
      year: chance.year({ min: 2015, max: 2020 }),
      month: 3
    }).toISOString().slice(0, 10)}'`,
    event_purchase_count: chance.integer({ min: 1, max: 4 }),
    "userInfo_name": "'Full Name generated by chance'",
    "userInfo_birthday": `'${chance.date().toISOString().slice(0, 10)}'`, // timestamp of date generated by chance,
    "userInfo_categories": chance.pickone([
      "['apple']",
      "['orange', 'apple']",
      "['golabi']",
      "['berry', 'pumbkin', 'apple', 'golabi']"
    ])
  }
}

module.exports = randomDataGenerator
