process.env['NODE_CONFIG_DIR'] = __dirname + '/../../config/'
const amqp = require('amqplib/callback_api')
const config = require('config')

const username = config.get('amqpConfig.username')
const password = config.get('amqpConfig.password')
const host = config.get('amqpConfig.host')
let amqpConn = null

module.exports = function publisher (msg) {
  amqp.connect(`amqp://${username}:${password}@${host}`, function (err, conn) {
    amqpConn = conn
    onError(err)
    console.log('publisher is connected to rabbitmq')
    conn.createChannel(function (err, channel) {
      onError(err)
      channel.assertExchange('insert', 'fanout', { durable: true })
      setInterval(() => {
        channel.publish('insert', 'insert_queue', Buffer.from(msg), { persistent: true }, function (err) {
          onError(err)
        })
      }, 1)
    })
  })
}

function onError (err) {
  if (!err) return
  console.error('[AMQP] error', err)
  amqpConn.close()
}
