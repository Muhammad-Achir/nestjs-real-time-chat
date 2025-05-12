import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';
import { SendMessageDto } from './dto/send-message.dto';

describe('ChatController', () => {
  let chatController: ChatController;
  let chatService: ChatService;

  // Mocking ChatService
  const mockChatService = {
    sendMessageToQueue: jest.fn(),
  };

  const mockUserService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        { provide: ChatService, useValue: mockChatService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    chatController = module.get<ChatController>(ChatController);
    chatService = module.get<ChatService>(ChatService);
  });

  describe('sendMessage', () => {
    it('should send message and return success response', async () => {
      // Arrange: Set up mock data and mock return value
      const sendMessageDto: SendMessageDto = {
        receiverId: 'receiverId123',
        content: 'Test message',
      };

      const mockResult = { message: 'Message sent to queue' };
      mockChatService.sendMessageToQueue.mockResolvedValue(mockResult);

      const req = {
        user: { sub: 'senderId123' }, // Mocked user
      } as unknown as Request;

      // Act: Call the method
      const response = await chatController.sendMessage(sendMessageDto, req);

      // Assert: Check that the response is correct
      expect(response).toEqual({
        success: true,
        message: 'Message sent to queue',
        data: mockResult,
      });

      // Ensure that sendMessageToQueue was called with correct params
      expect(chatService.sendMessageToQueue).toHaveBeenCalledWith({
        senderId: 'senderId123',
        receiverId: sendMessageDto.receiverId,
        content: sendMessageDto.content,
      });
    });
  });
});
