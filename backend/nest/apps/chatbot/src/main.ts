import { NestFactory } from '@nestjs/core';
import { ChatbotModule } from './chatbot.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatbotModule);
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}
bootstrap();
