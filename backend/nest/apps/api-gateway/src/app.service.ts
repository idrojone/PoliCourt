import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMonitorRequestDto } from './dto/create-monitor-request.dto';
import { firstValueFrom } from 'rxjs'; 

@Injectable()
export class AppService {
  constructor(
    @Inject('MONITOR_SERVICE') private readonly monitorClient: ClientProxy,
  ) { }

  async applyForMonitor(dto: CreateMonitorRequestDto, files: Express.Multer.File[]) {
   
    const documentPaths = files ? files.map(file => file.path) : [];

    if (documentPaths.length === 0) {
      throw new Error('Debe subir al menos un documento acreditativo.');
    }

    const payload = {
      ...dto,
      documents: documentPaths,
    };


    try {
      const response = await firstValueFrom(
        this.monitorClient.send('create_monitor_request', payload)
      );
      return { status: 'success', data: response };
    } catch (error: any) {
      throw new Error(`Error comunicándose con el servicio de monitores: ${error.message}`);
    }
  }
}