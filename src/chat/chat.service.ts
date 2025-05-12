import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SendMessageQueueDto } from './dto/send-message-queue.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { ChatQueueService } from './queue/chat-queue.service';
import { User } from 'src/user/user.schema';

@Injectable()
export class ChatService {

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly chatQueueService: ChatQueueService,
  ) { }

  async sendMessageToQueue(data: SendMessageQueueDto) {
    // if (!isValidObjectId(data.receiverId)) {
    //   throw new BadRequestException('Invalid receiver ID');
    // }

    const receiver = await this.userModel.findById(data.receiverId);
    console.log('send message to queue')
    console.log(receiver)
    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    await this.chatQueueService.publishToPrivateChat(data);

    return { queued: true };
  }
}
