import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestMonitorService {
  getHello(): string {
    return 'Hello World!';
  }
}
