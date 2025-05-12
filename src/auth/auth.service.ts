import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userService.findByEmailOrUsername(dto.email, dto.username);
    if (existing) {
      throw new ConflictException('Email or username already exists');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.createUser({
      ...dto,
      password: hashed,
    });

    return { message: 'User registered successfully', user };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmailOrUsername(dto.identifier, dto.identifier);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user._id };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
}
