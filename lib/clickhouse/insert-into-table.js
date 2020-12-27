process.env['NODE_CONFIG_DIR'] = __dirname + '/../../config/'
const ClickHouse = require('@apla/clickhouse')
const config = require('config')
const { columns } = require('./schema')
const { tableName } = require('./argv')

const dbConfig = config.get('dbConfig')
const batchSize = config.get('bulkFlow.size')
const ch = new ClickHouse({ host: dbConfig.host, port: dbConfig.port, queryOptions: { database: dbConfig.database } })
const fields = columns.map(col => `${col.name}`)
let collectingData = []
let values = []

module.exports = async function writeIntoTable (data) {
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
    const deviceObj = JSON.parse(data.toString())
    const deviceValues = `(${Object.values(deviceObj).join(', ')})`
    let inputLength = 0
    async function collectData () {
      if (collectingData.length < batchSize) {
        collectingData.push(deviceValues)
        inputLength = collectingData.length
      }

      setTimeout(async () => {
        const finalInputLength = collectingData.length
        if (finalInputLength === inputLength) {
          values = collectingData.join(', ')
          console.log(`${finalInputLength} records inserted successfully.`)
          collectingData = []
          await ch.querying(`INSERT INTO ${dbConfig.database}.${tableName} (${fields}) values ${values}`)
        }
      }, 1000)

      if (collectingData.length === batchSize) {
        values = collectingData.join(', ')
        console.log(`${batchSize} records inserted successfully.`)
        collectingData = []
        await ch.querying(`INSERT INTO ${dbConfig.database}.${tableName} (${fields}) values ${values}`)
      }
    }
    await collectData()
  }
}
