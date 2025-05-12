import { Controller, Post, Body, UseGuards, Req, NotFoundException, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UserService } from 'src/user/user.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) { }

  @Post('sendMessage')
  async sendMessage(
    @Body() body: SendMessageDto,
    @Req() req: Request,
  ) {
    const senderId = req.user['sub'];

    console.log('send message c')
    const result = await this.chatService.sendMessageToQueue({
      senderId,
      receiverId: body.receiverId,
      content: body.content,
    });
    console.log('send message result', result)

    return {
      success: true,
      message: 'Message sent to queue',
      data: result,
    };
  }
}
