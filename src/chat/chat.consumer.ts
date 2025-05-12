import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ChatGateway } from './chat.gateway';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class ChatConsumer implements OnModuleInit {
  constructor(
    private readonly gateway: ChatGateway,
    private readonly messageService: MessageService) {
  }

  async onModuleInit() {
    try {
      // const conn = await amqp.connect('amqp://rabbitmq');
      const conn = await amqp.connect(process.env.RABBITMQ_URI);
      const channel = await conn.createChannel();
      const queue = 'private_chat';

      await channel.assertQueue(queue, { durable: false });

      console.log('onmodule init')
      channel.consume(queue,async (msg) => {
        if (msg !== null) {
          const data = JSON.parse(msg.content.toString());
          const { senderId, receiverId, content } = data;

          // save to MongoDB
          const savedMessage = await this.messageService.createMessage(senderId, receiverId, content);
          console.log('[Consumer] Saved to DB:', savedMessage);

          // send message using gateway
          this.gateway.sendPrivateMessage(receiverId, { senderId, content });

          // Acknowledge pesan
          channel.ack(msg);
        }
      });
    } catch (err) {
      console.error('Failed connect to RabbitMQ:', err.message);
    }
  }
}
