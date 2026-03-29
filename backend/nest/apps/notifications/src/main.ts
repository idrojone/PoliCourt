import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_DEFAULT_USER || 'rabbitmq'}:${process.env.RABBITMQ_DEFAULT_PASS || 'rabbitmq'}@${process.env.RABBITMQ_HOST || 'localhost'}:${process.env.RABBITMQ_PORT || 5672}${process.env.RABBITMQ_DEFAULT_VHOST || '/'}`;

  const app = await NestFactory.createMicroservice(NotificationsModule, {
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL],
      queue: 'notifications_queue',
      queueOptions: { durable: true },
    },
  });

  await app.listen();
}

bootstrap();
