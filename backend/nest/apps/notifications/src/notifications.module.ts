import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { EmailService } from './email.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [NotificationsController],
  providers: [AiService, EmailService],
})
export class NotificationsModule {}
