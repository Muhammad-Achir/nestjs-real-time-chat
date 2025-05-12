import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async createUser(data: Partial<User>) {
    const created = new this.userModel(data);
    return created.save();
  }

  async findByEmailOrUsername(emailOrUsername: string, username: string) {
    return this.userModel.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: username },
      ],
    });
  }

  async findById(userId: string) {
    return this.userModel.findById(userId).exec();
  }

}
