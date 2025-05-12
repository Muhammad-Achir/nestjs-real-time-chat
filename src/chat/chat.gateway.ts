import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as amqp from 'amqplib';
import { SendMessageQueueDto } from './dto/send-message-queue.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) { }

  async handleConnection(client: Socket) {
    const token = client.handshake.query.token as string;

    if (!token) {
      client.disconnect();
      console.log('No token provided');
      return;
    }

    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      client.data.userId = userId; // save userId in socket

      client.join(`user:${userId}`);
      console.log(`User ${userId} connected via WebSocket`);
    } catch (err) {
      client.disconnect();
      console.log('Invalid token:', err.message);
    }
  }

  @SubscribeMessage('private_message')
  async handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessageQueueDto

  ) {
    // const { senderId, receiverId, content } = data;
    const senderId = client.data.userId;
    const { receiverId, content } = data;

    // Validation
    if (!senderId || !receiverId || !content) {
      console.log('Missing required fields');
      return;
    }

    // validate receiverId in database
    const receiver = await this.userModel.findById(receiverId);
    if (!receiver) {
      client.emit('error', { message: 'Receiver not found' });
      return;
    }

    // payload for RabbitMQ
    const payload = {
      senderId,
      receiverId: receiverId,
      content: content,
    };

    // connect to rabbitmq and send to queue
    // const conn = await amqp.connect('amqp://rabbitmq');
    const conn = await amqp.connect(process.env.RABBITMQ_URI);
    const channel = await conn.createChannel();
    const queue = 'private_chat';

    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)));

    setTimeout(() => {
      channel.close();
      conn.close();
    }, 500);
  }

  sendPrivateMessage(receiverId: string, data: { senderId: string; content: string }) {
    const message = `${data.senderId}: ${data.content}`;
    this.server.to(`user:${receiverId}`).emit('private_message', message);
  }
}

