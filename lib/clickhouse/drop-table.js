process.env['NODE_CONFIG_DIR'] = __dirname + '/../../config/'
const ClickHouse = require('@apla/clickhouse')
const config = require('config')
const { tableName } = require('./argv')

const dbConfig = config.get('dbConfig')
const ch = new ClickHouse({
  host: dbConfig.host, port: dbConfig.port, queryOptions: { database: dbConfig.database }
});

(async function () {
  try {
    await ch.query(`drop table ${tableName}`)
    console.log(`"${tableName}" table deleted successfully.`)
  } catch (err) {
    console.log(`"${tableName}" table does not exists.`)
  }
})()
