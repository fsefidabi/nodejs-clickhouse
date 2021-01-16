process.env['NODE_CONFIG_DIR'] = __dirname + '/../../config/'
const ClickHouse = require('@apla/clickhouse')
const asyncTimedCargo = require('async-timed-cargo')
const config = require('config')
const { columns } = require('./schema')
const { tableName } = require('./argv')

const dbConfig = config.get('dbConfig')
const ch = new ClickHouse({ host: dbConfig.host, port: dbConfig.port, queryOptions: { database: dbConfig.database } })
const fields = columns.map(col => `${col.name}`)

module.exports = async function writeIntoDatabase (data) {
  // Direct insert
  if (Array.isArray(data)) {
    await write(data)
  }

  // Insert through rabbitmq
  if (typeof data === 'string') {
    const cargo = asyncTimedCargo(async function (tasks, callback) {
      return callback(tasks)
    }, 50, 1000)

    setInterval(() => {
      cargo.push(JSON.parse(data), async function (tasks) {
        await write(tasks)
      })
    }, 5000)
  }
}

async function write (devicesValues) {
  try {
    const values = devicesValues.map(value => `(${Object.values(value).join(', ')})`).join(', ')
    await ch.querying(`INSERT INTO ${dbConfig.database}.${tableName} (${fields}) values ${values}`)
  } catch (err) {
    console.log(err)
  }
}
