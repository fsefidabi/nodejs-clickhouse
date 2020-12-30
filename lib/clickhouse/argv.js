process.env['NODE_CONFIG_DIR'] = __dirname + '/../../config/'
const config = require('config')
const bulkSize = config.get('bulkFlow.size')
const table = config.get('devicesTable.tableName')

const yargs = require('yargs/yargs')(process.argv.slice(2))
  .option('table', {
    alias: 't',
    describe: 'Table name'
  })
  .option('bs', {
    alias: 'b',
    describe: 'Batch size in bulk examples'
  })
  .argv

const tableName = yargs.table || yargs.t || table
const batchSize = yargs.bs || yargs.b || bulkSize

module.exports = { tableName, batchSize }
