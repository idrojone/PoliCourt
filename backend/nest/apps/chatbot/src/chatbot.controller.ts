import { Controller, Get } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller()
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Get()
  getHello(): string {
    return this.chatbotService.getHello();
  }
}
