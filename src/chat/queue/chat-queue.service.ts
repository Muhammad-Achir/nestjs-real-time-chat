import { Injectable, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';
import { SendMessageQueueDto } from '../dto/send-message-queue.dto';

@Injectable()
export class ChatQueueService {
  private readonly logger = new Logger(ChatQueueService.name);
  private readonly queueName = 'private_chat';

  async publishToPrivateChat(data: SendMessageQueueDto): Promise<void> {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URI);
      const channel = await connection.createChannel();

      await channel.assertQueue(this.queueName, { durable: false });

      const payload = Buffer.from(JSON.stringify(data));
      channel.sendToQueue(this.queueName, payload);

      this.logger.log(`Message sent to queue "${this.queueName}": ${JSON.stringify(data)}`);

      setTimeout(() => {
        channel.close();
        connection.close();
      }, 500);
    } catch (error) {
      this.logger.error('Failed to publish message to queue', error);
      throw error;
    }
  }
}
