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

  @MessagePattern('get_monitor_requests')
  async handleGetRequests() {
    console.log('Received request to get all monitor requests');
    return this.monitorService.getAllMonitorRequests();
  }

  @MessagePattern('get_monitor_applications')
  async handleGetApplications(@Payload() data: { email: string }) {
    console.log('Received request to get monitor applications for user:', data.email);
    return this.monitorService.getMonitorApplications(data.email);
  }

  @MessagePattern('change_monitor_status')
  async handleSetRequestStatus(@Payload() data: { uuid: string, status: string }) {
    console.log('Received request to set monitor request status:', data);
    return this.monitorService.setMonitorRequestStatus(data.uuid, data.status);
  }

  @MessagePattern('get_all_monitor_applications')
  async handleGetAllApplications() {
    console.log('Received request to get all monitor applications');
    return this.monitorService.getAllMonitorApplications();
  }

}