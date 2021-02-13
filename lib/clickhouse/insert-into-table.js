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
  await insert(tasks)
  callback()
}, 5000, 2000)

module.exports = async function insertIntoTable (data) {
  if (!Array.isArray(data)) {
    data = [data]
  }
  cargo.push(data)
}

async function insert (devicesValues) {
  try {
    const values = devicesValues.map(value => `(${Object.values(value).join(', ')})`).join(', ')
    await ch.querying(`INSERT INTO ${dbConfig.database}.${tableName} (${fields}) values ${values}`)
  } catch (err) {
    console.log(err)
  }
}
