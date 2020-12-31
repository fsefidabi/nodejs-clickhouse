process.env['NODE_CONFIG_DIR'] = __dirname + '/../../config/'
const amqp = require('amqplib/callback_api')
const asyncTimedCargo = require('async-timed-cargo')
const ClickHouse = require('@apla/clickhouse')
const config = require('config')
const { columns } = require('../clickhouse/schema')
const dotenv = require('dotenv')

dotenv.config({ path: __dirname + '/../../.env' })
const dbConfig = config.get('dbConfig')
const ch = new ClickHouse({ host: dbConfig.host, port: dbConfig.port, queryOptions: { database: dbConfig.database } })
const fields = columns.map(col => `${col.name}`)

let amqpConn = null
let amqpChan = null
const collectingData = []

function startConsumer () {
  amqp.connect(`amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASS}@${process.env.RMQ_HOST}`, function (err, conn) {
    if (err) {
      console.error('[AMQP] error in consumer', err.message)
      return setTimeout(startConsumer, 1000)
    }
    conn.on('error', err => {
      if (err.message !== 'Consumer\'s connection is closing') {
        console.error('[AMQP] conn error in consumer', err.message)
      }
    })
    conn.on('close', _ => {
      console.error('[AMQP] consumer is reconnecting')
      return setTimeout(startConsumer, 1000)
    })

    amqpConn = conn
    console.log('consumer is connected to rabbitmq')
    createChannel()
  })
}

function createChannel () {
  amqpConn.createConfirmChannel(function (err, channel) {
    if (err) {
      console.error('[AMQP] channel error in consumer', err.message)
      return setTimeout(startConsumer, 1000)
    }
    amqpChan = channel
    channel.assertExchange('insert', 'direct', { durable: true })
    assertQueue('insert', 'insertQueue', 'insertIntoDb')
  })
}

function assertQueue (exchange, queue, bindingKey) {
  amqpChan.assertQueue(queue, { durable: true })
  console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`, queue)
  amqpChan.bindQueue(queue, exchange, bindingKey)
  amqpChan.consume(queue, function (msg) {


    const stringMsg = msg.content.toString()
    const deviceObj = JSON.parse(stringMsg)
    const deviceValues = `(${Object.values(deviceObj).join(', ')})`
    collectingData.push(deviceValues)

    setTimeout(_ => {
      cargo.push(collectingData)
    }, 500)

    const cargo = asyncTimedCargo(async function (tasks, callback) {
      const values = tasks.join(', ')
      console.log(values)
      await ch.querying(`INSERT INTO test.devices (${fields}) values ${values}`)
      return callback()
    }, 100, 1000)


    amqpChan.ack(msg)
  }, { noAck: false })
}

module.exports = startConsumer
