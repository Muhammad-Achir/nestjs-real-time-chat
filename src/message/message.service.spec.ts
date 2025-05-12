import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('MessageService', () => {
  let service: MessageService;
  let model: any;

  const saveMock = jest.fn().mockResolvedValue({ content: 'Hi' });

  const mockMessageConstructor = jest.fn().mockImplementation(() => ({
    save: saveMock,
  }));

  const mockMessageModel = Object.assign(mockMessageConstructor, {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: getModelToken('Message'),
          useValue: mockMessageModel,
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    model = module.get(getModelToken('Message'));
  });

  it('should create a message', async () => {
    const result = await service.createMessage('1', '2', 'Hi');
  
    expect(result).toEqual({ content: 'Hi' });
    expect(mockMessageConstructor).toHaveBeenCalledWith({ sender: '1', receiver: '2', content: 'Hi' });
    expect(saveMock).toHaveBeenCalled();
  });
  

  it('should find messages between users', async () => {
    const execMock = jest.fn().mockResolvedValue(['msg1']);
    const chain = {
      sort: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: execMock,
    };
    model.find.mockReturnValue(chain);

    const result = await service.findMessagesBetweenUsers('1', '2');
    expect(result).toEqual(['msg1']);
  });

  it('should update a message successfully', async () => {
    const message = {
      sender: '1',
      content: 'old',
      save: jest.fn().mockResolvedValue(true),
    };
    model.findById.mockResolvedValue(message);

    const result = await service.updateMessage('123', '1', 'new');

    expect(result.message).toBe('Message updated successfully');
    expect(message.content).toBe('new');
    expect(message.save).toHaveBeenCalled();
  });

  it('should throw if updating non-existent message', async () => {
    model.findById.mockResolvedValue(null);
    await expect(service.updateMessage('123', '1', 'new')).rejects.toThrow(NotFoundException);
  });

  it('should throw if updating message not owned by user', async () => {
    const message = { sender: '999' };
    model.findById.mockResolvedValue(message);

    await expect(service.updateMessage('123', '1', 'new')).rejects.toThrow('You are not authorized');
  });

  it('should delete message if owner', async () => {
    const message = { sender: '1' };
    model.findById.mockResolvedValue(message);
    model.findByIdAndDelete.mockResolvedValue({});

    await service.deleteMessageIfOwner('123', '1');
    expect(model.findByIdAndDelete).toHaveBeenCalledWith('123');
  });

  it('should throw if deleteMessageIfOwner called by non-owner', async () => {
    model.findById.mockResolvedValue({ sender: '2' });
    await expect(service.deleteMessageIfOwner('123', '1')).rejects.toThrow(ForbiddenException);
  });

  it('should throw if message not found when deleting', async () => {
    model.findById.mockResolvedValue(null);
    await expect(service.deleteMessageIfOwner('123', '1')).rejects.toThrow(NotFoundException);
  });
});
