import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { getModelToken } from '@nestjs/mongoose';
import { ChatQueueService } from './queue/chat-queue.service';
import { NotFoundException } from '@nestjs/common';

describe('ChatService', () => {
  let service: ChatService;
  let userModel: any;
  let chatQueueService: any;

  beforeEach(async () => {
    userModel = {
      findById: jest.fn(),
    };

    chatQueueService = {
      publishToPrivateChat: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: getModelToken('User'), useValue: userModel },
        { provide: ChatQueueService, useValue: chatQueueService },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should queue message if receiver exists', async () => {
    const dto = {
      senderId: '1',
      receiverId: '2',
      content: 'Hello',
    };

    userModel.findById.mockResolvedValue({ _id: '2' });

    const result = await service.sendMessageToQueue(dto);

    expect(userModel.findById).toHaveBeenCalledWith('2');
    expect(chatQueueService.publishToPrivateChat).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ queued: true });
  });

  it('should throw NotFoundException if receiver not found', async () => {
    const dto = {
      senderId: '1',
      receiverId: '2',
      content: 'Hello',
    };

    userModel.findById.mockResolvedValue(null);

    await expect(service.sendMessageToQueue(dto)).rejects.toThrow(NotFoundException);
  });
});
