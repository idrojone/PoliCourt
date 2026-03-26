import { Controller, Get, Inject, Post, Body } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(@Inject('MONITOR_SERVICE') private readonly monitorClient: ClientProxy) {}

  @Post('log')
  logRequest(@Body() data: any) {
    this.monitorClient.emit('log_request', data);
    console.log(this.monitorClient.emit('log_request', data));
    return { status: 'Request logged successfully', data };
  }
}
