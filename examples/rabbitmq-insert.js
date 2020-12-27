const consumer = require('../lib/rabbitmq/consumer')
const publisher = require('../lib/rabbitmq/publisher')
const writeIntoTable = require('../lib/clickhouse/insert-into-table')
const randomData = require('../lib/clickhouse/random-data-generator')

consumer(writeIntoTable)
publisher(JSON.stringify(randomData()))
