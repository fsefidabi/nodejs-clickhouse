process.env['NODE_CONFIG_DIR'] = __dirname + '/../../config/'
const amqp = require('amqplib/callback_api')
const dotenv = require('dotenv')
const config = require('config')

dotenv.config({ path: __dirname + '/../../.env' })
const exchange = config.get('amqpConfig.exchange')
const bindingKeys = config.get('amqpConfig.bindingKeys')

let amqpConn = null
let amqpChan = null

function startPublisher (dataGenerator) {
  amqp.connect(`amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASS}@${process.env.RMQ_HOST}`, function (err, conn) {
    if (err) {
      console.error('[AMQP] error in publisher', err.message)
      return setTimeout(startPublisher, 1000)
    }
    conn.on('error', err => {
      if (err.message !== 'Publisher\'s connection is closing') {
        console.error('[AMQP] conn error in publisher', err.message)
      }
    })
    conn.on('close', _ => {
      console.error('[AMQP] publisher is reconnecting')
      return setTimeout(startPublisher, 1000)
    })

    amqpConn = conn
    console.log('publisher is connected to rabbitmq')
    createChannel(dataGenerator)
  })
}

function createChannel (dataGenerator) {
  amqpConn.createConfirmChannel(function (err, channel) {
    if (err) {
      console.error('[AMQP] channel error in publisher', err.message)
      return setTimeout(startPublisher, 1000)
    }
    amqpChan = channel
    channel.assertExchange(exchange, 'direct', { durable: true })
    setInterval(() => {
      bindingKeys.forEach(bindingKey => {
        publish(exchange, bindingKey, dataGenerator)
      })
    }, 1)
  })
}

function publish (exchange, bindingKey, dataGenerator) {
  const msg = JSON.stringify(dataGenerator())
  amqpChan.publish(exchange, bindingKey, Buffer.from(msg), { persistent: true }, function (err) {
    if (err) console.log(err)
  })
}

module.exports = startPublisher
