import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatbotService {
  getHello(): string {
    return 'Hello World!';
  }
}
