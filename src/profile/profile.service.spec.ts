import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Profile } from './profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

jest.mock('src/utils/horoscope/date.utils', () => ({
  getHoroscope: jest.fn().mockReturnValue('Scorpio'),
}));

jest.mock('src/utils/zodiac/zodiac.utils', () => ({
  getZodiac: jest.fn().mockReturnValue('Tiger'),
}));

describe('ProfileService', () => {
  let service: ProfileService;
  let model: any;

  const mockProfile = {
    save: jest.fn(),
  };

  const mockModel = {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };

  const profileModelFactory = jest.fn(() => mockProfile);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getModelToken(Profile.name),
          useValue: Object.assign(profileModelFactory, mockModel),
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    model = module.get(getModelToken(Profile.name));
  });

  it('should create a profile with zodiac and horoscope', async () => {
    const dto: CreateProfileDto = {
      birthday: '2000-01-01',
      name: 'John Doe',
    } as any;

    mockProfile.save.mockResolvedValue({ ...dto, zodiac: 'Tiger', horoscope: 'Scorpio' });

    const result = await service.createProfile('user123', dto);

    expect(result).toEqual(expect.objectContaining({
      name: 'John Doe',
      zodiac: 'Tiger',
      horoscope: 'Scorpio',
    }));
    expect(mockProfile.save).toHaveBeenCalled();
  });

  it('should return profile if found', async () => {
    const mockResult = { userId: 'user123', name: 'John' };
    model.findOne.mockResolvedValue(mockResult);

    const result = await service.getProfile('user123');

    expect(result).toEqual(mockResult);
    expect(model.findOne).toHaveBeenCalledWith({ userId: 'user123' });
  });

  it('should throw NotFoundException if profile not found on getProfile', async () => {
    model.findOne.mockResolvedValue(null);
    await expect(service.getProfile('user123')).rejects.toThrow(NotFoundException);
  });

  it('should update profile and return it', async () => {
    const dto: UpdateProfileDto = {
      birthday: '2000-01-01',
      name: 'Updated Name',
    };

    const updatedProfile = {
      userId: 'user123',
      name: 'Updated Name',
      zodiac: 'Tiger',
      horoscope: 'Scorpio',
    };

    model.findOneAndUpdate.mockResolvedValue(updatedProfile);

    const result = await service.updateProfile('user123', dto);

    expect(result).toEqual(updatedProfile);
    expect(model.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: 'user123' },
      { $set: expect.objectContaining(dto) },
      { new: true },
    );
  });

  it('should throw NotFoundException if profile not found on update', async () => {
    model.findOneAndUpdate.mockResolvedValue(null);
    await expect(service.updateProfile('user123', {})).rejects.toThrow(NotFoundException);
  });
});
