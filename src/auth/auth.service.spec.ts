import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    userService = {
      findByEmailOrUsername: jest.fn(),
      createUser: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should throw if email or username exists', async () => {
      userService.findByEmailOrUsername!.mockResolvedValue({ _id: '123' });

      await expect(
        service.register({
          email: 'test@example.com',
          username: 'test',
          password: 'password',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should hash password and create user', async () => {
      userService.findByEmailOrUsername!.mockResolvedValue(null);
      userService.createUser!.mockResolvedValue({ _id: 'abc', username: 'test' });

      const result = await service.register({
        email: 'test@example.com',
        username: 'test',
        password: 'password123',
      });

      expect(userService.createUser).toHaveBeenCalled();
      expect(result.message).toBe('User registered successfully');
    });
  });

  describe('login', () => {
    it('should throw if user not found', async () => {
      userService.findByEmailOrUsername!.mockResolvedValue(null);

      await expect(
        service.login({ identifier: 'user@example.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password does not match', async () => {
      userService.findByEmailOrUsername!.mockResolvedValue({ password: await bcrypt.hash('correct', 10) });

      await expect(
        service.login({ identifier: 'user@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return token if login successful', async () => {
      const hashed = await bcrypt.hash('secret', 10);
      userService.findByEmailOrUsername!.mockResolvedValue({ _id: 'abc', password: hashed });
      jwtService.sign!.mockReturnValue('fake-jwt');

      const result = await service.login({ identifier: 'user@example.com', password: 'secret' });

      expect(result.access_token).toBe('fake-jwt');
    });
  });
});
