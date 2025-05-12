import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  identifier: string; // username or email

  @IsNotEmpty()
  password: string;
}
