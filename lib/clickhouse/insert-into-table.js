process.env['NODE_CONFIG_DIR'] = __dirname + '/../../config/'
const ClickHouse = require('@apla/clickhouse')
const asyncTimedCargo = require('async-timed-cargo')
const config = require('config')
const { columns } = require('./schema')
const { tableName } = require('./argv')

const dbConfig = config.get('dbConfig')
const ch = new ClickHouse({ host: dbConfig.host, port: dbConfig.port, queryOptions: { database: dbConfig.database } })
const fields = columns.map(col => `${col.name}`)
const cargo = asyncTimedCargo(async function (tasks, callback) {
  callback(tasks)
}, 5, 1000)

module.exports = async function writeIntoDatabase (data) {
  // Direct insert
  if (Array.isArray(data)) {
    await write(data)
  }

  // Insert through rabbitmq
  if (typeof data === 'string') {
    // cargo.push(JSON.parse(data))
    cargo.push(JSON.parse(data), async function (tasks) {
      await write(tasks)
    })
  }
}

async function write (devicesValues) {
  try {
    const values = devicesValues.map(value => `(${Object.values(value).join(', ')})`).join(', ')
    console.log('---------------------------', values)
    // await ch.querying(`INSERT INTO ${dbConfig.database}.${tableName} (${fields}) values ${values}`)
  } catch (err) {
    console.log(err)
  }
}
