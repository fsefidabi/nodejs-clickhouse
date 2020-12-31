process.env['NODE_CONFIG_DIR'] = __dirname + '/../../config/'
const amqp = require('amqplib/callback_api')

const dotenv = require('dotenv')

dotenv.config({ path: __dirname + '/../../.env' })

let amqpConn = null
let amqpChan = null

function startConsumer (worker) {
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
    createChannel(worker)
  })
}

function createChannel (worker) {
  amqpConn.createConfirmChannel(function (err, channel) {
    if (err) {
      console.error('[AMQP] channel error in consumer', err.message)
      return setTimeout(startConsumer, 1000)
    }
    amqpChan = channel
    channel.assertExchange('insert', 'direct', { durable: true })
    assertQueue('insert', 'insertQueue', 'insertIntoDb', worker)
  })
}

function assertQueue (exchange, queue, bindingKey, worker) {
  amqpChan.assertQueue(queue, { durable: true })
  console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`, queue)
  amqpChan.bindQueue(queue, exchange, bindingKey)
  amqpChan.consume(queue, function (msg) {
    worker(msg.content)
    amqpChan.ack(msg)
  }, { noAck: false })
}

module.exports = startConsumer
