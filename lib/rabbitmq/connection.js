process.env['NODE_CONFIG_DIR'] = __dirname + '/../../config/'
const amqp = require('amqplib')
const dotenv = require('dotenv')

dotenv.config({ path: __dirname + '/../../.env' })

module.exports = async function createConnection (){
  try {
    const conn = await amqp.connect(`amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASS}@${process.env.RMQ_HOST}`)
    conn.on('error', function (err) {
      console.log('AMQP: Error: ', err);
    });
    conn.on('close', () => {
      console.log("AMQP Closed");
    });
    const channel = await conn.createChannel()
    return channel
  } catch (err) {
    console.error('[AMQP] error ', err.message)
    return setTimeout(createConnection, 1000)
  }
}
