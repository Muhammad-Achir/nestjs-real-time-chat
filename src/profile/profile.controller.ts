import { Controller, Get, Post, Put, Body, Req, UseGuards } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post('createProfile')
  createProfile(@Body() dto: CreateProfileDto, @Req() req: Request) {
    const userId = req.user['sub'];
    return this.profileService.createProfile(userId, dto);
  }

  @Put('updateProfile')
  updateProfile(@Body() dto: UpdateProfileDto, @Req() req: Request) {
    const userId = req.user['sub'];
    return this.profileService.updateProfile(userId, dto);
  }

  @Get('getProfile')
  getProfile(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.profileService.getProfile(userId);
  }
}
