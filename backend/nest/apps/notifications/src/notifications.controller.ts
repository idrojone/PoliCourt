import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AiService } from './ai.service';
import { EmailService } from './email.service';

export interface NotificationPayload {
  userEmail: string;
  task_description: string;
  data?: any;
  tone?: string;
  timeZone?: string;
}

@Controller()
export class NotificationsController {
  constructor(
    private readonly aiService: AiService,
    private readonly emailService: EmailService,
  ) { }

  @EventPattern('send_ai_email_notification')
  async handleNotificationEvent(@Payload() payload: NotificationPayload) {
    try {
      const content = await this.aiService.generateEmailContent(
        payload.task_description,
        payload.data,
        payload.tone,
        payload.timeZone,
      );

      await this.emailService.sendEmail(payload.userEmail, content.subject, content.body);
    } catch (error) {
      console.error('[notifications-ms] Error crítico procesando la notificación en cola:', error);
    }
  }
}