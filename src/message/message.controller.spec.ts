import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

describe('MessageController', () => {
  let controller: MessageController;
  let messageService: any;

  const mockRequest = (userId: string) => ({
    user: { sub: userId },
  }) as any;

  beforeEach(async () => {
    messageService = {
      findMessagesBetweenUsers: jest.fn(),
      getUserConversations: jest.fn(),
      updateMessage: jest.fn(),
      deleteMessageIfOwner: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [{ provide: MessageService, useValue: messageService }],
    }).compile();

    controller = module.get<MessageController>(MessageController);
  });

  it('should get messages between users', async () => {
    messageService.findMessagesBetweenUsers.mockResolvedValue(['msg1', 'msg2']);

    const result = await controller.getConversation(
      mockRequest('1'),
      '2'
    );

    expect(result).toEqual(['msg1', 'msg2']);
    expect(messageService.findMessagesBetweenUsers).toHaveBeenCalledWith('1', '2');
  });

  it('should get all user conversations', async () => {
    messageService.getUserConversations.mockResolvedValue(['conv1']);

    const result = await controller.getAllConversations(mockRequest('1'));

    expect(result).toEqual(['conv1']);
    expect(messageService.getUserConversations).toHaveBeenCalledWith('1');
  });

  it('should update a message', async () => {
    messageService.updateMessage.mockResolvedValue({ updated: true });

    const result = await controller.updateMessage(
      'msg123',
      { content: 'new message' },
      mockRequest('1'),
    );

    expect(result).toEqual({ updated: true });
    expect(messageService.updateMessage).toHaveBeenCalledWith('msg123', '1', 'new message');
  });

  it('should delete a message', async () => {
    const result = await controller.deleteMessage('msg123', mockRequest('1'));

    expect(result).toEqual({ message: 'Message deleted successfully' });
    expect(messageService.deleteMessageIfOwner).toHaveBeenCalledWith('msg123', '1');
  });
});
