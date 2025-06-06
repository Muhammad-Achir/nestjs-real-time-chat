import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './profile.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: Profile.name,
        schema: ProfileSchema
      }
    ])
  ],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfilesModule {}
