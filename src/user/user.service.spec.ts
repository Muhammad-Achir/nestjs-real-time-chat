import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User } from './user.schema';

describe('UserService', () => {
  let service: UserService;
  let model: any;

  const mockUser = {
    save: jest.fn(),
  };

  const mockModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
  };

  const mockModelFactory = jest.fn(() => mockUser);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: Object.assign(mockModelFactory, mockModel),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get(getModelToken(User.name));
  });

  it('should create a user', async () => {
    const data = { email: 'test@example.com', username: 'testuser' };
    mockUser.save.mockResolvedValue({ _id: 'abc123', ...data });

    const result = await service.createUser(data);

    expect(result).toEqual(expect.objectContaining(data));
    expect(mockUser.save).toHaveBeenCalled();
  });

  it('should find user by email or username', async () => {
    const user = { email: 'test@example.com', username: 'testuser' };
    model.findOne.mockResolvedValue(user);

    const result = await service.findByEmailOrUsername('test@example.com', 'testuser');

    expect(model.findOne).toHaveBeenCalledWith({
      $or: [
        { email: 'test@example.com' },
        { username: 'testuser' },
      ],
    });
    expect(result).toEqual(user);
  });

  it('should find user by ID', async () => {
    const user = { _id: 'abc123', email: 'test@example.com' };
    const execMock = jest.fn().mockResolvedValue(user);
    model.findById.mockReturnValue({ exec: execMock });

    const result = await service.findById('abc123');

    expect(model.findById).toHaveBeenCalledWith('abc123');
    expect(result).toEqual(user);
  });
});
