import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RequestMonitorService } from './request-monitor.service';
import { type CreateMonitorPayload } from './interfaces/monitor-payload.interface';

@Controller()
export class RequestMonitorController {
  constructor(private readonly monitorService: RequestMonitorService) { }

  @MessagePattern('create_monitor_request')
  async handleCreateRequest(@Payload() data: CreateMonitorPayload) { 
    console.log('Received monitor request:', data);
    return this.monitorService.createMonitorRequest(data);
  }
}