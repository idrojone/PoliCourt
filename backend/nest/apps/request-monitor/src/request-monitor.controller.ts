import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class RequestMonitorController {

  @EventPattern('log_request')
  handleRequestLog(@Payload() data: any) {
    console.log('Evento recibido en Request Monitor:', data);
  }
}