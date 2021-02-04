const channel = require('./connection');

async function startConsumer (worker) {
  const ch = await channel()
  ch.assertExchange('insert', 'direct', { durable: true })
  ch.assertQueue('insertQueue', { durable: true })
  console.log('[*] Waiting for messages in insertQueue. To exit press CTRL+C')
  ch.bindQueue('insertQueue', 'insert', 'insertIntoDb')
  ch.consume('insertQueue', function (msg) {
    const stringMsg = msg.content.toString()
    worker(stringMsg)
    ch.ack(msg)
  }, { noAck: false })
}

module.exports = startConsumer
