process.env['NODE_CONFIG_DIR'] = __dirname + '/../../config/'
const amqp = require('amqplib/callback_api')
const config = require('config')

const username = config.get('amqpConfig.username')
const password = config.get('amqpConfig.password')
const host = config.get('amqpConfig.host')
let amqpConn = null

module.exports = function consumer (worker) {
  amqp.connect(`amqp://${username}:${password}@${host}`, function (err, conn) {
    amqpConn = conn
    onError(err)
    console.log('consumer is connected to rabbitmq')

    conn.createChannel(function (err, channel) {
      onError(err)
      channel.assertExchange('insert', 'fanout', { durable: true })
      channel.assertQueue('insert_queue', { durable: true }, function (err, q) {
        onError(err)
        console.log('[*] Waiting for messages in %s. To exit press CTRL+C', q.queue)
        channel.bindQueue(q.queue, 'insert', 'insert_queue')
        channel.consume(q.queue, function (msg) {
          worker(msg.content)
          channel.ack(msg)
        }, { noAck: false })
      })
    })
  })
}

function onError (err) {
  if (!err) return
  console.error('[AMQP] error', err)
  amqpConn.close()
}
