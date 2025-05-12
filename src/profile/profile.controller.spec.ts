import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  const mockProfileService = {
    createProfile: jest.fn(),
    updateProfile: jest.fn(),
    getProfile: jest.fn(),
  };

  const mockRequest = {
    user: { sub: 'user123' },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  it('should call createProfile with correct params', async () => {
    const dto: CreateProfileDto = { name: 'John Doe', age: 30 } as any;
    await controller.createProfile(dto, mockRequest);

    expect(service.createProfile).toHaveBeenCalledWith('user123', dto);
  });

  it('should call updateProfile with correct params', async () => {
    const dto: UpdateProfileDto = { name: 'Jane Doe' } as any;
    await controller.updateProfile(dto, mockRequest);

    expect(service.updateProfile).toHaveBeenCalledWith('user123', dto);
  });

  it('should call getProfile with correct user id', async () => {
    await controller.getProfile(mockRequest);

    expect(service.getProfile).toHaveBeenCalledWith('user123');
  });
});
