process.env['NODE_CONFIG_DIR'] = __dirname + '/../../config/'
const ClickHouse = require('@apla/clickhouse')
const config = require('config')
const { columns } = require('./schema')
const { tableName } = require('./argv')

const dbConfig = config.get('dbConfig')
const ch = new ClickHouse({ host: dbConfig.host, port: dbConfig.port, queryOptions: { database: dbConfig.database } })
const fields = columns.map(col => `${col.name} ${col.type}`);

(async function createTable () {
  try {
    await ch.query(`CREATE TABLE ${dbConfig.database}.${tableName} (${fields.join(', ')}) ENGINE = MergeTree PARTITION BY toYYYYMM("launchTime") ORDER BY ("launchCount")`)
    console.log(`connected to ${dbConfig.database}.${tableName} table.`)
  } catch (err) {
    console.log(`"${tableName}" table already exists in ${dbConfig.database} database.`)
  }
})()
