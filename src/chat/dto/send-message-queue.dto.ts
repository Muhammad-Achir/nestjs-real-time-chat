import { IsString } from 'class-validator';

export class SendMessageQueueDto {
  @IsString()
  senderId: string;

  @IsString()
  receiverId: string;

  @IsString()
  content: string;
}
