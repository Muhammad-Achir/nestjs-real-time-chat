import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from './profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { getHoroscope } from 'src/utils/horoscope/date.utils';
import { getZodiac } from 'src/utils/zodiac/zodiac.utils';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile.name) private profileModel: Model<Profile>) { }

  async createProfile(userId: string, dto: CreateProfileDto): Promise<Profile> {
    const existing = await this.profileModel.findOne({ userId });
    if (existing) {
      throw new BadRequestException('Profile already exists');
    }

    const { birthday } = dto;
    const zodiac = getZodiac(birthday);
    const horoscope = getHoroscope(new Date(birthday));

    const created = new this.profileModel({
      ...dto,
      userId,
      zodiac,
      horoscope,
    });

    return created.save();
  }

  async getProfile(userId: string): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<Profile> {
    if (dto.birthday) {
      dto.zodiac = getZodiac(dto.birthday);
      dto.horoscope = getHoroscope(new Date(dto.birthday));
    }

    const updated = await this.profileModel.findOneAndUpdate(
      { userId },
      { $set: dto },
      { new: true },
    );

    if (!updated) throw new NotFoundException('Profile not found');
    return updated;
  }
}
