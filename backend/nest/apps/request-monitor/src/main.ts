import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { RequestMonitorModule } from './request-monitor.module';

async function bootstrap() {
  const rabbitUser = process.env.RABBITMQ_DEFAULT_USER || 'rabbitmq';
  const rabbitPass = process.env.RABBITMQ_DEFAULT_PASS || 'rabbitmq';
  const rabbitHost = process.env.RABBITMQ_HOST || 'localhost';
  const rabbitPort = process.env.RABBITMQ_PORT || 5672;
  const rabbitVhost = process.env.RABBITMQ_DEFAULT_VHOST || '/';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RequestMonitorModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${rabbitUser}:${rabbitPass}@${rabbitHost}:${rabbitPort}${rabbitVhost}`],
        queue: 'monitor_queue',
        queueOptions: { durable: true },
      },
    },
  );
  await app.listen();
  console.log('Request Monitor Microservice is listening on RabbitMQ queue monitor_queue');
}
bootstrap();