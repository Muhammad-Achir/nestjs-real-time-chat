import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './message.model';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) { }

  async createMessage(sender: string, receiver: string, content: string) {
    const message = new this.messageModel({ sender, receiver, content });
    return message.save();
  }

  async findMessagesBetweenUsers(userA: string, userB: string) {
    return this.messageModel
      .find({
        $or: [
          { sender: userA, receiver: userB },
          { sender: userB, receiver: userA },
        ],
      })
      .sort({ createdAt: 1 })
      .populate('sender', 'username')
      .populate('receiver', 'username')
      .exec();
  }

  async getUserConversations(userId: string) {
    const messages = await this.messageModel
      .find({
        $or: [{ sender: userId }, { receiver: userId }],
      })
      .sort({ createdAt: -1 }) 
      .populate('sender', 'username')
      .populate('receiver', 'username')
      .exec();

    const conversationsMap = new Map<string, any>();

    for (const msg of messages) {
      const sender = msg.sender as any;
      const receiver = msg.receiver as any;

      const otherUser = sender._id.toString() === userId ? receiver : sender;
      const otherUserId = otherUser._id.toString();

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          user: {
            id: otherUserId,
            username: otherUser.username,
          },
          lastMessage: {
            content: msg.content,
            createdAt: msg.createdAt,
          },
        });
      }
    }

    return Array.from(conversationsMap.values());
  }

  async updateMessage(messageId: string, userId: string, newContent: string) {
    const message = await this.messageModel.findById(messageId);
  
    if (!message) {
      throw new NotFoundException('Message not found');
    }
  
    if (message.sender.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to update this message');
    }
  
    message.content = newContent;
    await message.save();
  
    return { message: 'Message updated successfully', updated: message };
  }
  
  async deleteMessage(messageId: string) {
    return this.messageModel.findByIdAndDelete(messageId);
  }

  async findMessageById(messageId: string) {
    return this.messageModel.findById(messageId);
  }
  
  async deleteMessageIfOwner(messageId: string, userId: string): Promise<void> {
    const message = await this.findMessageById(messageId);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    console.log('delete message')
    console.log(message)

    if (message.sender.toString() !== userId.toString()) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.deleteMessage(messageId);
  }
  
}