process.env['NODE_CONFIG_DIR'] = __dirname + '/../config'
const insertNewRows = require('../lib/clickhouse/create-stream')
const writeIntoTable = require('../lib/clickhouse/insert-into-table')
const randomData = require('../lib/clickhouse/random-data-generator');

(async () => {
  try {
    const deviceData = randomData()
    await insertNewRows(deviceData, writeIntoTable)
  } catch (err) {
    console.log(err)
  }
})()
