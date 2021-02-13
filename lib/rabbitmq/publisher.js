const channel = require('./connection');

async function startPublisher (dataGenerator) {
  const ch = await channel()
  ch.assertExchange('insert', 'direct', { durable: true })
  setInterval(() => {
    const msg = JSON.stringify(dataGenerator())
    ch.publish('insert', 'insertIntoDb', Buffer.from(msg), { persistent: true })
  }, 1)
}

module.exports = startPublisher
