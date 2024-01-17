const amqp = require('amqplib');

const eventBusUrl = process.env.EVENT_BUS_URL || 'amqp://localhost:5672';
const queueName = 'events';

async function setup() {
  const connection = await amqp.connect(eventBusUrl);
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName);

  // Consume messages from the queue
  channel.consume(queueName, (msg) => {
    console.log(`ServiceA received message: ${msg.content.toString()}`);
    // Add your processing logic here
  }, { noAck: true });

  console.log('ServiceA connected to the event bus');
}

setup();
