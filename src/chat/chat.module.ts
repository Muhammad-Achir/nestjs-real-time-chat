import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatConsumer } from './chat.consumer';
import { ChatController } from './chat.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MessageModule } from 'src/message/message.module';
import { UserModule } from 'src/user/user.module';
import { ChatQueueService } from './queue/chat-queue.service';

@Module({
  imports: [
    AuthModule,
    MessageModule,
    UserModule,
  ],
  controllers:[ChatController],
  providers: [
    ChatGateway, 
    ChatService, 
    ChatConsumer, 
    ChatQueueService
  ],
})
export class ChatModule {}
