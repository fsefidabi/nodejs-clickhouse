const startPublisher = require('../lib/rabbitmq/publisher')
const startConsumer = require('../lib/rabbitmq/consumer')
const writeIntoDatabase = require('../lib/clickhouse/insert-into-table')
const randomData = require('../lib/clickhouse/random-data-generator')

startConsumer(writeIntoDatabase)
startPublisher(randomData)
