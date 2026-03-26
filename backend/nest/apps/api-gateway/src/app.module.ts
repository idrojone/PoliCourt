import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_DEFAULT_USER || 'rabbitmq'}:${process.env.RABBITMQ_DEFAULT_PASS || 'rabbitmq'}@${process.env.RABBITMQ_HOST || 'localhost'}:${process.env.RABBITMQ_PORT || 5672}${process.env.RABBITMQ_DEFAULT_VHOST || '/'}`;

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MONITOR_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: 'monitor_queue',
          queueOptions: { durable: true },
        },
      },
      {
        name: 'CHATBOT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: 'chatbot_queue',
          queueOptions: { durable: true },
        },
      },
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: 'notifications_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
