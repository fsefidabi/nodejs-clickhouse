process.env['NODE_CONFIG_DIR'] = __dirname + '/../../config/'
const ClickHouse = require('@apla/clickhouse')
const asyncTimedCargo = require('async-timed-cargo')
const config = require('config')
const { columns } = require('./schema')
const { tableName } = require('./argv')

const dbConfig = config.get('dbConfig')
const ch = new ClickHouse({ host: dbConfig.host, port: dbConfig.port, queryOptions: { database: dbConfig.database } })
const fields = columns.map(col => `${col.name}`)
let collectingData = []
let values = []

module.exports = async function writeIntoDatabase (data) {
  // Direct insert
  if (Array.isArray(data)) {
    for (let values of data) {
      values = `(${Object.values(values).join(', ')})`
    }
    values = data.map(values => `(${Object.values(values).join(', ')})`).join(', ')
    await ch.querying(`INSERT INTO ${dbConfig.database}.${tableName} (${fields}) values ${values}`)
  }

  // Insert through rabbitmq
  if (data instanceof Buffer) {
    await collectData(data)
  }
}

async function collectData (data) {
  const stringMsg = data.toString()
  const deviceObj = JSON.parse(stringMsg)
  const deviceValues = `(${Object.values(deviceObj).join(', ')})`
  collectingData.push(deviceValues)
  setTimeout(_ => {
    cargo.push(collectingData)
    collectingData = []
  }, 500)

  const cargo = asyncTimedCargo(async function (tasks, callback) {
    const values = tasks.join(', ')
    try {
      await ch.querying(`INSERT INTO ${dbConfig.database}.${tableName} (${fields}) values ${values}`)
    } catch (err) {
      console.log(err)
    }
    return callback()
  }, 1000, 1000)
}
