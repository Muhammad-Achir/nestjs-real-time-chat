import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Get('viewMessages/:userId')
  async getConversation(
    @Req() req: Request,
    @Param('userId') otherUserId: string,
  ) {
    const currentUserId = req.user['sub'];
    return this.messageService.findMessagesBetweenUsers(currentUserId, otherUserId);
  }

  @Get('viewMessages')
  async getAllConversations(@Req() req: Request) {
    const currentUserId = req.user['sub'];
    return this.messageService.getUserConversations(currentUserId);
  }

  @Patch('updateMessage/:messageId')
  async updateMessage(
    @Param('messageId') messageId: string,
    @Body() data: UpdateMessageDto,
    @Req() req: Request,
  ) {
    const userId = req.user['sub'];
    return this.messageService.updateMessage(messageId, userId, data.content);
  }

  @Delete('deleteMessage/:messageId')
  async deleteMessage(
    @Param('messageId') messageId: string,
    @Req() req: Request,
  ) {
    const currentUserId = req.user['sub'];
    await this.messageService.deleteMessageIfOwner(messageId, currentUserId);

    return { message: 'Message deleted successfully' };
  }
}