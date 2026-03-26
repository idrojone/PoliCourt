import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestMonitorController } from './request-monitor.controller';
import { RequestMonitorService } from './request-monitor.service';
import { MonitorRequest, MonitorRequestSchema } from './schemas/monitor-request.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: MonitorRequest.name, schema: MonitorRequestSchema }]),
  ],
  controllers: [RequestMonitorController],
  providers: [RequestMonitorService],
})
export class RequestMonitorModule {}
