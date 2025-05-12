import { IsNotEmpty, IsString } from 'class-validator';
import { IsObjectId } from 'src/common/validators/is-object-id.validator';

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  @IsObjectId({ message: 'receiverId must be a valid userId' })
  receiverId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
